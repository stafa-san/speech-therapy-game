// Daily Vercel Cron — deletes AssignmentSession rows older than 90 days
// (Project.md §8.2 retention rule). Schedule lives in apps/web/vercel.json.
//
// Auth: Vercel Cron sends an `Authorization: Bearer <CRON_SECRET>` header
// that we verify before doing any work, so a leaked URL doesn't let an
// attacker drain the table.

import { NextResponse } from 'next/server';

import { prisma } from '@habla/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RETENTION_DAYS = 90;

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ skipped: 'no-database' });
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);

  const result = await prisma.assignmentSession.deleteMany({
    where: { startedAt: { lt: cutoff } },
  });

  return NextResponse.json({ ok: true, deleted: result.count, cutoff: cutoff.toISOString() });
}
