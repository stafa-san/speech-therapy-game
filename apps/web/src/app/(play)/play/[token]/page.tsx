// Family player surface — public, COPPA-strict.
//
// PR 9 (this one): renders the intro screen + skeleton "ready to play" UI
// for any token. Token validation hits the play tRPC router (which today
// stubs NOT_FOUND for unknown tokens; PR 10 wires DB lookups).
//
// PR 11+ mounts the actual <GameShell /> in place of the placeholder.

import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PlayPageProps {
  params: Promise<{ token: string }>;
}

// Token shape: randomBytes(16).toString('base64url') = 22 chars URL-safe.
const TOKEN_RE = /^[A-Za-z0-9_-]{20,64}$/;

export default async function PlayPage({ params }: PlayPageProps) {
  const { token } = await params;
  if (!TOKEN_RE.test(token)) notFound();

  // Once the DB is wired, validate the token here:
  //   const caller = await getPlayCaller();
  //   const assignment = await caller.play.byToken({ token }).catch(() => null);
  //   if (!assignment) notFound();
  // The caller MUST omit studentLabel from its select (Project.md §8).

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl">¡Hola!</CardTitle>
          <CardDescription>Listos para practicar.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Esta es la página del jugador. Pronto verás aquí el juego asignado por tu logopeda.
          </p>
          <Button size="lg" disabled>
            Empezar
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
