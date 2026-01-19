"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Trophy, Target, Sparkles, Award, Zap, Hexagon } from "lucide-react";
import { useWindowSize } from "@/lib/hooks/useWindowSize";
import { SystemButton } from "@/components/shared/SystemButton";
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
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const getMilestoneMessage = () => {
    switch (milestone) {
      case 50:
        return {
          title: "HALFWAY MARK",
          subtitle: "SYSTEM SYNC: 50%",
          message: "Reality construction is at 50% capacity. Keep pushing.",
          icon: Target,
          color: "text-blue-400",
          glow: "shadow-blue-500/50",
          border: "border-blue-500/30",
        };
      case 75:
        return {
          title: "FINAL STRETCH",
          subtitle: "SYSTEM SYNC: 75%",
          message: "Vision manifestation imminent. High coherence detected.",
          icon: Zap,
          color: "text-purple-400",
          glow: "shadow-purple-500/50",
          border: "border-purple-500/30",
        };
      case 100:
        return {
          title: "VISION REALIZED",
          subtitle: "SYSTEM SYNC: 100%",
          message: "Full synchronization achieved. The future is now present.",
          icon: Award,
          color: "text-orange-400",
          glow: "shadow-orange-500/50",
          border: "border-orange-500/30",
        };
      default:
        return {
          title: "MILESTONE REACHED",
          subtitle: `SYSTEM SYNC: ${milestone}%`,
          message: "Significant progress logged in the core matrix.",
          icon: Sparkles,
          color: "text-white",
          glow: "shadow-white/50",
          border: "border-white/30",
        };
    }
  };

  const { title, subtitle, message, icon: Icon, color, glow, border } = getMilestoneMessage();

  return (
    <>
      {showConfetti && width && height && (
        <Confetti
          width={width}
          height={height}
          recycle={true}
          numberOfPieces={500}
          gravity={0.15}
          colors={['#A855F7', '#EC4899', '#3B82F6', '#FFFFFF', '#F59E0B']}
        />
      )}

      {/* Custom Overlay to ensure centering and darkness independent of shared Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: 20, y: 100 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0, y: -50 }}
          exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg z-[10000]"
        >
          {/* Main Card Container */}
          <div className="relative overflow-hidden bg-[#030303] border border-white/10 rounded-3xl w-full p-1 shadow-2xl shadow-purple-900/40">

            {/* Outer Glow Animation */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-${color.split('-')[1] || 'purple'}-500/30 to-transparent`}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative bg-[#080808] rounded-[20px] p-10 flex flex-col items-center text-center z-10 overflow-hidden">

              {/* Spotlight Effect */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-${color.split('-')[1] || 'purple'}-500/20 blur-[100px] pointer-events-none`} />

              {/* Background Grid */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

              {/* Hexagon Icon Container */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                className={`mb-8 relative w-32 h-32 flex items-center justify-center`}
              >
                <Hexagon className={`w-full h-full absolute ${color} opacity-20 animate-spin-slow`} strokeWidth={1} />
                <Hexagon className={`w-24 h-24 absolute ${color} opacity-40`} strokeWidth={2} />

                {/* Glowing Core */}
                <div className={`relative z-10 p-6 rounded-full bg-gradient-to-br from-gray-900 to-black border ${border} ${glow} shadow-[0_0_50px_rgba(168,85,247,0.4)]`}>
                  <Icon className={`w-12 h-12 ${color} drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />
                </div>
              </motion.div>

              {/* Text Content */}
              <div className="space-y-4 mb-10 relative z-20 w-full">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-white uppercase tracking-[0.2em] font-mono drop-shadow-lg"
                >
                  {title}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center"
                >
                  <span className={`px-4 py-1.5 rounded-full border ${border} bg-${color.split('-')[1] || 'purple'}-500/10 text-sm font-mono font-bold ${color} tracking-wider shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                    {subtitle}
                  </span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-base max-w-sm mx-auto leading-relaxed border-t border-b border-white/5 py-4"
                >
                  {message}
                </motion.p>
              </div>

              {/* Progress Bar (Holographic Style) */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="w-full h-14 bg-black/60 border border-white/10 rounded-xl relative overflow-hidden mb-8 group shadow-inner"
              >
                <div className="absolute inset-0 flex items-center justify-between px-5 z-20">
                  <span className="text-[10px] font-mono text-gray-500 font-bold tracking-widest">INIT_SEQUENCE</span>
                  <span className="text-[10px] font-mono text-gray-500 font-bold tracking-widest">TARGET_LOCK</span>
                </div>

                {/* Progress Fill */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone}%` }}
                  transition={{ delay: 0.8, duration: 1.5, ease: "circOut" }}
                  className={`absolute top-0 bottom-0 left-0 bg-gradient-to-r from-${color.split('-')[1] || 'purple'}-900/50 to-${color.split('-')[1] || 'purple'}-500/50 border-r-2 border-${color.split('-')[1] || 'purple'}-400 relative`}
                >
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mixed-blend-overlay"></div>
                </motion.div>

                {/* Centered Pixel Count */}
                <div className="absolute inset-0 flex items-center justify-center z-30 mix-blend-plus-lighter">
                  <span className="text-sm font-mono text-white font-bold drop-shadow-md">
                    <CountUp from={0} to={currentPixels} /> / {totalPixels.toLocaleString()} PIXELS
                  </span>
                </div>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full relative z-20"
              >
                <SystemButton
                  onClick={onClose}
                  className="w-full justify-center py-4 text-lg font-bold tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                  variant="gradient-purple"
                >
                  CONTINUE MISSION
                </SystemButton>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
