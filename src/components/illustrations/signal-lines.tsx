/** Problem-section background — prompt 6 */
export function ProblemBackground({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1920 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1920" height="800" fill="var(--ink-950)" />
      <path
        d="M 0 400 L 1400 400 L 1550 380 L 1700 320 L 1850 280 L 1920 260"
        stroke="var(--ember-500)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M 0 402 L 1400 402"
        stroke="var(--flatline-500)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

/** Route Intelligence spotlight — prompt 7 */
export function ConvergingSignals({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="600" height="600" fill="var(--ink-950)" rx="12" />
      {/* Multiple converging lines — amber, fading */}
      <path d="M 40 120 Q 200 100 480 300" stroke="var(--ember-700)" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M 40 200 Q 220 180 480 300" stroke="var(--ember-700)" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M 40 280 Q 240 260 480 300" stroke="var(--ember-700)" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M 40 360 Q 260 340 480 300" stroke="var(--ember-700)" strokeWidth="1" fill="none" opacity="0.35" />
      <path d="M 40 440 Q 280 400 480 300" stroke="var(--ember-700)" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M 40 500 Q 300 420 480 300" stroke="var(--ember-700)" strokeWidth="1" fill="none" opacity="0.25" />
      {/* Resolved steady line — pulse teal */}
      <path
        d="M 480 300 L 560 300"
        stroke="var(--pulse-500)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 560 300 L 560 280 L 560 320"
        stroke="var(--pulse-500)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
