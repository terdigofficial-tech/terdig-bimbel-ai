import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    console.log('\n========================================');
    console.log('=== WORKSHEET UPLOAD API ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('========================================');

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const studentId = formData.get('student_id') as string;
    const sessionId = formData.get('session_id') as string;

    console.log('FormData received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      studentId,
      sessionId
    });

    if (!file || !studentId || !sessionId) {
      console.error('❌ ERROR: Missing required fields');
      return NextResponse.json({ 
        error: 'file, student_id, session_id wajib',
        missing: {
          hasFile: !!file,
          hasStudentId: !!studentId,
          hasSessionId: !!sessionId
        }
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('❌ ERROR: File size too large');
      return NextResponse.json({ 
        error: `File terlalu besar (${Math.round(file.size / 1024 / 1024)}MB). Max 10MB.`
      }, { status: 400 });
    }

    console.log('✓ Validation passed');

    // Get Supabase client
    console.log('\n--- Initializing Supabase client ---');
    const supabase = createServerClient();
    console.log('✓ Supabase client initialized');

    // CHECK: List buckets to verify worksheets bucket exists
    console.log('\n--- Checking bucket existence ---');
    const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
    
    if (bucketsErr) {
      console.error('❌ ERROR listing buckets:', bucketsErr.message);
      throw new Error(`Failed to list buckets: ${bucketsErr.message}`);
    }

    console.log('Buckets found:', buckets?.map(b => ({ name: b.name, public: b.public })) || []);

    const worksheetsBucket = buckets?.find(b => b.name === 'worksheets');
    if (!worksheetsBucket) {
      console.error('❌ ERROR: Bucket "worksheets" not found in Supabase');
      console.error('Available buckets:', buckets?.map(b => b.name).join(', ') || 'none');
      return NextResponse.json({ 
        success: false,
        error: 'Storage bucket "worksheets" tidak ditemukan',
        message: 'OWNER ACTION REQUIRED: Buat bucket di Supabase Dashboard → Storage → Create new bucket → nama: worksheets → centang "Public bucket" → Create',
        availableBuckets: buckets?.map(b => b.name) || [],
        solution: 'Bucket belum dibuat atau nama tidak sesuai'
      }, { status: 500 });
    }

    console.log('✓ Bucket "worksheets" exists and is public:', worksheetsBucket.public);

    // Upload ke Storage
    console.log('\n--- Uploading file to storage ---');
    const fileName = `${sessionId}/${studentId}/${Date.now()}_${file.name}`;
    console.log('Target path:', fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('Buffer details:', {
      size: buffer.length,
      type: 'Buffer',
      encoding: 'binary'
    });

    console.log('Calling supabase.storage.from("worksheets").upload()...');
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('worksheets')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadErr) {
      console.error('❌ Storage upload FAILED');
      console.error('Full error object:', JSON.stringify(uploadErr, null, 2));
      console.error('Error details:', {
        message: uploadErr.message,
        status: (uploadErr as any).status,
        statusCode: (uploadErr as any).statusCode,
        details: (uploadErr as any).details,
        hint: (uploadErr as any).hint,
        cause: (uploadErr as any).cause
      });
      throw new Error(`Storage upload failed: ${uploadErr.message}`);
    }

    console.log('✓ File uploaded successfully');
    console.log('Upload response:', JSON.stringify(uploadData, null, 2));

    // Dapatkan URL publik
    console.log('\n--- Getting public URL ---');
    const { data: urlData } = supabase.storage.from('worksheets').getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;
    console.log('✓ Public URL obtained:', imageUrl);

    // Simpan ke worksheet_submissions
    console.log('\n--- Saving submission to database ---');
    console.log('Inserting with columns: student_id, session_id, image_url');
    const { data: submission, error: insertErr } = await supabase
      .from('worksheet_submissions')
      .insert({ 
        student_id: studentId, 
        session_id: sessionId, 
        image_url: imageUrl
      })
      .select()
      .single();

    if (insertErr) {
      console.error('❌ Database insert FAILED:', {
        message: insertErr.message,
        code: (insertErr as any).code,
        details: (insertErr as any).details,
        hint: (insertErr as any).hint
      });
      throw new Error(`Database insert failed: ${insertErr.message}`);
    }

    console.log('✓ Submission saved to database');
    console.log('Submission:', JSON.stringify(submission, null, 2));
    console.log('\n✅ SUCCESS: Upload completed');
    console.log('========================================\n');

    return NextResponse.json({ 
      success: true, 
      submission,
      message: 'Lembar kerja berhasil di-upload'
    });
  } catch (err: any) {
    console.error('\n❌ CRITICAL ERROR in worksheet upload');
    console.error('Error message:', err.message);
    console.error('Error name:', err.name);
    console.error('Error stack:', err.stack);
    console.error('Full error object:', JSON.stringify(err, null, 2));
    console.error('========================================\n');

    return NextResponse.json({ 
      success: false,
      error: err.message || 'Upload lembar kerja gagal',
      details: err.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
