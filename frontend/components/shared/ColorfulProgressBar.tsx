"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ColorfulProgressBarProps {
  percentage: number;
  height?: "sm" | "md" | "lg";
  className?: string;
  showGlow?: boolean;
}

export function ColorfulProgressBar({
  percentage,
  height = "md",
  className,
  showGlow = true,
}: ColorfulProgressBarProps) {
  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={cn("w-full overflow-hidden rounded-full", className)}>
      <div
        className={cn(
          "progress-bar",
          heightClasses[height],
          "bg-background-tertiary relative"
        )}
      >
        <motion.div
          className={cn(
            "progress-fill gradient-multi-color",
            showGlow && "shadow-lg shadow-green/30"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${clampedPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
