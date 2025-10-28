import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser(
      request.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF, DOCX, and TXT files are allowed.' }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${user.id}/${Date.now()}-${file.name}`;

    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    let extractedText = '';

    try {
      if (fileExtension === 'pdf') {
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;
        let text = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          text += pageText + '\n';
        }
        
        extractedText = text.trim();
      } else if (fileExtension === 'docx') {
        const result = await mammoth.extractRawText({ buffer: Buffer.from(uint8Array) });
        extractedText = result.value;
      } else if (fileExtension === 'txt') {
        extractedText = new TextDecoder().decode(uint8Array);
      }
    } catch (extractionError) {
      console.error('Text extraction error:', extractionError);
      return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 500 });
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-materials')
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    const fileRecord = {
      user_id: user.id,
      file_name: file.name,
      file_path: fileName,
      file_type: file.type,
      extracted_text: extractedText,
      created_at: new Date().toISOString()
    };

    const { data: dbData, error: dbError } = await supabase
      .from('user_uploads')
      .insert(fileRecord)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      await supabase.storage.from('user-materials').remove([fileName]);
      return NextResponse.json({ error: 'Failed to save file record' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      file: {
        id: dbData.id,
        file_name: dbData.file_name,
        file_type: dbData.file_type,
        file_path: dbData.file_path,
        extracted_text: dbData.extracted_text,
        created_at: dbData.created_at
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}