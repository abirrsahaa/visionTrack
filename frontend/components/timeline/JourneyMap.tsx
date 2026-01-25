"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";
import { Compass, Trophy, Target } from "lucide-react";
import { Checkpoint } from "./Checkpoint";
import { CloudLayer, MountainLayer, SparkleLayer } from "./ParallaxLayer";
import type { TimelineSnapshot } from "@/lib/types";

interface JourneyMapProps {
  snapshots: TimelineSnapshot[];
  onCheckpointClick?: (snapshot: TimelineSnapshot) => void;
}

export function JourneyMap({ snapshots, onCheckpointClick }: JourneyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Reverse snapshots to show Newest First (Top)
  const sortedSnapshots = useMemo(() => {
    return [...snapshots].sort((a, b) =>
      new Date(b.snapshotDate).getTime() - new Date(a.snapshotDate).getTime()
    );
  }, [snapshots]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll progress for drawing the path
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const ITEM_HEIGHT = 400;
  const TOTAL_HEIGHT = Math.max(sortedSnapshots.length * ITEM_HEIGHT, 1000);

  const VIEWBOX_WIDTH = 800;
  const CENTER_X = VIEWBOX_WIDTH / 2;

  // Generate Path: Starts from Top (Newest) -> Goes Down (Oldest)
  const pathD = useMemo(() => {
    return sortedSnapshots.reduce((path, _, i) => {
      const yStart = i * ITEM_HEIGHT;
      const yEnd = (i + 1) * ITEM_HEIGHT;
      const yMid = yStart + ITEM_HEIGHT / 2;

      const isLeft = i % 2 === 0;
      const targetX = isLeft ? CENTER_X - 120 : CENTER_X + 120; // Subtle curve

      if (i === 0) {
        return `M ${CENTER_X} 0 C ${CENTER_X} ${yMid * 0.5}, ${targetX} ${yMid * 0.5}, ${targetX} ${yMid} S ${CENTER_X} ${yEnd - (ITEM_HEIGHT * 0.2)}, ${CENTER_X} ${yEnd}`;
      }

      return `${path} C ${CENTER_X} ${yStart + (ITEM_HEIGHT * 0.2)}, ${targetX} ${yMid - (ITEM_HEIGHT * 0.2)}, ${targetX} ${yMid} S ${CENTER_X} ${yEnd - (ITEM_HEIGHT * 0.2)}, ${CENTER_X} ${yEnd}`;
    }, "");
  }, [sortedSnapshots, ITEM_HEIGHT, CENTER_X]);

  // Stats
  const totalPixels = snapshots.reduce((sum, s) => sum + s.pixelsSummary.totalPixels, 0);
  const avgCompletion = snapshots.length > 0
    ? Math.round(snapshots.reduce((sum, s) => sum + s.pixelsSummary.completionRate, 0) / snapshots.length * 100)
    : 0;

  // Rocket follows scroll progress
  const rocketY = useTransform(smoothProgress, [0, 1], [0, TOTAL_HEIGHT]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-background overflow-hidden"
    >
      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="opacity-30">
          <MountainLayer />
          <CloudLayer />
          <SparkleLayer />
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/5 py-4">
        <motion.div
          className="container mx-auto px-4 text-center flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-500" />
            <span className="font-mono font-bold tracking-widest text-sm">JOURNEY LOG</span>
          </div>

          <div className="flex gap-4 text-xs font-mono text-gray-400">
            <span>{snapshots.length} WEEKS</span>
            <span>{totalPixels.toLocaleString()} PX</span>
            <span>{avgCompletion}% SYNCHRONIZED</span>
          </div>
        </motion.div>
      </div>

      <div className="relative container mx-auto px-4 py-16" style={{ height: TOTAL_HEIGHT + 400 }}>

        {/* The Road SVG */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <svg
            width="100%"
            height={TOTAL_HEIGHT}
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${TOTAL_HEIGHT}`}
            preserveAspectRatio="none"
            className="opacity-80"
          >
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* Background Path (Dim) */}
            <path d={pathD} stroke="#333" strokeWidth="24" fill="none" opacity="0.3" />

            {/* Progress Path (Lit) */}
            <motion.path
              d={pathD}
              stroke="url(#roadGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              filter="url(#glow)"
              pathLength={smoothProgress}
              style={{ pathLength: smoothProgress }}
            />
          </svg>
        </div>

        {/* Checkpoints */}
        <div className="relative z-10 w-full max-w-5xl mx-auto">
          {sortedSnapshots.map((snapshot, index) => {
            const weekNumber = parseInt(snapshot.id.split("_")[2]);
            const isMonthly = weekNumber % 4 === 0;
            const topOffset = (index * ITEM_HEIGHT) + (ITEM_HEIGHT / 2) - 100;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={snapshot.id}
                className="absolute w-full"
                style={{ top: topOffset }}
              >
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -50 : 50, rotateY: isLeft ? 15 : -15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, type: "spring" }}
                  style={{ perspective: 1000 }}
                >
                  <Checkpoint
                    snapshot={snapshot}
                    index={index}
                    isMonthly={isMonthly}
                    onClick={() => onCheckpointClick?.(snapshot)}
                  />
                </motion.div>
              </div>
            )
          })}

          {/* User Avatar / Rocket - Positioned relative to scroll */}
          <motion.div
            style={{ y: rocketY, x: "-50%" }}
            className="absolute left-1/2 top-0 z-50 pointer-events-none"
          >
            <div className="relative -mt-10">
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-40 animate-pulse" />
              <div className="w-12 h-12 bg-black rounded-full border-2 border-purple-500 flex items-center justify-center shadow-xl z-10 relative">
                <Compass className="w-6 h-6 text-white animate-spin-slow" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
                <span className="bg-purple-900/80 text-purple-200 text-[10px] px-2 py-1 rounded-full border border-purple-500/30">
                  YOU
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Destination */}
        <div
          className="absolute left-0 right-0"
          style={{ top: sortedSnapshots.length * ITEM_HEIGHT + 200 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto text-center p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl"
          >
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">The Beginning</h2>
            <p className="text-gray-400 text-sm">Every Legend starts somewhere.</p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

