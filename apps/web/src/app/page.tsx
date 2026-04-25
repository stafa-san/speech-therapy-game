export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="max-w-2xl text-center">
        <p className="bg-brand-100 text-brand-800 mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
          <span className="bg-brand-500 size-2 rounded-full" />
          Pre-launch · MVP en construcción
        </p>
        <h1 className="text-balance text-5xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
          Habla Juega
        </h1>
        <p className="mt-6 text-lg text-neutral-600 sm:text-xl">
          Práctica de articulación en español, lista en segundos. Listas de palabras avaladas por
          terapeutas del habla, con juegos animados que las familias pueden jugar en casa.
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Spanish-first speech therapy practice — Duolingo-grade games, SLP-vetted word lists.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/stafa-san/speech-therapy-game"
            className="rounded-button inline-flex items-center gap-2 bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
          >
            Ver el repositorio
          </a>
        </div>
      </div>
    </main>
  );
}
