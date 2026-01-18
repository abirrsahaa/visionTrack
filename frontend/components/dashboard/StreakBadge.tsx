"use client";

import { motion } from "framer-motion";
import { Flame, Calendar, Trophy } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
  totalJournals?: number;
  className?: string;
}

export function StreakBadge({ streak, totalJournals, className = "" }: StreakBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-4 py-2.5 rounded-xl shadow-lg border border-white/20 ${className}`}
    >
      {/* Fire Icon with Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <Flame className="w-6 h-6" />
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-orange-400 rounded-full blur-md opacity-50"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </motion.div>

      <div className="flex flex-col">
        <span className="text-xs font-medium opacity-90">Journal Streak</span>
        <span className="text-xl font-bold">
          {streak} {streak === 1 ? "day" : "days"}
        </span>
      </div>

      {totalJournals !== undefined && (
        <>
          <div className="h-8 w-px bg-white/30" />
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 opacity-80" />
            <span className="text-sm font-semibold">{totalJournals} total</span>
          </div>
        </>
      )}

      {/* Milestone Badge */}
      {streak >= 7 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="ml-auto"
        >
          <Trophy className="w-5 h-5 text-yellow-300" />
        </motion.div>
      )}
    </motion.div>
  );
}
