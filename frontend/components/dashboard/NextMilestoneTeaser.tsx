"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Sparkles } from "lucide-react";
import { AnimatedProgressBar } from "@/components/shared/AnimatedProgressBar";
import { CountUp } from "@/components/shared/CountUp";

interface NextMilestoneTeaserProps {
  currentPixels: number;
  totalPixels: number;
  milestones?: number[]; // Array of percentage milestones (e.g., [50, 75, 80, 85, 90, 100])
}

export function NextMilestoneTeaser({
  currentPixels,
  totalPixels,
  milestones = [50, 75, 80, 85, 90, 100],
}: NextMilestoneTeaserProps) {
  const currentPercentage = (currentPixels / totalPixels) * 100;
  
  // Find next milestone
  const nextMilestone = milestones.find((milestone) => milestone > currentPercentage);
  
  if (!nextMilestone) {
    return null; // Already at or past all milestones
  }

  const nextMilestonePixels = Math.floor((nextMilestone / 100) * totalPixels);
  const pixelsNeeded = nextMilestonePixels - currentPixels;
  
  // Find previous milestone for progress calculation
  const nextMilestoneIndex = milestones.indexOf(nextMilestone);
  const previousMilestone = nextMilestoneIndex > 0 ? milestones[nextMilestoneIndex - 1] : 0;
  const previousMilestonePixels = Math.floor((previousMilestone / 100) * totalPixels);
  
  const progressToNext = previousMilestonePixels < nextMilestonePixels
    ? ((currentPixels - previousMilestonePixels) / (nextMilestonePixels - previousMilestonePixels)) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Target className="w-5 h-5 text-purple-600" />
            </motion.div>
            <h3 className="font-bold text-gray-900">Next Milestone</h3>
          </div>
          <motion.div
            className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="w-3 h-3" />
            {nextMilestone}%
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <AnimatedProgressBar
            percentage={Math.min(progressToNext, 100)}
            color="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
            showShimmer={true}
            showPulse={pixelsNeeded <= 50}
            height="lg"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200"
          >
            <p className="text-xs text-gray-600 mb-1">Pixels Needed</p>
            <p className="text-2xl font-bold text-purple-600">
              <CountUp from={0} to={pixelsNeeded} />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200"
          >
            <p className="text-xs text-gray-600 mb-1">Current Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              <CountUp from={0} to={Math.round(currentPercentage)} />%
            </p>
          </motion.div>
        </div>

        {/* Motivational Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-700 mt-4 text-center font-medium"
        >
          {pixelsNeeded <= 50 ? (
            <span className="text-green-600">🎉 Almost there! You're so close!</span>
          ) : pixelsNeeded <= 100 ? (
            <span className="text-purple-600">💪 Keep going! You're making great progress!</span>
          ) : (
            <span>Keep journaling to reach the next milestone!</span>
          )}
        </motion.p>
      </div>
    </motion.div>
  );
}
