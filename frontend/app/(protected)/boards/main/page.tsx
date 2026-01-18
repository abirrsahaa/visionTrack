"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { SystemPanel } from "@/components/shared/SystemPanel";
import { PixelatedBoard } from "@/components/boards/PixelatedBoard";
import { MainBoardProgress } from "@/components/boards/MainBoardProgress";
import { Loader2, Download, Share2, Maximize2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { SystemButton } from "@/components/shared/SystemButton";

export default function MainBoardPage() {
  const { data: mainBoard, isLoading: boardLoading } = useQuery({
    queryKey: queryKeys.boards.annual,
    queryFn: () => api.boards.getAnnual(),
  });

  const { data: domains, isLoading: domainsLoading } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  const { data: timeline } = useQuery({
    queryKey: queryKeys.timeline.weeks(26),
    queryFn: () => api.timeline.getWeeks(26),
  });

  const { data: pixelSummary } = useQuery({
    queryKey: queryKeys.pixels.summary(),
    queryFn: () => api.pixels.getSummary(),
  });

  if (boardLoading || domainsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-16 h-16 text-purple" />
          </motion.div>
          <p className="text-xs text-foreground-tertiary">LOADING BOARD...</p>
        </div>
      </div>
    );
  }

  const completionPercentage = mainBoard
    ? Math.round((mainBoard.coloredPixels / mainBoard.totalPixels) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background space-y-6 py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="font-mono text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wider">
            MAIN VISION BOARD
          </h1>
          <p className="font-mono text-xs text-gray-600">
            Your complete annual vision manifestation • {completionPercentage}% Complete
            {mainBoard && ` • ${format(parseISO(mainBoard.periodStart), "MMM d, yyyy")} - ${format(parseISO(mainBoard.periodEnd), "MMM d, yyyy")}`}
          </p>
        </div>
        <div className="flex gap-2">
          <SystemButton variant="outline" size="sm">
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </SystemButton>
          <SystemButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </SystemButton>
          <SystemButton variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </SystemButton>
        </div>
      </motion.div>

      {/* Board Display */}
      <SystemPanel className="p-0 overflow-hidden">
        {mainBoard && domains && domains.length > 0 ? (
          <PixelatedBoard
            board={mainBoard}
            domains={domains}
            pixelSize={12}
          />
        ) : (
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}
        {/* Progress Bar */}
        {mainBoard && (
          <div className="p-4 bg-background-secondary border-t border-gray-200">
            <div className="flex justify-between items-center mb-2 font-mono text-sm text-gray-600">
              <span>OVERALL PROGRESS</span>
              <span>
                {mainBoard.coloredPixels.toLocaleString()} / {mainBoard.totalPixels.toLocaleString()} PIXELS
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </SystemPanel>

      {/* Progress Breakdown */}
      {mainBoard && timeline && (
        <SystemPanel>
          <MainBoardProgress
            mainBoard={mainBoard}
            timeline={timeline}
            domains={domains || []}
          />
        </SystemPanel>
      )}

      {/* Domain Breakdown */}
      {pixelSummary && domains && (
        <SystemPanel title="DOMAIN BREAKDOWN">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {domains.map((domain) => {
              const domainData = pixelSummary.byDomain.find((d) => d.domainId === domain.id);
              if (!domainData) return null;

              return (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="dark-card rounded-lg p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: domain.colorHex }}
                    />
                    <h4 className="font-mono font-semibold text-gray-900 uppercase text-sm">{domain.name}</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-mono text-gray-600">
                      <span>PIXELS</span>
                      <span className="font-medium text-gray-900">
                        {domainData.totalPixels.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: domain.colorHex }}
                        initial={{ width: 0 }}
                        animate={{ width: `${domainData.percentage * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <p className="font-mono text-xs text-gray-500">
                      {Math.round(domainData.percentage * 100)}% COMPLETE
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </SystemPanel>
      )}
    </div>
  );
}
