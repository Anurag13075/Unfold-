export function OscilloscopeHero({ className, quiet }: { className?: string; quiet?: boolean }) {
  return (
    <svg
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="800" height="450" fill="var(--ink-950)" />
      {/* Scan lines */}
      {Array.from({ length: 90 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          y1={i * 5}
          x2="800"
          y2={i * 5}
          stroke="var(--surface-800)"
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      {/* Grid */}
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="450" stroke="var(--surface-700)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="var(--surface-700)" strokeWidth="0.5" />
      ))}
      {/* Flatline then recovery - amber */}
      <path
        d="M 40 225 L 120 225 L 160 225 L 200 225 L 240 225 L 280 225 L 300 225 L 320 180 L 360 120 L 400 80 L 440 100 L 480 60 L 520 90 L 560 70 L 600 110 L 640 85 L 680 100 L 720 75 L 760 90"
        stroke="var(--ember-500)"
        strokeWidth={quiet ? 1.5 : 2}
        fill="none"
        strokeLinecap="round"
        opacity={quiet ? 0.7 : 1}
      />
      {/* Teal intersect */}
      <path
        d="M 40 280 L 200 280 L 280 275 L 320 200 L 400 140 L 480 160 L 560 130 L 640 150 L 720 120"
        stroke="#35D0A6"
        strokeWidth={quiet ? 1 : 1.5}
        fill="none"
        strokeLinecap="round"
        opacity={quiet ? 0.5 : 0.8}
      />
      {/* Phosphor glow at peak */}
      {!quiet && (
        <circle cx="480" cy="60" r="20" fill="url(#glow)" />
      )}
      <defs>
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#F2A73B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F2A73B" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function EmptyStateIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" fill="none" className={className} aria-hidden>
      <path
        d="M 10 50 L 50 50 L 70 50 L 85 35 L 100 50 L 120 30 L 140 45 L 160 25 L 180 40 L 190 35"
        stroke="#F2A73B"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 160 25 L 190 20"
        stroke="#35D0A6"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
