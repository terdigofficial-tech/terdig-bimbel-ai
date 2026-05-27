"use client";

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import type { Program } from '@/types';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [newForm, setNewForm] = useState({ name: '', description: '' });
  const [showNewForm, setShowNewForm] = useState(false);

  // Fetch programs saat mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await fetch('/api/admin/programs');
      if (res.ok) {
        const data = await res.json();
        setPrograms(data || []);
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
      toast.error('Gagal memuat data program');
    }
  };

  const handleAdd = async () => {
    if (!newForm.name.trim()) {
      toast.error('Nama program tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm)
      });

      if (res.ok) {
        toast.success('Program berhasil ditambahkan');
        setNewForm({ name: '', description: '' });
        setShowNewForm(false);
        fetchPrograms();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Gagal menambahkan program');
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error');
    }
    setLoading(false);
  };

  const handleEdit = async (id: string) => {
    if (!editForm.name.trim()) {
      toast.error('Nama program tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/programs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        toast.success('Program berhasil diperbarui');
        setEditingId(null);
        fetchPrograms();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Gagal memperbarui program');
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus program ini?')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/programs/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Program berhasil dihapus');
        fetchPrograms();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Gagal menghapus program');
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error');
    }
    setLoading(false);
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Manajemen Program</h2>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Tambah Program
        </button>
      </div>

      {/* Form Tambah Program */}
      {showNewForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">Tambah Program Baru</h3>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Nama Program"
              value={newForm.name}
              onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
              className="border rounded-lg px-4 py-2 text-slate-800"
            />
            <textarea
              placeholder="Deskripsi Program"
              value={newForm.description}
              onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
              className="border rounded-lg px-4 py-2 text-slate-800"
              rows={3}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium text-sm"
            >
              Simpan
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="bg-slate-300 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-400 font-medium text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Tabel Program */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Nama Program</th>
              <th className="px-6 py-4 font-semibold">Deskripsi</th>
              <th className="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {programs?.map((program) => (
              <tr key={program.id} className="hover:bg-indigo-50/50 transition-colors">
                {editingId === program.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="border rounded-lg px-3 py-2 text-slate-800 w-full"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="border rounded-lg px-3 py-2 text-slate-800 w-full"
                        rows={2}
                      />
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(program.id)}
                        disabled={loading}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" /> Simpan
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-slate-300 text-slate-800 px-3 py-1 rounded-lg hover:bg-slate-400 text-sm flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Batal
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 font-medium text-slate-700">{program.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{program.description || '-'}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(program.id);
                          setEditForm({ name: program.name, description: program.description || '' });
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(program.id)}
                        disabled={loading}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {(!programs || programs.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-16 text-center text-slate-600">
                  Belum ada program
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
