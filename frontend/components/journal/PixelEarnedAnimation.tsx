"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Sparkles, Trophy, TrendingUp } from "lucide-react";
import { useWindowSize } from "@/lib/hooks/useWindowSize";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { CountUp } from "@/components/shared/CountUp";
import type { PixelsEarned } from "@/lib/types";

interface PixelEarnedAnimationProps {
  pixels: PixelsEarned;
  onComplete: () => void;
}

export function PixelEarnedAnimation({ pixels, onComplete }: PixelEarnedAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [count, setCount] = useState(0);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Animate counting up
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = pixels.total / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= pixels.total) {
        setCount(pixels.total);
        clearInterval(interval);
        // Hide confetti after animation
        setTimeout(() => setShowConfetti(false), 2000);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [pixels.total]);

  return (
    <>
      {showConfetti && width && height && (
        <Confetti width={width} height={height} recycle={false} />
      )}
      <Modal open={true} onClose={onComplete} showCloseButton={false} size="md">
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="mb-6"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pixels Earned!</h2>
            <p className="text-lg text-gray-600">Your effort is turning into art</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6"
          >
            <div className="text-5xl font-bold text-blue-600 mb-4">
              {count.toLocaleString()} pixels
            </div>
            <div className="text-sm text-gray-500">
              out of {pixels.total.toLocaleString()} total
            </div>
          </motion.div>

          {/* Bonus Message with Enhanced Animation */}
          {pixels.bonus && pixels.bonus.multiplier > 1.0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-6 p-5 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-2xl text-white shadow-2xl relative overflow-hidden"
            >
              {/* Animated Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear",
                }}
                style={{
                  backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)",
                  backgroundSize: "30px 30px",
                }}
              />
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                  <span className="font-bold text-2xl">BONUS EARNED!</span>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-base font-semibold mb-2"
                >
                  {pixels.bonus.reason} - {pixels.bonus.multiplier}x multiplier
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm opacity-90"
                >
                  You earned{" "}
                  <span className="font-bold text-lg">
                    <CountUp from={0} to={pixels.total} />
                  </span>{" "}
                  pixels instead of {Math.round(pixels.total / pixels.bonus.multiplier)}!
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Domain Breakdown */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-gray-700">By Domain:</p>
            {pixels.byDomain.map((domain) => {
              const domainColor = domain.colorHex || "#3B82F6";
              return (
                <motion.div
                  key={domain.domainId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: domainColor }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                    <span className="font-medium text-gray-900">{domain.domainName}</span>
                  </div>
                  <motion.span
                    className="font-semibold"
                    style={{ color: domainColor }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    +{domain.pixels} pixels
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

          <Button onClick={onComplete} className="w-full" size="lg">
            View Your Board
          </Button>
        </div>
      </Modal>
    </>
  );
}