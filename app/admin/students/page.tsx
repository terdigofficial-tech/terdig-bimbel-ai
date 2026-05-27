import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { Users, Plus, Edit2 } from 'lucide-react';

export const revalidate = 0;

export default async function StudentsPage() {
  const supabase = createServerClient();
  const { data: students } = await supabase.from('students').select('*').order('full_name');

  // Hitung progres sesi untuk setiap siswa (30 hari terakhir)
  const studentsWithProgress = await Promise.all(
    (students || []).map(async (s: any) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: attendance } = await supabase
        .from('attendance')
        .select('session_id')
        .eq('student_id', s.id)
        .eq('status', 'present')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

      const sessionCount = attendance?.length || 0;
      const isReady = sessionCount >= 4;

      // Fetch grade dan program info
      let gradeName = '-';
      let programName = '-';
      
      if (s.grade_id) {
        const { data: grade } = await supabase
          .from('grades')
          .select('name')
          .eq('id', s.grade_id)
          .single();
        if (grade) gradeName = grade.name;
      }

      if (s.program_id) {
        const { data: program } = await supabase
          .from('programs')
          .select('name')
          .eq('id', s.program_id)
          .single();
        if (program) programName = program.name;
      }

      return {
        ...s,
        sessionCount,
        isReady,
        gradeName,
        programName
      };
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Daftar Siswa</h2>
        <Link href="/admin/students/add" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Tambah Siswa
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Nama</th>
              <th className="px-6 py-4 font-semibold">Level</th>
              <th className="px-6 py-4 font-semibold">Kelas</th>
              <th className="px-6 py-4 font-semibold">Program</th>
              <th className="px-6 py-4 font-semibold">Progres Sesi</th>
              <th className="px-6 py-4 font-semibold">Wali</th>
              <th className="px-6 py-4 font-semibold">Telepon</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {studentsWithProgress?.map((s: any) => (
              <tr key={s.id} className="hover:bg-indigo-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-700">{s.full_name}</td>
                <td className="px-6 py-4 text-slate-700">Level {s.current_level}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.gradeName}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.programName}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{s.sessionCount}/4</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.isReady ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {s.isReady ? '✓ Siap Naik' : 'Proses'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.parent_name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.parent_phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {s.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/students/${s.id}/edit`} className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm transition">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!studentsWithProgress || studentsWithProgress.length === 0) && (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center text-slate-600">Belum ada siswa terdaftar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
