export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="akv-bg" x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4A9BF5" />
          <stop offset="1" stopColor="#04478F" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#akv-bg)" />
      <circle cx="24" cy="24" r="14.5" stroke="white" strokeOpacity="0.28" strokeWidth="1.5" />
      <path
        d="M8.5 33.5c7.5 2.5 19 .5 26-8"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="0.5 5"
      />
      <path d="M11.5 26.8 38.5 11l-7.8 26-4.6-10.1-14.6-.1Z" fill="white" />
      <path d="m26.1 26.9 12.4-15.9-7.8 26-4.6-10.1Z" fill="#BFDBFE" />
      <path d="m26.1 26.9 12.4-15.9-15.9 12.5 3.5 3.4Z" fill="#93C5FD" />
    </svg>
  );
}
