"use client";

import Image from "next/image";
import type { VisionBoard as VisionBoardType, Domain } from "@/lib/types";
import { PixelatedBoard } from "./PixelatedBoard";

interface VisionBoardProps {
  board: VisionBoardType;
  domains?: Domain[];
  pixelSize?: number;
}

export function VisionBoard({ board, domains = [], pixelSize = 8 }: VisionBoardProps) {
  const progressPercentage =
    board.totalPixels > 0
      ? Math.round((board.coloredPixels / board.totalPixels) * 100)
      : 0;

  // Always use pixelated board if domains are provided
  if (domains.length > 0) {
    return (
      <div className="space-y-4">
        <PixelatedBoard 
          board={board} 
          domains={domains} 
          pixelSize={pixelSize}
          showCheckpoints={false}
        />
        {/* Board Info */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="capitalize">
            {board.designStyle} design • {board.boardType} • Pixelated Grid ({pixelSize}px)
          </span>
          <span>{progressPercentage}% complete</span>
        </div>
      </div>
    );
  }

  // Fallback to image-based board
  return (
    <div className="space-y-4">
      {/* Board Display */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={board.currentImageUrl || board.baseImageUrl}
          alt="Vision Board"
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
        />

        {/* Progress Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            {board.coloredPixels} / {board.totalPixels} pixels
          </p>
          <div className="w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Board Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="capitalize">{board.designStyle} design</span>
        <span>{progressPercentage}% complete</span>
      </div>
    </div>
  );
}