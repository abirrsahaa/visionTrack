"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { AnimatedProgressBar } from "@/components/shared/AnimatedProgressBar";
import { CountUp } from "@/components/shared/CountUp";

interface LevelCardProps {
  level: number;
  totalXP: number;
  xpToNext: number;
  currentXPInLevel: number;
  xpRequiredForNext: number;
}

export function LevelCard({
  level,
  totalXP,
  xpToNext,
  currentXPInLevel,
  xpRequiredForNext,
}: LevelCardProps) {
  const progressPercentage = xpRequiredForNext > 0
    ? (currentXPInLevel / xpRequiredForNext) * 100
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-900">Level {level}</h3>
          </div>
          <p className="text-xs text-gray-600">
            <CountUp from={0} to={totalXP} /> Total XP
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatedProgressBar
          percentage={progressPercentage}
          color="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600"
          showShimmer={true}
          height="sm"
        />
        <p className="text-xs text-gray-600">
          <CountUp from={0} to={xpToNext} /> XP to Level {level + 1}
        </p>
      </div>
    </motion.div>
  );
}
