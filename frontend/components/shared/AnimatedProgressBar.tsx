"use client";

import { motion } from "framer-motion";

interface AnimatedProgressBarProps {
  percentage: number;
  color?: string;
  showShimmer?: boolean;
  showPulse?: boolean;
  height?: "sm" | "md" | "lg";
  milestones?: number[]; // Array of percentages for milestone markers
}

export function AnimatedProgressBar({
  percentage,
  color = "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
  showShimmer = true,
  showPulse = false,
  height = "md",
  milestones = [],
}: AnimatedProgressBarProps) {
  const heightClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  // Handle custom color or gradient
  const colorClass = color.includes("gradient") || color.includes("[") 
    ? color 
    : "";

  return (
    <div className={`relative w-full ${heightClasses[height]} bg-background-tertiary rounded-full overflow-hidden shadow-inner`}>
      {/* Main progress fill */}
      <motion.div
        className={colorClass ? `absolute inset-y-0 left-0 ${color} rounded-full` : "absolute inset-y-0 left-0 rounded-full"}
        style={!colorClass ? { backgroundColor: color } : {}}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percentage, 100)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Shimmer effect */}
        {showShimmer && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        )}
        
        {/* Pulse effect at end */}
        {showPulse && (
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </motion.div>
      
      {/* Milestone markers */}
      {milestones.length > 0 && milestones.map((milestone, index) => (
        <div
          key={index}
          className="absolute top-0 bottom-0 w-px bg-gray-400/50"
          style={{ left: `${Math.min(milestone, 100)}%` }}
        >
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full border-2 border-gray-400" />
        </div>
      ))}
    </div>
  );
}
