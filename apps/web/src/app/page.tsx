import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="max-w-2xl text-center">
        <Badge variant="secondary" className="mb-4">
          <span className="bg-primary mr-1 size-1.5 rounded-full" />
          Pre-launch · MVP en construcción
        </Badge>
        <h1 className="text-foreground text-balance text-5xl font-bold tracking-tight sm:text-6xl">
          Habla Juega
        </h1>
        <p className="text-muted-foreground mt-6 text-lg sm:text-xl">
          Práctica de articulación en español, lista en segundos. Listas de palabras avaladas por
          terapeutas del habla, con juegos animados que las familias pueden jugar en casa.
        </p>
        <p className="text-muted-foreground/70 mt-2 text-sm">
          Spanish-first speech therapy practice — Duolingo-grade games, SLP-vetted word lists.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" disabled>
            <span aria-disabled="true" className="cursor-not-allowed opacity-70">
              Inicia sesión <ArrowRight />
            </span>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="https://github.com/stafa-san/speech-therapy-game">
              <Github /> Repositorio
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
