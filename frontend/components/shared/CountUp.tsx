"use client";

import { useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export function CountUp({
  from = 0,
  to,
  duration = 1,
  className = "",
  suffix = "",
  prefix = "",
}: CountUpProps) {
  const [display, setDisplay] = useState(from.toLocaleString());
  const motionValue = useMotionValue(from);

  useEffect(() => {
    const controls = animate(motionValue, to, {
      duration,
      ease: "easeOut",
    });

    const unsubscribe = motionValue.on("change", (latest) => {
      setDisplay(Math.floor(latest).toLocaleString());
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [to, motionValue, duration]);

  return (
    <span className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
