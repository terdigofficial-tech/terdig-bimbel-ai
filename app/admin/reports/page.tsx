import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { FileText, Download } from 'lucide-react';
import ReportCard from './ReportCard';

export const revalidate = 0;

export default async function ReportsPage() {
  const supabase = createServerClient();
  const { data: reports } = await supabase
    .from('parent_reports')
    .select('id, student_id, session_id, report_type, content_json, wa_status, created_at, students(full_name), production_kits:session_id(modules(filename))')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Laporan ke Orang Tua</h2>
        <div className="flex gap-3">
          <a href="/api/admin/reports/export/pdf" className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition flex items-center gap-2 text-sm font-medium">
            <Download className="w-4 h-4" /> Download Semua PDF
          </a>
          <a href="/api/admin/reports/export" className="bg-slate-600 text-white px-5 py-2.5 rounded-xl hover:bg-slate-700 transition flex items-center gap-2 text-sm font-medium">
            <FileText className="w-4 h-4" /> Download .md
          </a>
        </div>
      </div>

      <div className="space-y-4">
        {reports?.map((r: any) => (
          <ReportCard key={r.id} report={r} />
        ))}
        {(!reports || reports.length === 0) && (
          <div className="text-center py-12 text-slate-400">Belum ada laporan. Generate laporan dari halaman Sesi.</div>
        )}
      </div>
    </div>
  );
}
