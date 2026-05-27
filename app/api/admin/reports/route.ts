import { NextRequest, NextResponse } from 'next/server';
import { generateParentReport } from '@/lib/reporter';

export async function POST(req: NextRequest) {
  try {
    const { studentId, sessionId } = await req.json();
    if (!studentId || !sessionId) return NextResponse.json({ error: 'studentId & sessionId required' }, { status: 400 });

    const report = await generateParentReport(studentId, sessionId);
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
