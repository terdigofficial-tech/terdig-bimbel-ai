import { createServerClient } from '@/lib/supabase-server';

// Bobot penilaian (mudah diubah)
const WEIGHT_OBSERVATION = 0.5; // 50%
const WEIGHT_WORKSHEET = 0.5;   // 50%

export async function checkAndPromoteStudent(studentId: string) {
  const supabase = createServerClient();

  console.log('\n========================================');
  console.log('=== PROGRESSION CHECK ===');
  console.log('Student ID:', studentId);
  console.log('========================================');

  // Ambil 4 sesi terakhir yang dihadiri siswa beserta nilainya
  const { data: attendances } = await supabase
    .from('attendance')
    .select('session_id, status')
    .eq('student_id', studentId)
    .order('date', { ascending: false })
    .limit(4);

  if (!attendances || attendances.length < 4) {
    console.log('❌ Belum 4 sesi:', attendances?.length || 0);
    return;
  }

  // Hitung kehadiran
  const presentCount = attendances.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = (presentCount / 4) * 100;
  console.log(`✓ Kehadiran: ${presentCount}/4 (${attendanceRate}%)`);
  
  if (attendanceRate < 85) {
    console.log('❌ Kehadiran di bawah 85%');
    return;
  }

  // Ambil nilai assessment (observasi) untuk 4 sesi tersebut
  const sessionIds = attendances.map(a => a.session_id);
  const { data: assessments } = await supabase
    .from('assessments')
    .select('total_score')
    .eq('student_id', studentId)
    .in('session_id', sessionIds);

  if (!assessments || assessments.length < 4) {
    console.log('❌ Nilai observasi tidak lengkap:', assessments?.length || 0);
    return;
  }

  const avgObservation = assessments.reduce((sum, a) => sum + (a.total_score || 0), 0) / 4;
  console.log(`✓ Rata-rata observasi: ${avgObservation.toFixed(1)}`);

  // Ambil nilai worksheet untuk 4 sesi yang sama
  const { data: worksheets } = await supabase
    .from('worksheet_submissions')
    .select('score')
    .eq('student_id', studentId)
    .in('session_id', sessionIds);

  let avgWorksheet = 0;
  if (worksheets && worksheets.length > 0) {
    avgWorksheet = worksheets.reduce((sum, w) => sum + (w.score || 0), 0) / worksheets.length;
    console.log(`✓ Rata-rata lembar kerja: ${avgWorksheet.toFixed(1)} (${worksheets.length} sesi)`);
  } else {
    console.log('⚠ Tidak ada nilai lembar kerja');
  }

  // Gabungkan nilai dengan bobot
  let finalScore: number;
  if (avgWorksheet > 0) {
    finalScore = (avgObservation * WEIGHT_OBSERVATION) + (avgWorksheet * WEIGHT_WORKSHEET);
    console.log(`✓ Nilai akhir (gabungan): ${finalScore.toFixed(1)}`);
    console.log(`  = (${avgObservation.toFixed(1)} × ${WEIGHT_OBSERVATION}) + (${avgWorksheet.toFixed(1)} × ${WEIGHT_WORKSHEET})`);
  } else {
    finalScore = avgObservation;
    console.log(`✓ Nilai akhir (observasi saja): ${finalScore.toFixed(1)}`);
  }

  if (finalScore < 80) {
    console.log('❌ Nilai akhir di bawah 80');
    return;
  }

  // Syarat terpenuhi: naik level
  const { data: student } = await supabase.from('students').select('current_level').eq('id', studentId).single();
  if (!student) {
    console.log('❌ Siswa tidak ditemukan');
    return;
  }

  const newLevel = student.current_level + 1;
  await supabase.from('students').update({ current_level: newLevel }).eq('id', studentId);

  // Catat history
  await supabase.from('progression_history').insert({
    student_id: studentId,
    from_level: student.current_level,
    to_level: newLevel,
    reason: `Observasi ${avgObservation.toFixed(1)}, Lembar Kerja ${avgWorksheet.toFixed(1)}, Nilai Akhir ${finalScore.toFixed(1)}, Kehadiran ${attendanceRate}%`
  });

  console.log(`✅ PROMOTED: Level ${student.current_level} → ${newLevel}`);
  console.log('========================================\n');

  return { promoted: true, newLevel, finalScore: finalScore.toFixed(1), avgObservation: avgObservation.toFixed(1), avgWorksheet: avgWorksheet.toFixed(1), attendanceRate };
}
