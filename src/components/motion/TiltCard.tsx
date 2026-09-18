import { CSSProperties, PropsWithChildren, useRef, useState } from "react";

interface TiltCardProps {
  max?: number;
  className?: string;
}

export function TiltCard({ children, max = 7, className = "" }: PropsWithChildren<TiltCardProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({});
  const [sheen, setSheen] = useState<CSSProperties>({ opacity: 0 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setStyle({
      transform: `perspective(1100px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) scale3d(1.012, 1.012, 1)`,
      transition: "transform 0.08s ease-out",
    });
    setSheen({
      opacity: 1,
      background: `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.10), transparent 60%)`,
    });
  }

  function onLeave() {
    setStyle({
      transform: "perspective(1100px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
    });
    setSheen({ opacity: 0, transition: "opacity 0.5s ease" });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative will-change-transform ${className}`}
      style={style}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 rounded-2xl" style={sheen} />
    </div>
  );
}
