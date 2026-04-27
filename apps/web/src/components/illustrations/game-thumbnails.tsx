// Inline SVG thumbnails for the three v1 games. Used on the landing
// page games preview row so the user can jump into any game directly.

interface ThumbProps {
  className?: string;
}

export function FeedTheSharkThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id="fts-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill="url(#fts-water)" />
      {/* Bubbles */}
      <circle cx="40" cy="40" r="6" fill="white" opacity="0.6" />
      <circle cx="180" cy="30" r="4" fill="white" opacity="0.6" />
      <circle cx="200" cy="60" r="3" fill="white" opacity="0.5" />
      {/* Shark body */}
      <ellipse cx="100" cy="100" rx="60" ry="22" fill="#475569" />
      <ellipse cx="100" cy="92" rx="56" ry="14" fill="#94a3b8" />
      {/* Tail */}
      <polygon points="40,100 12,80 12,120" fill="#475569" />
      {/* Fin */}
      <polygon points="100,68 120,100 80,100" fill="#475569" />
      {/* Mouth */}
      <path
        d="M 130 110 Q 150 116 158 100"
        stroke="#0f172a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <polygon points="138,110 144,104 148,110" fill="white" />
      <polygon points="148,110 154,104 158,110" fill="white" />
      {/* Eye */}
      <circle cx="138" cy="92" r="4" fill="white" />
      <circle cx="139" cy="92" r="2" fill="#0f172a" />
      {/* Fish */}
      <g transform="translate(190 110)">
        <ellipse cx="0" cy="0" rx="14" ry="9" fill="#facc15" />
        <polygon points="-12,0 -22,-8 -22,8" fill="#facc15" />
        <circle cx="6" cy="-2" r="1.6" fill="#0f172a" />
      </g>
    </svg>
  );
}

export function BuildAMonsterThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id="bam-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
        <linearGradient id="bam-monster" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill="url(#bam-bg)" />
      {/* Monster body */}
      <path
        d="M 80 100 Q 80 60 120 60 Q 160 60 160 100 Q 160 140 120 140 Q 80 140 80 100 Z"
        fill="url(#bam-monster)"
      />
      {/* Belly */}
      <ellipse cx="120" cy="118" rx="28" ry="22" fill="#fef3c7" />
      {/* Eyes */}
      <circle cx="106" cy="92" r="9" fill="white" />
      <circle cx="134" cy="92" r="9" fill="white" />
      <circle cx="108" cy="92" r="4" fill="#0f172a" />
      <circle cx="136" cy="92" r="4" fill="#0f172a" />
      {/* Mouth */}
      <path
        d="M 108 122 Q 120 134 132 122"
        stroke="#0f172a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Horns */}
      <path
        d="M 92 60 Q 84 38 100 32 Q 104 50 104 60 Z"
        fill="#facc15"
        stroke="#c2410c"
        strokeWidth="1.5"
      />
      <path
        d="M 148 60 Q 156 38 140 32 Q 136 50 136 60 Z"
        fill="#facc15"
        stroke="#c2410c"
        strokeWidth="1.5"
      />
      {/* Arm */}
      <path d="M 80 104 Q 60 110 56 124 Q 56 130 62 128 Q 62 120 76 116 Z" fill="#7c3aed" />
      <circle cx="58" cy="126" r="6" fill="#a78bfa" />
      {/* Sparkle */}
      <path
        d="M 200 40 L 204 50 L 214 54 L 204 58 L 200 68 L 196 58 L 186 54 L 196 50 Z"
        fill="#facc15"
      />
    </svg>
  );
}

export function SpinTheWheelThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id="stw-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill="url(#stw-bg)" />
      {/* Wheel */}
      <g transform="translate(120 80)">
        <circle r="60" fill="white" stroke="#0f172a" strokeWidth="3" />
        {/* 6 segments */}
        <path d="M 0 0 L 0 -60 A 60 60 0 0 1 51.96 -30 Z" fill="#fb7185" />
        <path d="M 0 0 L 51.96 -30 A 60 60 0 0 1 51.96 30 Z" fill="#facc15" />
        <path d="M 0 0 L 51.96 30 A 60 60 0 0 1 0 60 Z" fill="#10b69d" />
        <path d="M 0 0 L 0 60 A 60 60 0 0 1 -51.96 30 Z" fill="#0891b2" />
        <path d="M 0 0 L -51.96 30 A 60 60 0 0 1 -51.96 -30 Z" fill="#7c3aed" />
        <path d="M 0 0 L -51.96 -30 A 60 60 0 0 1 0 -60 Z" fill="#f97316" />
        <circle r="9" fill="#0f172a" />
        <circle r="5" fill="#facc15" />
      </g>
      {/* Pointer */}
      <polygon points="120,18 110,4 130,4" fill="#0f172a" />
      <polygon points="120,16 113,6 127,6" fill="#facc15" />
    </svg>
  );
}
