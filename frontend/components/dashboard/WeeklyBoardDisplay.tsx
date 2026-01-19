"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Download, Eye, Sparkles } from "lucide-react";
import { PixelatedBoard } from "@/components/boards/PixelatedBoard";
import type { VisionBoard, Domain } from "@/lib/types";
import { SystemButton } from "@/components/shared/SystemButton";

interface WeeklyBoardDisplayProps {
  board: VisionBoard | null;
  domains: Domain[];
  boardType?: "weekly" | "monthly" | "quarterly";
  onBoardTypeChange?: (type: "weekly" | "monthly" | "quarterly") => void;
  isLoading?: boolean;
}

export function WeeklyBoardDisplay({
  board,
  domains,
  boardType = "weekly",
  onBoardTypeChange,
  isLoading = false,
}: WeeklyBoardDisplayProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle fullscreen (mock)
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <div className={`relative flex flex-col h-full transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-4' : ''}`}>

      {/* Immersive Board Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden rounded-2xl group border border-white/5 bg-[#050505] shadow-2xl">

        {/* Top Controls Overlay - Fade in on hover */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Tab Switcher - Floating Pill */}
          <div className="flex gap-1 bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/10">
            {(["weekly", "monthly", "quarterly"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onBoardTypeChange?.(type)}
                className={`px-3 py-1 text-[10px] font-mono rounded-full transition-all uppercase ${boardType === type
                    ? "bg-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              className="p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFullscreen}
            >
              <Maximize2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Board Content */}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-purple/30 border-t-purple rounded-full animate-spin" />
          </div>
        ) : board && domains.length > 0 ? (
          <PixelatedBoard
            board={board}
            domains={domains}
            pixelSize={isFullscreen ? 8 : 12}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
            <Sparkles className="w-12 h-12 text-gray-600" />
            <p className="text-gray-500 font-mono text-sm">NO VISION DATA AVAILABLE</p>
          </div>
        )}

      </div>
    </div>
  );
}
