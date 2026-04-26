// Clerk inbound webhooks. Today we only act on `user.created` to materialize
// a local Therapist row. All events are deduplicated via WebhookEvent so
// Clerk's at-least-once retry semantics don't cause double-creates.
//
// Signature verification uses Svix (Clerk's standard transport).

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

import { prisma, Locale } from '@habla/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ClerkUserCreatedPayload {
  type: 'user.created';
  data: {
    id: string;
    email_addresses: Array<{ id: string; email_address: string }>;
    primary_email_address_id: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}

type ClerkEvent = ClerkUserCreatedPayload | { type: string; data: Record<string, unknown> };

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CLERK_WEBHOOK_SECRET not configured' }, { status: 500 });
  }

  const hdrs = await headers();
  const svixId = hdrs.get('svix-id');
  const svixTimestamp = hdrs.get('svix-timestamp');
  const svixSignature = hdrs.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
  }

  const body = await request.text();

  let event: ClerkEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkEvent;
  } catch (err) {
    console.error('[clerk-webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Dedupe.
  try {
    await prisma.webhookEvent.create({
      data: { provider: 'clerk', eventId: svixId, type: event.type },
    });
  } catch {
    // Already processed.
    return NextResponse.json({ ok: true, deduped: true });
  }

  if (event.type === 'user.created') {
    const data = event.data as ClerkUserCreatedPayload['data'];
    const primaryEmail =
      data.email_addresses.find((e) => e.id === data.primary_email_address_id)?.email_address ??
      data.email_addresses[0]?.email_address;

    if (!primaryEmail) {
      console.warn('[clerk-webhook] user.created with no email, skipping:', data.id);
      return NextResponse.json({ ok: true, skipped: 'no-email' });
    }

    const fullName =
      [data.first_name, data.last_name].filter(Boolean).join(' ').trim() || primaryEmail;

    await prisma.therapist.upsert({
      where: { clerkUserId: data.id },
      create: {
        clerkUserId: data.id,
        email: primaryEmail,
        fullName,
        locale: Locale.en,
      },
      update: { email: primaryEmail, fullName },
    });
  }

  return NextResponse.json({ ok: true });
}
