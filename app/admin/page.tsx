import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { FileText, CheckCircle, Users, TrendingUp, BookOpen } from 'lucide-react';
import WeightConfig from '@/components/WeightConfig';

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = createServerClient();

  const { count: totalKits } = await supabase.from('production_kits').select('*', { count: 'exact', head: true });
  const { count: readyKits } = await supabase.from('production_kits').select('*', { count: 'exact', head: true }).eq('status', 'ready');
  const { count: totalStudents } = await supabase.from('students').select('*', { count: 'exact', head: true }).eq('status', 'active');

  // Rata-rata kehadiran 30 hari terakhir
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { data: recentAttendance } = await supabase.from('attendance').select('status').gte('date', thirtyDaysAgo.toISOString().split('T')[0]);
  const attendanceRate = recentAttendance?.length
    ? Math.round((recentAttendance.filter(a => a.status === 'present' || a.status === 'late').length / recentAttendance.length) * 100)
    : 0;

  // Siswa yang naik level bulan ini
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const { count: promotions } = await supabase.from('progression_history').select('*', { count: 'exact', head: true }).gte('achieved_at', thisMonth.toISOString().split('T')[0]);

  const stats = [
    { label: 'Total Modul', value: totalKits ?? 0, icon: FileText, color: 'bg-blue-500' },
    { label: 'Siap Produksi', value: readyKits ?? 0, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Siswa Aktif', value: totalStudents ?? 0, icon: Users, color: 'bg-indigo-500' },
    { label: 'Kehadiran (30hr)', value: `${attendanceRate}%`, icon: BookOpen, color: 'bg-amber-500' },
    { label: 'Naik Level (Bln Ini)', value: promotions ?? 0, icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Weight Configuration Section */}
      <div className="mt-8">
        <WeightConfig />
      </div>

      <div className="mt-8">
        <Link href="/admin/reports" className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium inline-flex items-center gap-2">
          📋 Kelola Laporan
        </Link>
      </div>
    </div>
  );
}
