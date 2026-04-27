// Inline SVG feature icons for the landing-page features grid. Each is a
// simple, friendly illustration on a colored tile background.

interface FeatureIconProps {
  className?: string;
}

export function FeatureSpark({ className }: FeatureIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} role="img" aria-hidden="true">
      <rect width="80" height="80" rx="20" fill="#fef3c7" />
      <path
        d="M 40 18 L 46 34 L 62 40 L 46 46 L 40 62 L 34 46 L 18 40 L 34 34 Z"
        fill="#facc15"
        stroke="#c2410c"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="22" r="4" fill="#fb7185" />
      <circle cx="20" cy="60" r="3" fill="#10b69d" />
    </svg>
  );
}

export function FeatureFamily({ className }: FeatureIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} role="img" aria-hidden="true">
      <rect width="80" height="80" rx="20" fill="#dbeafe" />
      <circle cx="32" cy="34" r="10" fill="#10b69d" stroke="#0d8e7a" strokeWidth="2" />
      <circle cx="50" cy="34" r="8" fill="#fb7185" stroke="#c2410c" strokeWidth="2" />
      <path
        d="M 18 60 Q 30 50 32 56 Q 36 50 44 56 Q 48 50 56 56 Q 64 50 64 60 L 18 60 Z"
        fill="#facc15"
        stroke="#c2410c"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FeatureBook({ className }: FeatureIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} role="img" aria-hidden="true">
      <rect width="80" height="80" rx="20" fill="#fee2e2" />
      <path
        d="M 18 22 Q 40 16 62 22 L 62 60 Q 40 54 18 60 Z"
        fill="white"
        stroke="#0d8e7a"
        strokeWidth="2"
      />
      <path d="M 40 22 L 40 60" stroke="#0d8e7a" strokeWidth="2" />
      <path
        d="M 24 32 L 36 30 M 24 38 L 34 36 M 24 44 L 32 42"
        stroke="#10b69d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 44 30 L 56 32 M 44 36 L 54 38 M 44 42 L 52 44"
        stroke="#10b69d"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FeatureShield({ className }: FeatureIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} role="img" aria-hidden="true">
      <rect width="80" height="80" rx="20" fill="#e0e7ff" />
      <path
        d="M 40 14 L 60 22 L 60 42 Q 60 58 40 66 Q 20 58 20 42 L 20 22 Z"
        fill="#a78bfa"
        stroke="#7c3aed"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M 30 42 L 38 50 L 52 34"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function FeatureClock({ className }: FeatureIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} role="img" aria-hidden="true">
      <rect width="80" height="80" rx="20" fill="#dcfce7" />
      <circle cx="40" cy="40" r="22" fill="white" stroke="#0d8e7a" strokeWidth="3" />
      <path
        d="M 40 26 L 40 40 L 50 46"
        stroke="#0d8e7a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="40" cy="40" r="2.4" fill="#0d8e7a" />
    </svg>
  );
}

export function FeatureGlobe({ className }: FeatureIconProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} role="img" aria-hidden="true">
      <rect width="80" height="80" rx="20" fill="#cffafe" />
      <circle cx="40" cy="40" r="22" fill="#0891b2" />
      <path
        d="M 18 40 L 62 40 M 40 18 Q 30 40 40 62 Q 50 40 40 18"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 22 30 Q 40 36 58 30 M 22 50 Q 40 44 58 50"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
