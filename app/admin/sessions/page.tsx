import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { FileText, Settings } from 'lucide-react';

export const revalidate = 0;

export default async function SessionsPage() {
  try {
    const supabase = createServerClient();
    const { data: kits, error } = await supabase
      .from('production_kits')
      .select('id, status, created_at, grade_id, modules(filename)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching sessions:', error);
      throw error;
    }

    console.log('✓ Sessions fetched:', kits?.length || 0);

    // Fetch grade names untuk setiap kit
    const kitsWithGrades = await Promise.all(
      (kits || []).map(async (kit: any) => {
        let gradeName = '-';
        if (kit.grade_id) {
          const { data: grade } = await supabase
            .from('grades')
            .select('name')
            .eq('id', kit.grade_id)
            .single();
          if (grade) gradeName = grade.name;
        }
        return { ...kit, gradeName };
      })
    );

    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Daftar Sesi</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Materi</th>
                <th className="px-6 py-4 font-semibold">Kelas Target</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kitsWithGrades?.map((kit: any) => (
                <tr key={kit.id} className="hover:bg-indigo-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium text-slate-700">{kit.modules?.filename || 'Tanpa Nama'}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{kit.gradeName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${kit.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {kit.status === 'ready' ? 'Ready' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {new Date(kit.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/sessions/${kit.id}`} className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition">
                      <Settings className="w-4 h-4" />
                      Kelola Sesi
                    </Link>
                  </td>
                </tr>
              ))}
              {(!kitsWithGrades || kitsWithGrades.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-600">Belum ada sesi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (err: any) {
    console.error('❌ Error in SessionsPage:', err.message);
    return (
      <div className="p-8 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-lg font-bold text-red-700 mb-2">Error Memuat Sesi</h2>
        <p className="text-red-600 text-sm">{err.message}</p>
        <p className="text-red-500 text-xs mt-2">Hubungi admin jika masalah berlanjut</p>
      </div>
    );
  }
}
