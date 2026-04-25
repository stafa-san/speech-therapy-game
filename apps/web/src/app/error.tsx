'use client';

import { useEffect } from 'react';

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
        <p className="text-accent-coral text-sm font-semibold">Error</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Algo salió mal</h1>
        <p className="mt-4 text-neutral-600">
          Tuvimos un problema cargando esta página. Inténtalo de nuevo.
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-xs text-neutral-400">ref: {error.digest}</p>
        ) : null}
        <button
          onClick={reset}
          className="rounded-button mt-8 inline-flex bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
