"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PulseBadgeProps {
  children: ReactNode;
  color?: string;
  pulse?: boolean;
  className?: string;
}

export function PulseBadge({
  children,
  color = "#3B82F6",
  pulse = true,
  className = "",
}: PulseBadgeProps) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      animate={pulse ? {
        boxShadow: [
          `0 0 0 0 ${color}40`,
          `0 0 0 8px ${color}00`,
        ],
      } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <div
        className="rounded-full px-3 py-1.5 text-sm font-semibold text-white shadow-lg"
        style={{ backgroundColor: color }}
      >
        {children}
      </div>
    </motion.div>
  );
}
