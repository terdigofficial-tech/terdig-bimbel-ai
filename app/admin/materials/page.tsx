import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { FileText, Edit3 } from 'lucide-react';

export const revalidate = 0;

export default async function MaterialsPage() {
  const supabase = createServerClient();
  const { data: kits } = await supabase
    .from('production_kits')
    .select('id, status, created_at, modules(filename)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Daftar Materi</h2>
        <Link href="/admin/materials/upload" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium">
          + Upload Modul
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">File</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Tanggal</th>
              <th className="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kits?.map((kit: any) => (
              <tr key={kit.id} className="hover:bg-indigo-50/50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium text-slate-700">{kit.modules?.filename}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    kit.status === 'ready'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {kit.status === 'ready' ? '✅ Ready' : '📝 Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {new Date(kit.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/materials/${kit.id}`} className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!kits || kits.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-700 font-medium">Belum ada materi</p>
                  <p className="text-slate-600 text-sm mt-1">Upload modul pertama Anda</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
