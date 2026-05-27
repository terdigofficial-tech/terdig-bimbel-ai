import Groq from 'groq-sdk';
import { createServerClient } from '@/lib/supabase-server';

function getGroqClient(): Groq {
  return new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
}

export async function generateParentReport(studentId: string, sessionId: string) {
  const supabase = createServerClient();

  const { data: student } = await supabase.from('students').select('*').eq('id', studentId).single();
  const { data: session } = await supabase.from('production_kits').select('*, modules(filename)').eq('id', sessionId).single();
  const { data: assessment } = await supabase.from('assessments').select('*').eq('student_id', studentId).eq('session_id', sessionId).single();
  const { data: attendanceList } = await supabase.from('attendance').select('status').eq('student_id', studentId).eq('session_id', sessionId).order('date', { ascending: false }).limit(1);
  const attendance = attendanceList?.[0];

  // Baca skor lembar kerja dari worksheet_submissions
  const { data: worksheet } = await supabase
    .from('worksheet_submissions')
    .select('score, ai_correction')
    .eq('student_id', studentId)
    .eq('session_id', sessionId)
    .maybeSingle();

  if (!student || !session || !assessment) return null;

  // Format catatan koreksi jika ada
  let correctionNote = '';
  if (worksheet?.ai_correction?.manual_text) {
    correctionNote = `- Catatan koreksi lembar kerja: ${worksheet.ai_correction.manual_text.substring(0, 150)}...`;
  }

  const prompt = `Buat laporan singkat untuk orang tua siswa SD dalam bahasa Indonesia yang natural, hangat, dan informatif. Gunakan data berikut:
- Nama siswa: ${student.full_name}
- Materi: ${session.modules?.filename}
- Status kehadiran: ${attendance?.status || 'tidak diketahui'}
- Nilai rata-rata: ${assessment.total_score}
- Catatan tutor: ${assessment.tutor_notes || 'Tidak ada'}
${worksheet ? `- Nilai lembar kerja: ${worksheet.score}/100` : ''}
${correctionNote}

Format laporan:
1. Pembuka (sapa orang tua, sebutkan materi hari ini)
2. Kehadiran
3. Capaian belajar & kekuatan
4. Area yang perlu ditingkatkan
5. Penutup (ajakan dukung belajar di rumah)

Jangan lebih dari 150 kata. Output HANYA teks laporan tanpa markdown.`;

  const completion = await getGroqClient().chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5
  });

  const content = completion.choices[0]?.message?.content || '';

  // Simpan ke parent_reports
  await supabase.from('parent_reports').insert({
    student_id: studentId,
    session_id: sessionId,
    report_type: 'post_session',
    content_json: { text: content },
    wa_status: 'pending'
  });

  return content;
}
