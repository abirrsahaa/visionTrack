"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Target, Sparkles, Trophy, Compass } from "lucide-react";
import { Checkpoint } from "./Checkpoint";
import { CloudLayer, MountainLayer, SparkleLayer } from "./ParallaxLayer";
import type { TimelineSnapshot } from "@/lib/types";

interface JourneyMapProps {
  snapshots: TimelineSnapshot[];
  onCheckpointClick?: (snapshot: TimelineSnapshot) => void;
}

export function JourneyMap({ snapshots, onCheckpointClick }: JourneyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Road path progress
  const pathProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Calculate overall progress
  const totalPixels = snapshots.reduce((sum, s) => sum + s.pixelsSummary.totalPixels, 0);
  const avgCompletion = snapshots.length > 0
    ? Math.round(
        snapshots.reduce((sum, s) => sum + s.pixelsSummary.completionRate, 0) /
          snapshots.length *
          100
      )
    : 0;

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 overflow-hidden"
    >
      {/* Parallax Background Layers */}
      <MountainLayer />
      <CloudLayer />
      <SparkleLayer />

      {/* Journey Header - Vision Board Destination */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-white/95 via-white/90 to-transparent backdrop-blur-sm border-b border-gray-200 py-8">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Compass className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Journey to Vision
            </h1>
            <Compass className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 text-lg">
            {snapshots.length} weeks of progress • {totalPixels.toLocaleString()} pixels revealed •{" "}
            {avgCompletion}% average completion
          </p>
        </motion.div>
      </div>

      {/* Main Journey Container */}
      <div className="relative container mx-auto px-4 py-16">
        {/* Central Road Path - SVG */}
        <svg
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none"
          width="8"
          height="100%"
          style={{ zIndex: 0 }}
        >
          {/* Road background */}
          <motion.line
            x1="4"
            y1="0"
            x2="4"
            y2="100%"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Animated progress line */}
          <motion.line
            x1="4"
            y1="0"
            x2="4"
            y2="100%"
            stroke="url(#roadGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="1"
            style={{
              pathLength: pathProgress,
            }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Dashed Road Markers */}
        <svg
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none"
          width="8"
          height="100%"
          style={{ zIndex: 1 }}
        >
          <motion.line
            x1="4"
            y1="0"
            x2="4"
            y2="100%"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="20 40"
            strokeLinecap="round"
            style={{
              pathLength: pathProgress,
            }}
          />
        </svg>

        {/* Checkpoints */}
        <div className="relative z-10 pt-20">
          {snapshots.map((snapshot, index) => {
            const weekNumber = parseInt(snapshot.id.split("_")[2]);
            const isMonthly = weekNumber % 4 === 0;

            return (
              <Checkpoint
                key={snapshot.id}
                snapshot={snapshot}
                index={index}
                isMonthly={isMonthly}
                onClick={() => onCheckpointClick?.(snapshot)}
              />
            );
          })}
        </div>

        {/* Vision Board Destination at Bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 mt-32 mb-16"
        >
          <div className="max-w-2xl mx-auto">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-3xl blur-3xl opacity-30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            />

            {/* Destination Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 p-8 text-center">
                <motion.div
                  className="inline-block mb-4"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Trophy className="w-20 h-20 text-white drop-shadow-lg" />
                </motion.div>
                <h2 className="text-4xl font-bold text-white mb-2">Your Complete Vision</h2>
                <p className="text-white/90 text-lg">The journey leads here</p>
              </div>

              {/* Content */}
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-full border border-blue-200 mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                    <span className="font-bold text-2xl text-gray-900">
                      {totalPixels.toLocaleString()} Total Pixels
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                  Every checkpoint on this journey brings your vision into focus. Keep going to reveal
                  the complete picture of your dreams.
                </p>

                {/* Sparkle decoration */}
                <div className="flex items-center justify-center gap-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                  <span className="text-gray-500 font-medium">Your vision awaits</span>
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, -180, -360],
                    }}
                    transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-white rounded-full shadow-2xl p-4 border-2 border-gray-200">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#e5e7eb"
              strokeWidth="4"
              fill="none"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#progressGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              style={{
                pathLength: scrollYProgress,
              }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
