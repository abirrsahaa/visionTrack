"use client";

import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Flag,
  Trophy,
  MapPin,
  Sparkles,
  TrendingUp,
  Calendar,
  Award,
  Target,
} from "lucide-react";
import type { TimelineSnapshot } from "@/lib/types";

interface CheckpointProps {
  snapshot: TimelineSnapshot;
  index: number;
  isMonthly?: boolean;
  onClick?: () => void;
}

export function Checkpoint({ snapshot, index, isMonthly = false, onClick }: CheckpointProps) {
  const completionPercentage = Math.round(snapshot.pixelsSummary.completionRate * 100);
  const weekNumber = parseInt(snapshot.id.split("_")[2]);
  const isHighAchievement = completionPercentage >= 75;

  // Calculate position (alternating left and right)
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center gap-8 mb-32 ${
        isLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* Checkpoint Content Card */}
      <motion.div
        whileHover={{ scale: 1.05, y: -8 }}
        onClick={onClick}
        className={`flex-1 max-w-md cursor-pointer ${isLeft ? "text-right" : "text-left"}`}
      >
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden group hover:shadow-2xl hover:border-blue-300 transition-all duration-300">
          {/* Header with gradient */}
          <div
            className={`p-6 ${
              isMonthly
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : isHighAchievement
                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                : "bg-gradient-to-r from-gray-400 to-gray-500"
            }`}
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {isMonthly ? (
                  <Trophy className="w-6 h-6" />
                ) : (
                  <Flag className="w-5 h-5" />
                )}
                <span className="font-bold text-lg">
                  {isMonthly ? `Month ${Math.ceil(weekNumber / 4)}` : `Week ${weekNumber}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="text-2xl font-bold">{completionPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {format(parseISO(snapshot.snapshotDate), "MMMM d, yyyy")}
              </span>
            </div>

            {/* Pixel Contribution */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Vision Board Contribution</span>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {snapshot.pixelsSummary.totalPixels.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">pixels revealed</div>

              {/* Mini Progress Bar */}
              <div className="w-full h-2 bg-white rounded-full overflow-hidden mt-3 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${completionPercentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>

            {/* Narrative Preview */}
            {snapshot.narrativeText && (
              <p className="text-sm text-gray-600 line-clamp-2 italic">
                "{snapshot.narrativeText}"
              </p>
            )}

            {/* Achievement Badge */}
            {isHighAchievement && (
              <motion.div
                className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold">Excellent Progress!</span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Checkpoint Marker Icon */}
      <motion.div
        className="relative flex-shrink-0"
        whileHover={{ scale: 1.2, rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          {/* Glow Effect */}
          <motion.div
            className={`absolute inset-0 rounded-full ${
              isMonthly ? "bg-purple-400" : isHighAchievement ? "bg-blue-400" : "bg-gray-300"
            } blur-xl opacity-50`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          />

          {/* Marker Circle */}
          <div
            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 border-white ${
              isMonthly
                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                : isHighAchievement
                ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                : "bg-gradient-to-br from-gray-400 to-gray-500"
            }`}
          >
            {isMonthly ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : isHighAchievement ? (
              <Target className="w-7 h-7 text-white" />
            ) : (
              <MapPin className="w-7 h-7 text-white" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Empty space for the other side */}
      <div className="flex-1 max-w-md" />
    </motion.div>
  );
}
