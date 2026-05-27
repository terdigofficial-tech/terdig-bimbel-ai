"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Upload, LayoutDashboard, Users, Calendar, LogOut, FileText, School, Tag, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          <h1 className="text-xl font-bold">Bimbel AI</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Fixed on mobile, static on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white flex flex-col shadow-2xl
        lg:static lg:inset-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-indigo-500/30 hidden lg:block">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="w-7 h-7" />
            Bimbel AI
          </h1>
          <p className="text-indigo-200 text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className={getMenuClass('/admin')} onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/materials" className={getMenuClass('/admin/materials')} onClick={() => setSidebarOpen(false)}>
            <BookOpen className="w-5 h-5" />
            Materi
          </Link>
          <Link href="/admin/materials/upload" className={getMenuClass('/admin/materials/upload')} onClick={() => setSidebarOpen(false)}>
            <Upload className="w-5 h-5" />
            Upload Baru
          </Link>
          <Link href="/admin/students" className={getMenuClass('/admin/students')} onClick={() => setSidebarOpen(false)}>
            <Users className="w-5 h-5" />
            Siswa
          </Link>
          <Link href="/admin/grades" className={getMenuClass('/admin/grades')} onClick={() => setSidebarOpen(false)}>
            <School className="w-5 h-5" />
            Kelas
          </Link>
          <Link href="/admin/programs" className={getMenuClass('/admin/programs')} onClick={() => setSidebarOpen(false)}>
            <Tag className="w-5 h-5" />
            Program
          </Link>
          <Link href="/admin/sessions" className={getMenuClass('/admin/sessions')} onClick={() => setSidebarOpen(false)}>
            <Calendar className="w-5 h-5" />
            Sesi
          </Link>
          <Link href="/admin/reports" className={getMenuClass('/admin/reports')} onClick={() => setSidebarOpen(false)}>
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

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 w-full p-4 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
