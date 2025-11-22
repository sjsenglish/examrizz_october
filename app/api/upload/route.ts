import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import mammoth from 'mammoth';
import { rateLimitApiRequest } from '../../../lib/redis-rate-limit';
import { validateFileIntegrity } from '../../../lib/file-validation';
const pdfParse = require('pdf-parse-fork');

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

    // Apply Redis rate limiting for uploads with user's subscription tier
    const rateLimitResult = await rateLimitApiRequest(user.id, 'upload', request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: `Upload limit exceeded for ${rateLimitResult.tier} tier. ${rateLimitResult.tier === 'free' ? 'Upgrade to Plus for 20 uploads/day or Max for 100 uploads/day.' : 'Try again tomorrow.'}`,
          resetTime: rateLimitResult.resetTime,
          tier: rateLimitResult.tier,
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining
        }, 
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'X-RateLimit-Tier': rateLimitResult.tier
          }
        }
      );
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
    
    // Validate file signature to prevent malicious files disguised as safe types
    const validationResult = validateFileIntegrity(buffer, file.type);
    if (!validationResult.valid) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 });
    }
    
    const uint8Array = new Uint8Array(buffer);

    let extractedText = '';

    try {
      if (fileExtension === 'pdf') {
        try {
          // Attempt PDF text extraction with pdf-parse-fork
          const pdfBuffer = Buffer.from(uint8Array);
          const pdfData = await pdfParse(pdfBuffer);
          extractedText = pdfData.text || '';
        } catch (pdfError) {
          // If PDF extraction fails, continue with empty text instead of failing the upload
          console.warn('PDF text extraction failed, continuing with empty text:', pdfError);
          extractedText = '';
        }
      } else if (fileExtension === 'docx') {
        const result = await mammoth.extractRawText({ buffer: Buffer.from(uint8Array) });
        extractedText = result.value;
      } else if (fileExtension === 'txt') {
        extractedText = new TextDecoder().decode(uint8Array);
      }
    } catch (extractionError) {
      // Only fail the upload for DOCX/TXT extraction errors, not PDF
      if (fileExtension !== 'pdf') {
        console.error('Text extraction error:', extractionError);
        return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 500 });
      }
      // For PDF, log warning and continue with empty text
      console.warn('Fallback: PDF extraction failed, continuing with empty text:', extractionError);
      extractedText = '';
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

    // Extract metadata from formData
    const category = formData.get('category') as string || null;
    const title = formData.get('title') as string || null;
    const description = formData.get('description') as string || null;
    const main_arguments = formData.get('main_arguments') as string || null;
    const conclusions = formData.get('conclusions') as string || null;
    const sources = formData.get('sources') as string || null;
    const methodology = formData.get('methodology') as string || null;
    const completion_date = formData.get('completion_date') as string || null;

    const fileRecord = {
      user_id: user.id,
      file_name: file.name,
      file_path: fileName,
      file_type: file.type,
      extracted_text: extractedText,
      category,
      title,
      description,
      main_arguments,
      conclusions,
      sources,
      methodology,
      completion_date,
      created_at: new Date().toISOString()
    };

    const { data: dbData, error: dbError } = await (supabase as any)
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