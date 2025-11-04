import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, fileSize, userId, ticketId } = await request.json();

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json({ 
        error: 'Missing required fields: fileName, fileType, fileSize' 
      }, { status: 400 });
    }

    // Validate file type - support common video formats
    const allowedVideoTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/mov',
      'video/quicktime',
      'video/x-msvideo',
      'video/3gpp',
      'video/x-ms-wmv'
    ];

    if (!allowedVideoTypes.includes(fileType)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only video files are allowed.' 
      }, { status: 400 });
    }

    // Validate file size - support up to 2GB
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB in bytes
    if (fileSize > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 2GB.' 
      }, { status: 400 });
    }

    // Create organized file path: user_id/ticket_id/timestamp_filename
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = ticketId 
      ? `${userId}/${ticketId}/${timestamp}_${sanitizedFileName}`
      : `${userId}/${timestamp}_${sanitizedFileName}`;

    // Generate presigned URL for upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('student-videos')
      .createSignedUploadUrl(filePath, {
        upsertable: true // Allow overwriting if needed
      });

    if (uploadError) {
      console.error('Error creating presigned URL:', uploadError);
      return NextResponse.json({ 
        error: 'Failed to create upload URL' 
      }, { status: 500 });
    }

    // Generate public URL for accessing the video after upload
    const { data: publicUrlData } = supabase.storage
      .from('student-videos')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      uploadUrl: uploadData.signedUrl,
      publicUrl: publicUrlData.publicUrl,
      filePath: filePath,
      token: uploadData.token
    });

  } catch (error) {
    console.error('Video upload API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Optional: Add a GET endpoint to retrieve video URLs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('filePath');

    if (!filePath) {
      return NextResponse.json({ 
        error: 'Missing filePath parameter' 
      }, { status: 400 });
    }

    // Get public URL for the video
    const { data: publicUrlData } = supabase.storage
      .from('student-videos')
      .getPublicUrl(filePath);

    // Check if file exists
    const { data: fileInfo, error } = await supabase.storage
      .from('student-videos')
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop()
      });

    if (error || !fileInfo || fileInfo.length === 0) {
      return NextResponse.json({ 
        error: 'Video not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      publicUrl: publicUrlData.publicUrl,
      fileInfo: fileInfo[0]
    });

  } catch (error) {
    console.error('Video retrieval API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}