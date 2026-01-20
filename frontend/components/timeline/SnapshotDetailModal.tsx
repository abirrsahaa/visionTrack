"use client";

import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { VisionBoard } from "@/components/boards/VisionBoard";
import { Button } from "@/components/shared/Button";
import type { TimelineSnapshot } from "@/lib/types";
import { generateWeeklyBoards } from "@/lib/utils/mockData6Months";

interface SnapshotDetailModalProps {
  snapshot: TimelineSnapshot;
  onClose: () => void;
}

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export function SnapshotDetailModal({ snapshot, onClose }: SnapshotDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const completionPercentage = Math.round(snapshot.pixelsSummary.completionRate * 100);

  useEffect(() => {
    setMounted(true);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Fetch domains for board
  const { data: domains } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  const parts = snapshot.id.split("_");
  const weekNum = parts.length >= 3 ? parseInt(parts[2]) : 1;
  const weekIndex = Math.max(0, weekNum - 1);

  const weekBoards = generateWeeklyBoards();
  const weekBoard = weekBoards[weekIndex] || weekBoards[0];

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Content Container - Removed 'overflow-hidden' from container to allow shadows to pop if needed, but keeping for corner rounding */}
      <div className="relative z-10 w-full max-w-4xl bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 shrink-0">
          <div>
            <h2 className="text-xl font-bold font-mono text-white tracking-widest uppercase">
              CHECKPOINT :: {weekNum}
            </h2>
            <p className="text-xs text-gray-400 font-mono mt-1">
              {format(parseISO(snapshot.snapshotDate), "MMMM d, yyyy").toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="text-xs text-gray-500 font-mono mb-1">COMPLETION</div>
              <div className={`text-2xl font-bold font-mono ${completionPercentage >= 80 ? 'text-green-400' : 'text-blue-400'}`}>
                {completionPercentage}%
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="text-xs text-gray-500 font-mono mb-1">PIXELS</div>
              <div className="text-2xl font-bold font-mono text-purple-400">
                {snapshot.pixelsSummary.totalPixels.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Central Visualization */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Board View */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono text-gray-500 uppercase">Vision Snapshot</h3>
              {weekBoard && domains && domains.length > 0 ? (
                <div className="aspect-video bg-black rounded-lg border border-white/10 overflow-hidden relative shadow-lg">
                  <VisionBoard board={weekBoard} domains={domains} pixelSize={8} />

                  {/* Overlay Title */}
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="bg-black/80 text-xs font-mono text-white/70 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                      BOARD SNAPSHOT_{weekNum}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                  <span className="text-xs font-mono text-gray-500">DATA_UNAVAILABLE</span>
                </div>
              )}
            </div>

            {/* Narrative / Video */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono text-gray-500 uppercase">Mission Report</h3>
              <div className="h-full bg-white/5 rounded-lg border border-white/10 p-5 flex flex-col gap-4">
                {snapshot.animationUrl ? (
                  <div className="aspect-video bg-black rounded overflow-hidden border border-white/10">
                    <video src={snapshot.animationUrl} className="w-full h-full object-cover opacity-80" autoPlay muted loop />
                  </div>
                ) : null}

                {snapshot.narrativeText && (
                  <div className="relative pl-4 border-l-2 border-purple-500/50">
                    <p className="text-sm leading-relaxed text-gray-300 font-light">
                      "{snapshot.narrativeText}"
                    </p>
                  </div>
                )}

                <div className="mt-auto pt-4 flex gap-2 flex-wrap">
                  {['CAREER', 'HEALTH', 'LEARNING'].map((tag, i) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 text-white/40">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 pt-4 border-t border-white/5">
            <Button variant="outline" className="flex-1 font-mono text-xs py-6 border-white/10 hover:bg-white/5 text-gray-300">
              EXPORT REPORT
            </Button>
            <Button className="flex-1 font-mono text-xs py-6 bg-purple-600 hover:bg-purple-700 text-white border-none">
              SHARE MILESTONE
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}