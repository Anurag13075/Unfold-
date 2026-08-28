export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Undrop"
    >
      <path
        d="M4 20V8h3.2l4.8 7.2L16.8 8H20v12h-2.8v-7.4L13.2 20h-1.4L7.8 12.6V20H4z"
        fill="currentColor"
      />
      <path
        d="M24 20V8h6.4c2.2 0 3.8 1.6 3.8 3.6 0 1.4-.8 2.6-2 3.2 1.6.6 2.6 2 2.6 3.8 0 2.2-1.8 3.8-4.2 3.8H24zm2.8-7.8h3.2c1 0 1.6-.6 1.6-1.4s-.6-1.4-1.6-1.4h-3.2v2.8zm0 5.6h3.6c1.2 0 1.8-.6 1.8-1.4 0-.8-.6-1.4-1.8-1.4h-3.6v2.8z"
        fill="currentColor"
      />
      <path
        d="M38 20V8h2.8v10.2H48V20H38z"
        fill="currentColor"
      />
      <path
        d="M52 20V8h2.8v4.6l5.4-4.6H63l-5.8 5 6.2 7H60l-5.2-6.2V20H52z"
        fill="currentColor"
      />
      <path
        d="M68 20V8h2.8v12H68z"
        fill="currentColor"
      />
      <path
        d="M74 14c0-3.6 2.6-6.2 6.2-6.2 2 0 3.6.8 4.6 2.2l-2.2 1.8c-.6-.8-1.4-1.2-2.4-1.2-1.8 0-3 1.4-3 3.4s1.2 3.4 3 3.4c1 0 1.8-.4 2.4-1.2l2.2 1.8c-1 1.4-2.6 2.2-4.6 2.2-3.6 0-6.2-2.6-6.2-6.2z"
        fill="currentColor"
      />
      <path
        d="M3 24c2-3 5-4 8-2.5 1.5.8 2.5 2.5 3 4.5"
        stroke="#F2A73B"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logomark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M4 22 L8 22 L10 18 L14 10 L18 14 L22 6 L26 12 L28 22"
        stroke="#F2A73B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M26 6 L28 4 L28 8 Z" fill="#F2A73B" />
    </svg>
  );
}
