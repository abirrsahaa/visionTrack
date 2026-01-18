"use client";

import { motion } from "framer-motion";
import { Flame, Clock } from "lucide-react";
import { formatDistanceToNow, addDays, startOfTomorrow } from "date-fns";

interface TodayFocusBannerProps {
  streak: number;
  focusMessage?: string;
}

export function TodayFocusBanner({ streak, focusMessage }: TodayFocusBannerProps) {
  const tomorrow = startOfTomorrow();
  const timeUntilMidnight = formatDistanceToNow(tomorrow);

  const defaultMessage = `Complete your journal entry before midnight to maintain your ${streak}-day streak.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Flame className="w-6 h-6" />
          </motion.div>
          <h2 className="text-xl font-bold">Today's Focus: Keep the Streak Alive!</h2>
        </div>

        <div className="flex items-center gap-2 text-orange-100">
          <Clock className="w-4 h-4" />
          <p className="text-sm">
            {focusMessage || defaultMessage} <span className="font-semibold">{timeUntilMidnight}</span> remaining.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
