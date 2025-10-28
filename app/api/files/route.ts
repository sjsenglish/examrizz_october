import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser(
      request.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }

    return NextResponse.json({ files: data });

  } catch (error) {
    console.error('Files fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser(
      request.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: fileRecord, error: fetchError } = await supabase
      .from('user_uploads')
      .select('file_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !fileRecord) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const { error: deleteDbError } = await supabase
      .from('user_uploads')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteDbError) {
      console.error('Database delete error:', deleteDbError);
      return NextResponse.json({ error: 'Failed to delete file record' }, { status: 500 });
    }

    const { error: deleteStorageError } = await supabase.storage
      .from('user-materials')
      .remove([fileRecord.file_path]);

    if (deleteStorageError) {
      console.error('Storage delete error:', deleteStorageError);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('File delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}