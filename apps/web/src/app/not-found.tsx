import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16 text-center">
      <div>
        <p className="text-brand-600 text-sm font-semibold">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Página no encontrada</h1>
        <p className="mt-4 text-neutral-600">La página que buscas no existe o fue movida.</p>
        <Link
          href="/"
          className="rounded-button mt-8 inline-flex bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
