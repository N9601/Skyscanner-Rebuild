export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className="text-ink dark:text-ink-inverse"
    >
      {/* hand-drawn paper plane */}
      <path
        d="M42.4 7.6c-9.6 4.6-22.6 10.6-32.4 17.8 4 1.6 9.2 2.3 13.8 3.1 1.5 4.4 2.8 9.2 4.6 13.3C32.9 30.9 38 19 42.4 7.6Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42.4 7.6C36.1 14.7 29.7 21.7 23.8 28.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* loopy dotted trail */}
      <path
        d="M5.4 41.2c3.2-2.6 2.2-6.6 5.8-6 3.4.6 2 5.6 5.8 4.4 2.4-.8 3.2-2.8 4.4-4.8"
        stroke="#0770E3"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="0.1 5.2"
      />
    </svg>
  );
}
