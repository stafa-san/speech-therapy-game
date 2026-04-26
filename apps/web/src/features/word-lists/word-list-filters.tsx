'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PhonemeOption {
  id: number;
  symbol: string;
  displayNameEs: string;
  displayNameEn: string;
}

const POSITIONS = ['initial', 'medial', 'final'] as const;
const DIFFICULTIES = [1, 2, 3] as const;

export interface FilterState {
  phonemeId: number | null;
  position: (typeof POSITIONS)[number] | null;
  difficulty: (typeof DIFFICULTIES)[number] | null;
}

export function WordListFilters({
  phonemes,
  state,
  onChange,
}: {
  phonemes: PhonemeOption[];
  state: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const t = useTranslations('wordList');

  return (
    <div className="flex flex-col gap-4">
      <Section title={t('filters.phoneme')}>
        <Chip
          active={state.phonemeId === null}
          label={t('filters.all')}
          onClick={() => onChange({ ...state, phonemeId: null })}
        />
        {phonemes.map((p) => (
          <Chip
            key={p.id}
            active={state.phonemeId === p.id}
            label={p.symbol}
            onClick={() => onChange({ ...state, phonemeId: p.id })}
          />
        ))}
      </Section>
      <Section title={t('filters.position')}>
        <Chip
          active={state.position === null}
          label={t('filters.all')}
          onClick={() => onChange({ ...state, position: null })}
        />
        {POSITIONS.map((pos) => (
          <Chip
            key={pos}
            active={state.position === pos}
            label={t(`position.${pos}`)}
            onClick={() => onChange({ ...state, position: pos })}
          />
        ))}
      </Section>
      <Section title={t('filters.difficulty')}>
        <Chip
          active={state.difficulty === null}
          label={t('filters.all')}
          onClick={() => onChange({ ...state, difficulty: null })}
        />
        {DIFFICULTIES.map((d) => (
          <Chip
            key={d}
            active={state.difficulty === d}
            label={`T${d}`}
            onClick={() => onChange({ ...state, difficulty: d })}
          />
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wide">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className="h-7 px-3 text-xs"
    >
      {active ? <Badge variant="secondary" className="size-1.5 rounded-full p-0" /> : null}
      {label}
    </Button>
  );
}
