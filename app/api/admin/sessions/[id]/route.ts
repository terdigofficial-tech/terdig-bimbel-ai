import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: session } = await supabase.from('production_kits').select('*, modules(filename)').eq('id', id).single();
  
  // Filter siswa berdasarkan grade_id dari production_kits
  let students: any[] = [];
  if (session?.grade_id) {
    // Jika production kit punya grade_id, ambil siswa dengan grade_id yang sama
    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('status', 'active')
      .eq('grade_id', session.grade_id);
    students = data || [];
    console.log(`✓ Filter siswa untuk kelas: ${session.grade_id}, ditemukan: ${students.length}`);
  } else {
    // Jika tidak ada grade_id, ambil semua siswa aktif (kompatibilitas)
    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('status', 'active');
    students = data || [];
    console.log(`✓ Tidak ada filter kelas, ambil semua siswa: ${students.length}`);
  }

  const { data: attendance } = await supabase.from('attendance').select('*').eq('session_id', id);
  const { data: assessments } = await supabase.from('assessments').select('*').eq('session_id', id);

  return NextResponse.json({ session, students, attendance, assessments });
}
