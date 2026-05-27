"use client";

import { useState } from 'react';
import { Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ReportCard({ report }: { report: any }) {
  const [sending, setSending] = useState(false);
  const [waStatus, setWaStatus] = useState(report.wa_status);

  const handleSendWA = async () => {
    setSending(true);
    const res = await fetch('/api/admin/reports/send-wa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId: report.id })
    });
    if (res.ok) {
      setWaStatus('sent');
      toast.success('WA terkirim (simulasi)');
    } else toast.error('Gagal mengirim');
    setSending(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">{report.students?.full_name}</h3>
            <p className="text-sm text-slate-600">Materi: {report.production_kits?.modules?.filename}</p>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(report.created_at).toLocaleDateString('id-ID')} • {report.report_type} •
              <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${waStatus === 'sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                WA: {waStatus}
              </span>
            </p>
          </div>
          <button
            onClick={handleSendWA}
            disabled={sending || waStatus === 'sent'}
            className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition"
          >
            <Send className="w-3 h-3" />
            {waStatus === 'sent' ? 'Terkirim' : sending ? '...' : 'Kirim WA'}
          </button>
        </div>
        <div className="mt-3 bg-slate-50 p-4 rounded-lg text-sm text-slate-700 whitespace-pre-line">
          {report.content_json?.text || '-'}
        </div>
      </div>
    </>
  );
}
