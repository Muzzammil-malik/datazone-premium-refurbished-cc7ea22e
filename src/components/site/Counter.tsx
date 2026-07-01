import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: [0.2, 0.8, 0.2, 1], onUpdate: (v) => setN(v) });
    return () => c.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{Math.round(n).toLocaleString()}{suffix}</span>;
}