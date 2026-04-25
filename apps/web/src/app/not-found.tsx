import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16 text-center">
      <div>
        <p className="text-primary text-sm font-semibold">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Página no encontrada</h1>
        <p className="text-muted-foreground mt-4">La página que buscas no existe o fue movida.</p>
        <Button asChild className="mt-8">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </main>
  );
}
