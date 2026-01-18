"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Trophy, Target, Sparkles, Award } from "lucide-react";
import { useWindowSize } from "@/lib/hooks/useWindowSize";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { CountUp } from "@/components/shared/CountUp";

interface MilestoneCelebrationProps {
  milestone: number; // e.g., 50, 75, 100
  currentPixels: number;
  totalPixels: number;
  onClose: () => void;
}

export function MilestoneCelebration({
  milestone,
  currentPixels,
  totalPixels,
  onClose,
}: MilestoneCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const getMilestoneMessage = () => {
    switch (milestone) {
      case 50:
        return {
          title: "Halfway There! 🎯",
          message: "You've reached 50% of your vision board! Keep pushing forward!",
          icon: Target,
        };
      case 75:
        return {
          title: "Almost Complete! 🌟",
          message: "75% done! You're in the final stretch!",
          icon: Trophy,
        };
      case 100:
        return {
          title: "Vision Complete! 🎉",
          message: "100% complete! You've achieved your vision!",
          icon: Award,
        };
      default:
        return {
          title: "Milestone Reached! 🎊",
          message: `You've reached ${milestone}% of your vision board!`,
          icon: Sparkles,
        };
    }
  };

  const { title, message, icon: Icon } = getMilestoneMessage();

  return (
    <>
      {showConfetti && width && height && (
        <Confetti
          width={width}
          height={height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      <Modal open={true} onClose={onClose} showCloseButton={false} size="lg">
        <div className="text-center py-8 relative overflow-hidden">
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "linear",
            }}
            style={{
              backgroundImage: "radial-gradient(circle, #3B82F6 2px, transparent 2px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                <Icon className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 mb-3"
            >
              {title}
            </motion.h2>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 mb-6"
            >
              {message}
            </motion.p>

            {/* Progress Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200"
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                <CountUp from={0} to={milestone} />%
              </div>
              <p className="text-sm text-gray-600">
                <CountUp from={0} to={currentPixels} /> / {totalPixels.toLocaleString()} pixels
              </p>
            </motion.div>

            {/* Close Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button onClick={onClose} className="w-full" size="lg">
                Continue Your Journey
              </Button>
            </motion.div>
          </div>
        </div>
      </Modal>
    </>
  );
}
