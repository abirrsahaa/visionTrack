"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { JourneyMap } from "@/components/timeline/JourneyMap";
import { SnapshotDetailModal } from "@/components/timeline/SnapshotDetailModal";
import type { TimelineSnapshot } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function TimelinePage() {
  const [weeksToShow, setWeeksToShow] = useState(26);
  const [selectedSnapshot, setSelectedSnapshot] = useState<TimelineSnapshot | null>(null);

  const { data: timeline, isLoading } = useQuery({
    queryKey: queryKeys.timeline.weeks(weeksToShow),
    queryFn: () => api.timeline.getWeeks(weeksToShow),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-16 h-16 text-foreground" />
          </motion.div>
          <p className="font-mono text-xs text-foreground-secondary">LOADING YOUR JOURNEY...</p>
        </motion.div>
      </div>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          className="bg-background-secondary rounded-lg border border-gray-800 p-12 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-20 h-20 bg-background-tertiary rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700"
          >
            <span className="text-4xl">🗺️</span>
          </motion.div>
          <h2 className="font-mono text-xl font-bold text-foreground mb-4 uppercase tracking-wider">
            YOUR JOURNEY AWAITS
          </h2>
          <p className="font-sans text-sm text-foreground-secondary mb-6">
            Start journaling to see your progress unfold on this beautiful journey map
          </p>
          <motion.button
            className="font-mono text-xs font-semibold bg-background-tertiary border border-gray-700 text-foreground px-6 py-3 rounded hover:bg-background-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            START YOUR FIRST ENTRY
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <JourneyMap snapshots={timeline} onCheckpointClick={setSelectedSnapshot} />

      {/* Detail Modal */}
      {selectedSnapshot && (
        <SnapshotDetailModal
          snapshot={selectedSnapshot}
          onClose={() => setSelectedSnapshot(null)}
        />
      )}

      {/* Load More Button - Fixed at bottom */}
      {timeline.length >= weeksToShow && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => setWeeksToShow((prev) => prev + 13)}
            className="font-mono text-xs font-semibold bg-background-secondary border-2 border-gray-700 text-foreground px-6 py-3 rounded hover:bg-background-tertiary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LOAD EARLIER WEEKS ↓
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
