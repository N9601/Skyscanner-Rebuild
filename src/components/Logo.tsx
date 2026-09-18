export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="akv-bg" x1="4" y1="2" x2="46" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#2563EB" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="akv-swoosh" x1="6" y1="38" x2="42" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#akv-bg)" />
      <path
        d="M6 36c9 6.5 25 5 36-8"
        stroke="url(#akv-swoosh)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M41.4 9.4 7.4 21.3l15.3 6.8Z" fill="#FFFFFF" />
      <path d="M41.4 9.4 22.7 28.1l6.8 15.3Z" fill="#BFDBFE" />
      <path d="M41.4 9.4 22.7 28.1l3.6 2.2Z" fill="#93C5FD" />
      <path
        d="m37 7.2.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9Z"
        fill="#fff"
        opacity="0.9"
        transform="translate(-27 3)"
      />
    </svg>
  );
}
