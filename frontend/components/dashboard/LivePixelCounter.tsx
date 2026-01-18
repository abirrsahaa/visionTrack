"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { TrendingUp, Sparkles } from "lucide-react";
import { CountUp } from "@/components/shared/CountUp";

interface LivePixelCounterProps {
  currentPixels: number;
  previousPixels?: number;
  showAnimation?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LivePixelCounter({
  currentPixels,
  previousPixels,
  showAnimation = false,
  size = "md",
  className = "",
}: LivePixelCounterProps) {
  const [justEarned, setJustEarned] = useState(false);
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.floor(current));

  useEffect(() => {
    spring.set(currentPixels);
    
    if (previousPixels !== undefined && currentPixels > previousPixels) {
      setJustEarned(true);
      setTimeout(() => setJustEarned(false), 2000);
    }
  }, [currentPixels, previousPixels, spring]);

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  };

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      animate={showAnimation && justEarned ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5 }}
    >
      {showAnimation && (
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Sparkles className={`${iconSizes[size]} text-blue-600`} />
        </motion.div>
      )}

      <div className="flex items-baseline gap-2">
        <motion.span
          className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${sizeClasses[size]}`}
          animate={showAnimation && justEarned ? { scale: [1, 1.2, 1] } : {}}
        >
          <CountUp from={previousPixels || 0} to={currentPixels} />
        </motion.span>

        {showAnimation && (
          <motion.span
            initial={{ opacity: 0, y: -10, scale: 0 }}
            animate={
              justEarned
                ? { opacity: [0, 1, 0], y: [-10, -30, -40], scale: [0, 1, 0] }
                : {}
            }
            className="text-sm font-bold text-green-600"
          >
            +{currentPixels - (previousPixels || 0)} pixels!
          </motion.span>
        )}
      </div>

      {/* Glow Effect */}
      {showAnimation && justEarned && (
        <motion.div
          className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-50 -z-10"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 1, repeat: 2 }}
        />
      )}
    </motion.div>
  );
}
