"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Grade, Program } from '@/types';

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [form, setForm] = useState({
    full_name: '',
    parent_name: '',
    parent_phone: '',
    current_level: 1,
    grade_id: '',
    program_id: '',
    status: 'active'
  });

  const [grades, setGrades] = useState<Grade[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch student data dan grades/programs saat mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, gradesRes, programsRes] = await Promise.all([
          fetch(`/api/admin/students/${id}`),
          fetch('/api/admin/grades'),
          fetch('/api/admin/programs')
        ]);

        if (studentRes.ok) {
          const studentData = await studentRes.json();
          setForm({
            full_name: studentData.full_name || '',
            parent_name: studentData.parent_name || '',
            parent_phone: studentData.parent_phone || '',
            current_level: studentData.current_level || 1,
            grade_id: studentData.grade_id || '',
            program_id: studentData.program_id || '',
            status: studentData.status || 'active'
          });
        } else {
          toast.error('Gagal memuat data siswa');
        }

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
        toast.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        toast.success('Siswa berhasil diperbarui');
        router.push('/admin/students');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Gagal menyimpan');
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Toaster position="top-right" />
      <Link href="/admin/students" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Edit Siswa</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
        <input
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-400"
          placeholder="Nama Lengkap"
          required
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />
        <input
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-400"
          placeholder="Nama Wali"
          value={form.parent_name}
          onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
        />
        <input
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-400"
          placeholder="Telepon Wali (628xx)"
          required
          value={form.parent_phone}
          onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
        />
        <input
          type="number"
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-400"
          value={form.current_level}
          onChange={(e) => setForm({ ...form, current_level: parseInt(e.target.value) })}
          placeholder="Level Awal"
        />

        {/* Dropdown Kelas */}
        <select
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800"
          value={form.grade_id}
          onChange={(e) => setForm({ ...form, grade_id: e.target.value })}
        >
          <option value="">-- Pilih Kelas (Opsional) --</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.name}
            </option>
          ))}
        </select>

        {/* Dropdown Program */}
        <select
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800"
          value={form.program_id}
          onChange={(e) => setForm({ ...form, program_id: e.target.value })}
        >
          <option value="">-- Pilih Program (Opsional) --</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          className="w-full border rounded-xl px-4 py-2.5 text-slate-800"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>

        <button
          disabled={saving}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </button>
      </form>
    </div>
  );
}
