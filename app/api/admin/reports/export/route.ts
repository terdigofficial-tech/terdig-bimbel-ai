import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { data: reports } = await supabase
    .from('parent_reports')
    .select('*, students(full_name), production_kits:session_id(modules(filename))')
    .order('created_at', { ascending: false })
    .limit(50);

  let markdown = '# Laporan Bimbel AI\n\n';
  markdown += `Dibuat: ${new Date().toLocaleDateString('id-ID')}\n\n---\n\n`;

  for (const r of reports || []) {
    markdown += `## Siswa: ${r.students?.full_name}\n`;
    markdown += `Materi: ${r.production_kits?.modules?.filename}\n`;
    markdown += `Status WA: ${r.wa_status}\n\n`;
    markdown += `${r.content_json?.text || '-'}\n\n---\n\n`;
  }

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="laporan-bimbel.md"'
    }
  });
}
