"use client";

import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Calendar, TrendingUp, Award, Sparkles } from "lucide-react";
import type { TimelineSnapshot } from "@/lib/types";
import { PixelatedBoard } from "@/components/boards/PixelatedBoard";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/queryClient";
import { api } from "@/lib/api";
import { generateWeeklyBoards } from "@/lib/utils/mockData6Months";

interface WeekCardProps {
  snapshot: TimelineSnapshot;
  onClick: () => void;
}

export function WeekCard({ snapshot, onClick }: WeekCardProps) {
  const completionPercentage = Math.round(snapshot.pixelsSummary.completionRate * 100);

  // Fetch domains for pixelated board
  const { data: domains } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  // Get the board for this week's snapshot
  const weekIndex = parseInt(snapshot.id.split("_")[2]) - 1;
  const weekBoards = generateWeeklyBoards();
  const weekBoard = weekBoards[weekIndex];

  if (!domains || !weekBoard) {
    return (
      <div className="flex-shrink-0 w-96 bg-white rounded-2xl shadow-lg animate-pulse">
        <div className="aspect-video bg-gray-200 rounded-t-2xl" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -12 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group flex-shrink-0 w-96 cursor-pointer snap-center bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-300"
    >
      {/* Image Container with Enhanced Overlay */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {domains && domains.length > 0 && (
          <PixelatedBoard board={weekBoard} domains={domains} pixelSize={8} />
        )}
        
        {/* Gradient Overlay on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Completion Badge with Pulse */}
        <motion.div
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-gray-200 z-20"
          animate={completionPercentage % 10 === 0 ? {
            scale: [1, 1.15, 1],
            boxShadow: [
              "0 4px 12px rgba(0, 0, 0, 0.15)",
              "0 0 0 8px rgba(59, 130, 246, 0)",
            ],
          } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-gray-900">{completionPercentage}%</span>
          </div>
        </motion.div>
        
        {/* Week Number Badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-xl font-bold text-sm z-20 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Week {parseInt(snapshot.id.split("_")[2])}
        </div>
        
        {/* Narrative Overlay on Hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.p
            className="text-white text-sm leading-relaxed line-clamp-3 font-medium"
            initial={{ y: 10 }}
            whileHover={{ y: 0 }}
          >
            {snapshot.narrativeText}
          </motion.p>
        </motion.div>
      </div>
      
      {/* Card Content with Gradient Background */}
      <div className="p-6 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <motion.h3
            className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            {format(parseISO(snapshot.snapshotDate), "MMM d, yyyy")}
          </motion.h3>
          <motion.div
            className="flex items-center gap-1.5 text-gray-600 group-hover:text-blue-600 transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {snapshot.pixelsSummary.totalPixels.toLocaleString()}px
            </span>
          </motion.div>
        </div>
        
        {/* Animated Progress Bar with Shimmer */}
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </motion.div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(parseISO(snapshot.snapshotDate), "EEEE")}</span>
          </div>
          {completionPercentage >= 75 && (
            <motion.div
              className="flex items-center gap-1.5 text-green-600 font-semibold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Excellent Week!</span>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Click Indicator */}
      <motion.div
        className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-20"
        animate={{}}
      >
        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Award className="w-4 h-4 text-blue-600" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
