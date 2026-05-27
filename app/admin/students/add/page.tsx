"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Grade, Program } from '@/types';

export default function AddStudentPage() {
  const [form, setForm] = useState({ 
    full_name: '', 
    parent_name: '', 
    parent_phone: '', 
    current_level: 1,
    grade_id: '',
    program_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const router = useRouter();

  // Fetch grades dan programs saat mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesRes, programsRes] = await Promise.all([
          fetch('/api/admin/grades'),
          fetch('/api/admin/programs')
        ]);
        
        if (gradesRes.ok) {
          const gradesData = await gradesRes.json();
          setGrades(gradesData || []);
        }
        
        if (programsRes.ok) {
          const programsData = await programsRes.json();
          setPrograms(programsData || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      toast.success('Siswa berhasil ditambahkan');
      router.push('/admin/students');
    } else {
      const data = await res.json();
      toast.error(data.error || 'Gagal');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      <Toaster position="top-right" />
      <Link href="/admin/students" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 text-sm font-medium"><ArrowLeft className="w-4 h-4" /> Kembali</Link>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Tambah Siswa</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
        <input 
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-400" 
          placeholder="Nama Lengkap" 
          required 
          onChange={e => setForm({...form, full_name: e.target.value})} 
        />
        <input 
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-400" 
          placeholder="Nama Wali" 
          onChange={e => setForm({...form, parent_name: e.target.value})} 
        />
        <input 
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-400" 
          placeholder="Telepon Wali (628xx)" 
          required 
          onChange={e => setForm({...form, parent_phone: e.target.value})} 
        />
        <input 
          type="number" 
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-400" 
          value={form.current_level} 
          onChange={e => setForm({...form, current_level: parseInt(e.target.value)})} 
          placeholder="Level Awal" 
        />
        
        {/* Dropdown Kelas */}
        <select 
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800"
          value={form.grade_id}
          onChange={e => setForm({...form, grade_id: e.target.value})}
        >
          <option value="">-- Pilih Kelas (Opsional) --</option>
          {grades.map(grade => (
            <option key={grade.id} value={grade.id}>{grade.name}</option>
          ))}
        </select>

        {/* Dropdown Program */}
        <select 
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800"
          value={form.program_id}
          onChange={e => setForm({...form, program_id: e.target.value})}
        >
          <option value="">-- Pilih Program (Opsional) --</option>
          {programs.map(program => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </select>

        <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium">
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}
