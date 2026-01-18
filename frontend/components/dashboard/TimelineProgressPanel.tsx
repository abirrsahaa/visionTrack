"use client";

import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import type { TimelineSnapshot } from "@/lib/types";
import Link from "next/link";

interface TimelineProgressPanelProps {
  snapshots?: TimelineSnapshot[];
  currentWeekId?: string;
  onSnapshotClick?: (snapshot: TimelineSnapshot) => void;
}

export function TimelineProgressPanel({
  snapshots = [],
  currentWeekId,
  onSnapshotClick,
}: TimelineProgressPanelProps) {
  const displaySnapshots = snapshots.slice(0, 5).reverse(); // Show latest 5, newest first

  return (
    <div className="space-y-4">
      <h3 className="font-mono text-xs font-semibold text-arch-dark-text-primary uppercase tracking-wider">
        TIMELINE PROGRESS
      </h3>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {displaySnapshots.length > 0 ? (
          displaySnapshots.map((snapshot, index) => {
            const startDate = parseISO(snapshot.snapshotDate);
            const weekStart = format(startDate, "MMM d");
            const weekEnd = format(startDate, "MMM d");
            const isActive = snapshot.id === currentWeekId;

            return (
              <motion.div
                key={snapshot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSnapshotClick?.(snapshot)}
                className={`
                  flex items-center gap-3 p-3 rounded border transition-all cursor-pointer
                  ${
                    isActive
                      ? "bg-arch-dark-bg-tertiary border-arch-dark-border-primary"
                      : "bg-arch-dark-bg-secondary border-arch-dark-border-secondary hover:border-arch-dark-border-primary"
                  }
                `}
                whileHover={{ x: 4 }}
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 flex-shrink-0 bg-arch-dark-bg-primary border border-arch-dark-border-primary rounded overflow-hidden">
                  {snapshot.boardImageUrl ? (
                    <img
                      src={snapshot.boardImageUrl}
                      alt={`Week ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-4 h-4 border border-arch-dark-border-primary" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-arch-dark-text-tertiary">
                      {weekStart.toUpperCase()} - {weekEnd.toUpperCase()}
                    </span>
                    {isActive && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-blue-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                  </div>
                  <p className="font-sans text-sm font-medium text-arch-dark-text-primary truncate">
                    {snapshot.narrativeText || `Week ${index + 1}: Progress Update`}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-8 text-center">
            <p className="font-mono text-xs text-arch-dark-text-tertiary">
              NO TIMELINE DATA
            </p>
          </div>
        )}
      </div>

      {snapshots.length > 5 && (
        <Link href="/timeline">
          <motion.button
            className="w-full font-mono text-xs text-arch-dark-text-secondary hover:text-arch-dark-text-primary border border-arch-dark-border-primary rounded p-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            VIEW ALL →
          </motion.button>
        </Link>
      )}
    </div>
  );
}
