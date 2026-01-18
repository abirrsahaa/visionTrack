"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface JourneyAnimationProps {
  className?: string;
}

export function JourneyAnimation({ className = "" }: JourneyAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { label: "Week 1", progress: 0, pixels: 0 },
    { label: "Week 4", progress: 25, pixels: 250 },
    { label: "Month 1", progress: 40, pixels: 800 },
    { label: "Month 3", progress: 65, pixels: 2400 },
    { label: "Month 6", progress: 85, pixels: 5200 },
    { label: "Year 1", progress: 100, pixels: 10000 },
  ];

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isInView]);

  const current = stages[currentStage];

  return (
    <div ref={ref} className={className}>
      <div className="space-y-8">
        {/* Board Preview */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl">
          {/* Grayscale base */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 opacity-30" />
          
          {/* Colored pixels overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-80"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{
              clipPath: `inset(${100 - current.progress}% 0 0 0)`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Grid overlay for pixel effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Stage label overlay */}
          <motion.div
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentStage}
          >
            <p className="font-mono text-sm font-bold text-gray-900">{current.label}</p>
          </motion.div>

          {/* Progress overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-gray-600 uppercase">Progress</span>
              <span className="font-mono text-sm font-bold text-gray-900">{current.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                initial={{ width: "0%" }}
                animate={{ width: `${current.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-xs text-gray-500">Pixels Earned</span>
              <motion.span
                className="font-mono text-sm font-bold text-gray-900"
                key={current.pixels}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {current.pixels.toLocaleString()}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-between items-center">
          {stages.map((stage, index) => (
            <motion.button
              key={stage.label}
              className={`relative flex flex-col items-center gap-2 ${
                index <= currentStage ? "text-blue-600" : "text-gray-400"
              }`}
              onClick={() => setCurrentStage(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  index <= currentStage ? "bg-blue-600" : "bg-gray-300"
                }`}
                animate={{
                  scale: index === currentStage ? [1, 1.3, 1] : 1,
                }}
                transition={{ repeat: index === currentStage ? Infinity : 0, duration: 1 }}
              />
              <span className="font-mono text-xs font-medium">{stage.label}</span>
              {index < stages.length - 1 && (
                <div
                  className={`absolute top-1.5 left-4 w-16 h-0.5 ${
                    index < currentStage ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
