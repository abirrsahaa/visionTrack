"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Download } from "lucide-react";
import { PixelatedBoard } from "@/components/boards/PixelatedBoard";
import type { VisionBoard, Domain } from "@/lib/types";
import { format, parseISO } from "date-fns";
import Link from "next/link";

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

  const getWeekLabel = () => {
    if (!board) return "";
    const weekNum = Math.floor(
      (new Date(board.periodEnd).getTime() - new Date(board.periodStart).getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    ) + 1;
    const year = new Date(board.periodEnd).getFullYear();
    return `W-${weekNum} // ${year}`;
  };

  const boardTypes: Array<{ id: "weekly" | "monthly" | "quarterly"; label: string }> = [
    { id: "weekly", label: "WEEKLY" },
    { id: "monthly", label: "MONTHLY" },
    { id: "quarterly", label: "QUARTERLY" },
  ];

  const activeType = boardType;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Board Type Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex gap-6">
          {boardTypes.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => onBoardTypeChange?.(type.id)}
              className={`
                text-xs font-medium pb-3 px-1 transition-colors relative
                ${
                  activeType === type.id
                    ? "text-purple"
                    : "text-foreground-tertiary hover:text-foreground-secondary"
                }
              `}
              whileHover={{ y: -2 }}
            >
              {type.label}
              {activeType === type.id && (
                <motion.div
                  layoutId="activeBoardTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </motion.button>
          ))}
        </div>
        {board && (
          <span className="text-xs text-foreground-tertiary">
            {getWeekLabel()}
          </span>
        )}
      </div>

      {/* Board Display - Flexible height to match right column */}
      <div className="relative dark-card border border-gray-200 rounded overflow-hidden flex-1 min-h-0">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple border-r-transparent"></div>
              <p className="mt-4 text-xs text-foreground-secondary">LOADING BOARD...</p>
            </div>
          </div>
        ) : board && domains.length > 0 ? (
          <>
            {/* Action Icons - Top Right */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <motion.button
                className="p-2 bg-background-secondary/80 backdrop-blur-sm border border-gray-200 text-foreground-secondary rounded hover:bg-background-tertiary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-2 bg-background-secondary/80 backdrop-blur-sm border border-gray-200 text-foreground-secondary rounded hover:bg-background-tertiary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Grid Overlay Background */}
            <div className="absolute inset-0 arch-grid-overlay opacity-30 pointer-events-none z-10" />

            {/* Pixelated Board - Full height */}
            <div className="relative h-full w-full">
              <PixelatedBoard
                board={board}
                domains={domains}
                pixelSize={boardType === "weekly" ? 10 : boardType === "monthly" ? 12 : 15}
              />

              {/* Manifestation Text Overlay - Bottom Center */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6 z-10">
                <div className="text-center">
                  <p className="text-xs text-foreground-secondary mb-2">
                    CURRENT MANIFESTATION
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold italic text-white">
                    THE SOVEREIGN ARCHITECT
                  </h2>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-foreground-tertiary">
              NO BOARD AVAILABLE
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
