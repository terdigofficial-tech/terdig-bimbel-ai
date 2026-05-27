"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';

function LoginContent() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'bimbelai2025') {
      document.cookie = 'admin_auth=true; path=/; max-age=86400';
      router.push(redirect);
    } else {
      setError('Password salah');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div className="text-center mb-6">
        <Lock className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-slate-800">Bimbel AI Admin</h1>
        <p className="text-slate-500 text-sm mt-1">Masukkan password untuk masuk</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder:text-slate-400"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-medium transition">
          Masuk
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
