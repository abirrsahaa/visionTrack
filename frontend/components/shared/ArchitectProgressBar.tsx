"use client";

import { motion } from "framer-motion";

interface ArchitectProgressBarProps {
  percentage: number;
  color?: string;
  height?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ArchitectProgressBar({
  percentage,
  color = "#3B82F6",
  height = "md",
  showLabel = true,
  label,
  className = "",
}: ArchitectProgressBarProps) {
  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const displayPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-foreground-tertiary">
            {label || ""}
          </span>
          <span className="text-xs font-semibold text-foreground-secondary">
            {displayPercentage}%
          </span>
        </div>
      )}
      <div className={`arch-progress-bar ${heightClasses[height]}`}>
        <motion.div
          className="arch-progress-fill"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
