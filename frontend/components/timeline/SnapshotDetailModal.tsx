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
  const weekIndex = parseInt(snapshot.id.split("_")[2]) - 1;
  const weekBoards = generateWeeklyBoards();
  const weekBoard = weekBoards[weekIndex];

  return (
    <Modal open={true} onClose={onClose} size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Week of {format(parseISO(snapshot.snapshotDate), "MMMM d, yyyy")}
          </h2>
          <p className="text-gray-500 mt-1">
            {snapshot.pixelsSummary.totalPixels.toLocaleString()} pixels • {completionPercentage}% complete
          </p>
        </div>

        {/* Pixelated Vision Board */}
        {weekBoard && domains && domains.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <VisionBoard board={weekBoard} domains={domains} pixelSize={10} />
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Loading board...</p>
          </div>
        )}

        {/* Video Player (if available) */}
        {snapshot.animationUrl && (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={snapshot.animationUrl}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>
        )}

        {/* Narrative */}
        {snapshot.narrativeText && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Your Week's Story</h3>
            <p className="text-lg leading-relaxed text-gray-900">
              {snapshot.narrativeText}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" className="flex-1">
            Share This Week
          </Button>
          {snapshot.animationUrl && (
            <Button variant="outline" className="flex-1">
              Download Video
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}