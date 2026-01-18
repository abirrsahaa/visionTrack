"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { VisionBoard } from "@/components/boards/VisionBoard";
import { Button } from "@/components/shared/Button";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";
import { generateWeeklyBoards } from "@/lib/utils/mockData6Months";

export default function CheckpointsPage() {
  const [selectedWeek, setSelectedWeek] = useState(26); // Current week (26)

  // Fetch domains
  const { data: domains } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  // Fetch timeline to get checkpoints
  const { data: timeline } = useQuery({
    queryKey: queryKeys.timeline.weeks(26),
    queryFn: () => api.timeline.getWeeks(26),
  });

  // Get all weekly boards
  const allWeekBoards = generateWeeklyBoards();

  // Key checkpoints (weeks 1, 4, 8, 12, 16, 20, 24, 26)
  const checkpoints = [1, 4, 8, 12, 16, 20, 24, 26].map((weekNum) => {
    const weekIndex = weekNum - 1;
    const board = allWeekBoards[weekIndex];
    const snapshot = timeline?.find((s) => parseInt(s.id.split("_")[2]) === weekNum);
    return {
      week: weekNum,
      board,
      snapshot,
      completionRate: board ? Math.round((board.coloredPixels / board.totalPixels) * 100) : 0,
    };
  }).filter((cp) => cp.board); // Filter out any missing boards

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Journey Checkpoints</h1>
            <p className="mt-1 text-gray-600">
              See how your vision board evolved through key milestones
            </p>
          </div>
        </div>
      </div>

      {/* Checkpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {checkpoints.map((checkpoint) => {
          const isSelected = selectedWeek === checkpoint.week;
          return (
            <div
              key={checkpoint.week}
              onClick={() => setSelectedWeek(checkpoint.week)}
              className={`
                cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden
                transition-all hover:shadow-md border-2
                ${isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent"}
              `}
            >
              {/* Checkpoint Board Preview */}
              <div className="relative aspect-video bg-gray-100">
                {checkpoint.board && domains && domains.length > 0 ? (
                  <VisionBoard 
                    board={checkpoint.board} 
                    domains={domains} 
                    pixelSize={14}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Loading...</p>
                  </div>
                )}

                {/* Week Badge */}
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Week {checkpoint.week}
                </div>

                {/* Completion Badge */}
                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium shadow border border-gray-200">
                  {checkpoint.completionRate}%
                </div>
              </div>

              {/* Checkpoint Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {checkpoint.snapshot 
                      ? format(parseISO(checkpoint.snapshot.snapshotDate), "MMM d, yyyy")
                      : `Week ${checkpoint.week}`}
                  </p>
                </div>
                {checkpoint.snapshot?.narrativeText && (
                  <p className="text-sm text-gray-700 line-clamp-2 mt-2">
                    {checkpoint.snapshot.narrativeText}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span>{checkpoint.board?.coloredPixels.toLocaleString()} pixels</span>
                  <span>{checkpoint.completionRate}% complete</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Checkpoint Detail */}
      {selectedWeek && (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Week {selectedWeek} - Detailed View
          </h2>
          
          {(() => {
            const checkpoint = checkpoints.find((cp) => cp.week === selectedWeek);
            if (!checkpoint || !checkpoint.board || !domains) return null;

            return (
              <div className="space-y-6">
                {/* Full Pixelated Board */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Vision Board Progress</h3>
                  <VisionBoard 
                    board={checkpoint.board} 
                    domains={domains} 
                    pixelSize={8}
                  />
                </div>

                {/* Domain Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Domain Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {domains.map((domain) => {
                      const domainData = checkpoint.board.layoutMetadata.domains.find(
                        (d) => d.domainId === domain.id
                      );
                      const domainPixels = domainData?.pixels.length || 0;
                      const totalDomainPixels = checkpoint.board.totalPixels / domains.length;
                      const domainCompletion = Math.round((domainPixels / totalDomainPixels) * 100);

                      return (
                        <div key={domain.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: domain.colorHex }}
                            />
                            <p className="font-semibold text-gray-900">{domain.name}</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            {domainPixels.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">pixels earned</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${domainCompletion}%`,
                                backgroundColor: domain.colorHex,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{domainCompletion}% complete</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Narrative */}
                {checkpoint.snapshot?.narrativeText && (
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Week's Story</h3>
                    <p className="text-blue-800 leading-relaxed">
                      {checkpoint.snapshot.narrativeText}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
