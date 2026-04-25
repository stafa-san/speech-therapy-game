'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16 text-center">
      <div>
        <p className="text-destructive text-sm font-semibold">Error</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Algo salió mal</h1>
        <p className="text-muted-foreground mt-4">
          Tuvimos un problema cargando esta página. Inténtalo de nuevo.
        </p>
        {error.digest ? (
          <p className="text-muted-foreground/70 mt-2 font-mono text-xs">ref: {error.digest}</p>
        ) : null}
        <Button onClick={reset} className="mt-8">
          Reintentar
        </Button>
      </div>
    </main>
  );
}
