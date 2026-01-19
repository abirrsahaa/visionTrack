"use client";

import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { VisionBoard } from "@/components/boards/VisionBoard";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import type { TimelineSnapshot } from "@/lib/types";
import { generateWeeklyBoards } from "@/lib/utils/mockData6Months";

interface SnapshotDetailModalProps {
  snapshot: TimelineSnapshot;
  onClose: () => void;
}

export function SnapshotDetailModal({ snapshot, onClose }: SnapshotDetailModalProps) {
  const completionPercentage = Math.round(snapshot.pixelsSummary.completionRate * 100);

  // Fetch domains for pixelated board
  const { data: domains } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  // Get the board for this week's snapshot
  // Parse ID gracefully: "snap_week_1" -> weekIndex 0
  const parts = snapshot.id.split("_");
  const weekNum = parts.length >= 3 ? parseInt(parts[2]) : 1;
  const weekIndex = Math.max(0, weekNum - 1); // Ensure non-negative

  const weekBoards = generateWeeklyBoards();
  const weekBoard = weekBoards[weekIndex] || weekBoards[0]; // Fallback if out of bounds

  return (
    <Modal open={true} onClose={onClose} size="xl" title={`Checkpoints :: Week ${weekNum}`}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
              {format(parseISO(snapshot.snapshotDate), "MMMM d, yyyy")}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-purple-400 font-mono text-sm">
                PIXELS :: {snapshot.pixelsSummary.totalPixels.toLocaleString()}
              </span>
              <span className="text-gray-600">•</span>
              <span className={`font-mono text-sm ${completionPercentage >= 80 ? 'text-green-400' : 'text-blue-400'}`}>
                {completionPercentage}% COMPLETE
              </span>
            </div>
          </div>
        </div>

        {/* Pixelated Vision Board */}
        {weekBoard && domains && domains.length > 0 ? (
          <div className="bg-black/50 border border-white/10 rounded-lg shadow-inner overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 z-10 pointer-events-none" />
            <VisionBoard board={weekBoard} domains={domains} pixelSize={10} />

            {/* Overlay Title */}
            <div className="absolute bottom-3 left-3 z-20">
              <span className="bg-black/80 text-xs font-mono text-white/70 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                BOARD SNAPSHOT_{weekNum}
              </span>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-white/5 border border-white/10 rounded-lg flex items-center justify-center animate-pulse">
            <p className="text-gray-500 font-mono text-sm">INITIALIZING VISUALIZATION...</p>
          </div>
        )}

        {/* Video Player (if available) */}
        {snapshot.animationUrl && (
          <div className="aspect-video bg-black rounded-lg overflow-hidden border border-white/10 relative">
            <video
              src={snapshot.animationUrl}
              controls
              autoPlay
              muted
              className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
            />
            <div className="absolute top-2 right-2 bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs font-mono border border-red-500/30">
              REPLAY
            </div>
          </div>
        )}

        {/* Narrative */}
        {snapshot.narrativeText && (
          <div className="bg-white/5 border border-white/5 p-6 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
            <h3 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-3">
              Mission Log
            </h3>
            <p className="text-lg leading-relaxed text-gray-200 font-light">
              "{snapshot.narrativeText}"
            </p>
            <div className="mt-4 flex gap-2">
              {['CAREER', 'HEALTH', 'LEARNING'].map((tag, i) => (
                <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 text-white/40">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button variant="outline" className="flex-1 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
            SHARE REPORT
          </Button>
          {snapshot.animationUrl && (
            <Button variant="outline" className="flex-1 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
              DOWNLOAD ASSET
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}