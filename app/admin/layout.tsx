"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Upload, LayoutDashboard, Users, Calendar, LogOut, FileText, School, Tag } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Helper function untuk menentukan apakah menu aktif
  const isActive = (href: string) => {
    if (href === '/admin') {
      // Dashboard hanya aktif jika tepat /admin
      return pathname === '/admin';
    }
    // Menu lain aktif jika pathname dimulai dengan href
    return pathname.startsWith(href);
  };

  // Helper function untuk class menu
  const getMenuClass = (href: string) => {
    const baseClass = 'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200';
    const activeClass = 'bg-white/10 text-white font-medium';
    const inactiveClass = 'text-indigo-100 hover:bg-white/10 hover:text-white';
    
    return `${baseClass} ${isActive(href) ? activeClass : inactiveClass}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">
      <aside className="w-72 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-indigo-500/30">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="w-7 h-7" />
            Bimbel AI
          </h1>
          <p className="text-indigo-200 text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className={getMenuClass('/admin')}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/materials" className={getMenuClass('/admin/materials')}>
            <BookOpen className="w-5 h-5" />
            Materi
          </Link>
          <Link href="/admin/materials/upload" className={getMenuClass('/admin/materials/upload')}>
            <Upload className="w-5 h-5" />
            Upload Baru
          </Link>
          <Link href="/admin/students" className={getMenuClass('/admin/students')}>
            <Users className="w-5 h-5" />
            Siswa
          </Link>
          <Link href="/admin/grades" className={getMenuClass('/admin/grades')}>
            <School className="w-5 h-5" />
            Kelas
          </Link>
          <Link href="/admin/programs" className={getMenuClass('/admin/programs')}>
            <Tag className="w-5 h-5" />
            Program
          </Link>
          <Link href="/admin/sessions" className={getMenuClass('/admin/sessions')}>
            <Calendar className="w-5 h-5" />
            Sesi
          </Link>
          <Link href="/admin/reports" className={getMenuClass('/admin/reports')}>
            <FileText className="w-5 h-5" />
            Laporan
          </Link>
        </nav>
        <button
          onClick={async () => {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/login';
          }}
          className="mx-4 mb-4 flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-100 hover:bg-white/10 hover:text-white transition-all duration-200 w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
        <div className="p-4 border-t border-indigo-500/30 text-xs text-indigo-300">
          © 2025 Bimbel AI v1.0
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
