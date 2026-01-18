"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { PixelatedBoard } from "@/components/boards/PixelatedBoard";
import { AnimatedProgressBar } from "@/components/shared/AnimatedProgressBar";
import type { VisionBoard, Domain } from "@/lib/types";

interface VisionBoardPreviewProps {
  board: VisionBoard | null;
  domains: Domain[];
  completionPercentage: number;
  isLoading?: boolean;
}

export function VisionBoardPreview({
  board,
  domains,
  completionPercentage,
  isLoading = false,
}: VisionBoardPreviewProps) {
  // Get domain progress from pixelSummary if available
  const domainProgress = domains.map((domain) => {
    // Try to calculate from board data (simplified - would use actual pixelSummary in real app)
    const totalDomainPixels = board?.layoutMetadata?.domains?.find(
      (d) => d.domainId === domain.id
    )?.pixels?.length || 0;
    const domainPercentage = board && board.totalPixels
      ? Math.round((totalDomainPixels / (board.totalPixels / domains.length)) * 100)
      : 0;
    
    // Fallback to mock percentages if no board data
    const percentages: Record<string, number> = {
      Career: 45,
      Health: 30,
      Learning: 15,
      Relations: 6,
    };
    
    return {
      ...domain,
      percentage: domainPercentage || percentages[domain.name] || 0,
    };
  });

  const nextUnlockDomain = domainProgress.find((d) => d.percentage < 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Your Vision Board</h3>
          <Link href="/boards/main">
            <motion.button
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View Full Board
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        {/* Vision Board Thumbnail */}
        {isLoading ? (
          <div className="aspect-video bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading board...</div>
          </div>
        ) : board && domains.length > 0 ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100"
          >
            <PixelatedBoard board={board} domains={domains} pixelSize={12} />
            
            {/* Overlay with completion percentage */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
              <div className="text-white">
                <div className="text-2xl font-bold mb-1">{completionPercentage}% Complete</div>
                <div className="text-xs opacity-90">
                  {board.coloredPixels.toLocaleString()} / {board.totalPixels.toLocaleString()} pixels
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No board available</p>
            </div>
          </div>
        )}
      </div>

      {/* Domain Progress Circles */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {domainProgress.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -4 }}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={domain.colorHex}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * (1 - domain.percentage / 100)}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 28 * (1 - domain.percentage / 100),
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: domain.colorHex }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-gray-900">{domain.percentage}%</div>
                <div className="text-xs text-gray-600">{domain.name}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Next Unlock */}
        {nextUnlockDomain && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900">Next Unlock</span>
            </div>
            <p className="text-xs text-gray-700">
              Complete today's journal to reveal more of your <span className="font-semibold">{nextUnlockDomain.name}</span> vision.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
