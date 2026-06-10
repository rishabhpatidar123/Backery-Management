import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function StatCounter({
  end,
  suffix = "",
  label,
}: {
  end: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-primary md:text-5xl">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
