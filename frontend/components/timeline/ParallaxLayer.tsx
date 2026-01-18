"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Mountain, Cloud, Sparkles } from "lucide-react";

interface ParallaxLayerProps {
  children?: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxLayer({ children, speed = 0.5, className = "" }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export function MountainLayer() {
  return (
    <ParallaxLayer speed={0.3} className="absolute inset-x-0 bottom-0 pointer-events-none">
      <div className="relative h-96 opacity-10">
        {/* Left Mountains */}
        <div className="absolute left-0 bottom-0">
          <Mountain className="w-64 h-64 text-gray-400" strokeWidth={1} />
        </div>
        <div className="absolute left-32 bottom-0">
          <Mountain className="w-48 h-48 text-gray-300" strokeWidth={1} />
        </div>

        {/* Right Mountains */}
        <div className="absolute right-0 bottom-0">
          <Mountain className="w-56 h-56 text-gray-400" strokeWidth={1} />
        </div>
        <div className="absolute right-40 bottom-0">
          <Mountain className="w-40 h-40 text-gray-300" strokeWidth={1} />
        </div>
      </div>
    </ParallaxLayer>
  );
}

export function CloudLayer() {
  return (
    <ParallaxLayer speed={0.6} className="absolute inset-0 pointer-events-none">
      <div className="relative h-full">
        {/* Clouds scattered across the view */}
        <motion.div
          className="absolute top-20 left-10"
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        >
          <Cloud className="w-24 h-24 text-blue-100 opacity-60" strokeWidth={1} />
        </motion.div>

        <motion.div
          className="absolute top-40 right-20"
          animate={{ x: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        >
          <Cloud className="w-32 h-32 text-blue-50 opacity-50" strokeWidth={1} />
        </motion.div>

        <motion.div
          className="absolute top-96 left-1/4"
          animate={{ x: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        >
          <Cloud className="w-28 h-28 text-blue-100 opacity-40" strokeWidth={1} />
        </motion.div>

        <motion.div
          className="absolute bottom-96 right-1/3"
          animate={{ x: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        >
          <Cloud className="w-20 h-20 text-blue-50 opacity-60" strokeWidth={1} />
        </motion.div>
      </div>
    </ParallaxLayer>
  );
}

export function SparkleLayer() {
  return (
    <ParallaxLayer speed={0.8} className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="relative h-full">
        {/* Animated sparkles */}
        <motion.div
          className="absolute top-32 left-20"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>

        <motion.div
          className="absolute top-64 right-32"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
        >
          <Sparkles className="w-5 h-5 text-yellow-300" />
        </motion.div>

        <motion.div
          className="absolute top-96 left-1/3"
          animate={{
            scale: [0.9, 1.3, 0.9],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
        >
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </motion.div>

        <motion.div
          className="absolute bottom-64 right-1/4"
          animate={{
            scale: [1.1, 1.4, 1.1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.5 }}
        >
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </motion.div>
      </div>
    </ParallaxLayer>
  );
}
