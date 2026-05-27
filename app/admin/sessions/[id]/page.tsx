"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function SessionManagePage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [reportLoading, setReportLoading] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [correcting, setCorrecting] = useState<Record<string, boolean>>({});
  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [manualText, setManualText] = useState<Record<string, string>>({});
  const [manualScore, setManualScore] = useState<Record<string, number>>({});
  const [savingManual, setSavingManual] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`/api/admin/sessions/${id}`).then(res => res.json()).then(res => {
      setData(res);
      const att: any = {};
      res.attendance?.forEach((a: any) => att[a.student_id] = a.status);
      setAttendance(att);
      const sc: any = {};
      const nt: any = {};
      res.assessments?.forEach((a: any) => {
        sc[a.student_id] = a.rubric_scores || {};
        nt[a.student_id] = a.tutor_notes || '';
      });
      setScores(sc);
      setNotes(nt);
    });
  }, [id]);

  const handleSubmit = async () => {
    try {
      const attendanceRecords = data.students.map((s: any) => ({
        student_id: s.id,
        session_id: id,
        date: new Date().toISOString().split('T')[0],
        status: attendance[s.id] || 'present'
      }));
      const assessmentRecords = data.students.map((s: any) => {
        const rubric = scores[s.id] || {};
        const vals = Object.values(rubric);
        const total = vals.length ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length) : 0;
        return {
          student_id: s.id,
          session_id: id,
          rubric_scores: rubric,
          total_score: Math.round(total),
          tutor_notes: notes[s.id] || ''
        };
      });

      const attendanceRes = await fetch('/api/admin/attendance', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ records: attendanceRecords }) });
      if (!attendanceRes.ok) {
        const err = await attendanceRes.json();
        throw new Error(`Attendance API error: ${err.error}`);
      }

      const assessmentRes = await fetch('/api/admin/assessments', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ records: assessmentRecords }) });
      if (!assessmentRes.ok) {
        const err = await assessmentRes.json();
        throw new Error(`Assessment API error: ${err.error}`);
      }

      toast.success('Data sesi tersimpan');
    } catch (err: any) {
      console.error('handleSubmit error:', err);
      toast.error(err.message || 'Gagal menyimpan data');
    }
  };

  const handleReportAndProgression = async () => {
    setReportLoading(true);
    let promoted = 0;
    let reportCount = 0;
    
    for (const student of data.students) {
      try {
        // Generate laporan
        const reportRes = await fetch('/api/admin/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: student.id, sessionId: id })
        });
        
        if (reportRes.ok) {
          reportCount++;
        }

        // Cek progression
        const progRes = await fetch('/api/admin/progression', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: student.id })
        });
        
        const prog = await progRes.json();
        if (prog.promoted) {
          promoted++;
          toast.success(`${student.full_name} naik ke Level ${prog.newLevel}!`);
        }
      } catch (err) {
        console.error(`Error processing ${student.full_name}:`, err);
      }
    }
    
    setReportLoading(false);
    toast.success(`Laporan dibuat untuk ${reportCount} siswa. ${promoted} siswa naik level!`);
  };

  // Fungsi upload foto
  const handleUploadWorksheet = async (studentId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Untuk HP, langsung buka kamera
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading({ ...uploading, [studentId]: true });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('student_id', studentId);
      formData.append('session_id', id);
      try {
        const res = await fetch('/api/admin/worksheets/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) {
          setSubmissions({ ...submissions, [studentId]: data.submission });
          toast.success('Lembar kerja terupload');
        } else toast.error(data.error || 'Gagal upload');
      } catch (err: any) {
        toast.error(err.message || 'Network error');
      }
      setUploading({ ...uploading, [studentId]: false });
    };
    input.click();
  };

  // Fungsi koreksi AI
  const handleCorrectWorksheet = async (studentId: string, submissionId: string) => {
    setCorrecting({ ...correcting, [studentId]: true });
    try {
      const res = await fetch('/api/admin/worksheets/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmissions({ ...submissions, [studentId]: { ...submissions[studentId], ai_correction: data.correction, score: data.correction.total_score } });
        toast.success('Koreksi selesai');
      } else toast.error(data.error || 'Gagal koreksi');
    } catch (err: any) {
      toast.error(err.message || 'Network error');
    }
    setCorrecting({ ...correcting, [studentId]: false });
  };

  // Fungsi simpan koreksi manual
  const handleSaveManual = async (studentId: string) => {
    setSavingManual({ ...savingManual, [studentId]: true });
    try {
      const res = await fetch('/api/admin/worksheets/save-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          session_id: id,
          manual_text: manualText[studentId] || '',
          total_score: manualScore[studentId] || 0,
          max_score: 100
        })
      });
      if (res.ok) {
        toast.success('Koreksi manual tersimpan');
        // Update submissions state to show saved score
        setSubmissions({ 
          ...submissions, 
          [studentId]: { 
            ...submissions[studentId],
            score: manualScore[studentId] || 0,
            ai_correction: {
              ...submissions[studentId]?.ai_correction,
              manual_text: manualText[studentId],
              total_score: manualScore[studentId],
              max_score: 100
            }
          }
        });
      } else {
        const data = await res.json();
        toast.error(data.error || 'Gagal menyimpan');
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error');
    }
    setSavingManual({ ...savingManual, [studentId]: false });
  };

  if (!data) return <div className="p-8 text-center">Loading...</div>;

  const rubricFields = ['analisis', 'komparasi', 'evaluasi'];
  
  // Hitung sesi ke berapa (dari 4 sesi terakhir)
  const sessionNumber = data.attendance ? Math.min(4, data.attendance.length) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{data.session?.modules?.filename}</h2>
        <div className="flex items-center gap-4">
          <p className="text-slate-600">Kelola kehadiran dan penilaian</p>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">Sesi ke-{sessionNumber} dari 4</span>
        </div>
      </div>
      <div className="space-y-4">
        {data.students.map((student: any) => (
          <div key={student.id} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{student.full_name}</p>
                <p className="text-xs text-slate-600">Level {student.current_level}</p>
              </div>
              <select className="border rounded-lg px-3 py-1.5 text-sm text-slate-800" value={attendance[student.id] || 'present'} onChange={e => setAttendance({...attendance, [student.id]: e.target.value})}>
                <option value="present">Hadir</option>
                <option value="absent">Tidak Hadir</option>
                <option value="late">Terlambat</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {rubricFields.map(field => (
                <div key={field}>
                  <label className="text-xs text-slate-800 font-medium capitalize">{field}</label>
                  <input type="number" min="0" max="100" className="w-full border rounded-lg px-2 py-1 text-sm text-slate-800 placeholder:text-slate-400" value={scores[student.id]?.[field] || ''} onChange={e => setScores({...scores, [student.id]: {...scores[student.id], [field]: parseInt(e.target.value) || 0}})} />
                </div>
              ))}
            </div>
            <textarea className="w-full border rounded-lg p-2 mt-2 text-sm text-slate-800 placeholder:text-slate-400" placeholder="Catatan tutor..." value={notes[student.id] || ''} onChange={e => setNotes({...notes, [student.id]: e.target.value})} />
            
            {/* Worksheet Section */}
            <div className="border-t mt-3 pt-3">
              <p className="text-xs font-medium text-slate-700 mb-2">📄 Lembar Kerja</p>
              {submissions[student.id] ? (
                <div className="space-y-2">
                  <img src={submissions[student.id].image_url} alt="Lembar Kerja" className="w-full rounded-lg border max-h-48 object-cover" />
                  {submissions[student.id].ai_correction ? (
                    <div className="bg-green-50 p-3 rounded-lg text-xs">
                      <p className="font-semibold">Skor: {submissions[student.id].score} / {submissions[student.id].ai_correction.max_total}</p>
                      <p className="text-slate-600 mt-1">{submissions[student.id].ai_correction.summary}</p>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-indigo-600 font-medium">Lihat detail</summary>
                        <div className="mt-2 space-y-2">
                          {submissions[student.id].ai_correction.answers?.map((a: any, i: number) => (
                            <div key={i} className={`p-2 rounded text-xs ${a.is_correct ? 'bg-green-100' : 'bg-red-100'}`}>
                              <p><strong>No. {a.question_number}</strong> | Skor: {a.score}/{a.max_score}</p>
                              <p className="text-slate-700">Jawaban: {a.student_answer}</p>
                              <p className="text-slate-700">Kunci: {a.correct_answer}</p>
                              <p className="italic text-slate-600">{a.comment}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCorrectWorksheet(student.id, submissions[student.id].id)}
                      disabled={correcting[student.id]}
                      className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 disabled:opacity-50 w-full font-medium"
                    >
                      {correcting[student.id] ? '🔄 Mengoreksi...' : '🤖 Koreksi AI'}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleUploadWorksheet(student.id)}
                  disabled={uploading[student.id]}
                  className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-200 disabled:opacity-50 w-full font-medium"
                >
                  {uploading[student.id] ? '⏳ Upload...' : '📸 Foto Lembar Kerja'}
                </button>
              )}
            </div>

            {/* Manual Correction Section */}
            <div className="border-t mt-3 pt-3">
              <p className="text-xs font-medium text-slate-700 mb-2">📝 Koreksi Manual</p>
              <textarea
                className="w-full border rounded-lg p-3 text-sm text-slate-800 placeholder:text-slate-400"
                rows={6}
                placeholder="Tempelkan hasil koreksi/analisis lembar kerja di sini..."
                value={manualText[student.id] || ''}
                onChange={e => setManualText({ ...manualText, [student.id]: e.target.value })}
              />
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-20 border rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400"
                  placeholder="Skor"
                  value={manualScore[student.id] || ''}
                  onChange={e => setManualScore({ ...manualScore, [student.id]: parseInt(e.target.value) || 0 })}
                />
                <span className="text-xs text-slate-500">/ 100</span>
                <button
                  onClick={() => handleSaveManual(student.id)}
                  disabled={savingManual[student.id]}
                  className="text-xs bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 disabled:opacity-50 ml-auto font-medium"
                >
                  {savingManual[student.id] ? '⏳ Menyimpan...' : '💾 Simpan Koreksi'}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 font-medium">Simpan Semua</button>
      <button onClick={handleReportAndProgression} disabled={reportLoading} className="mt-4 ml-4 bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center gap-2">
        {reportLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Memproses...
          </>
        ) : (
          'Generate Laporan & Cek Level'
        )}
      </button>
    </div>
  );
}
