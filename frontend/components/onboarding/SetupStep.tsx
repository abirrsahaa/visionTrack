import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Bell, Sparkles, Calendar, Power, CheckCircle, Activity } from "lucide-react";
import { SystemButton } from "@/components/shared/SystemButton";
import Confetti from "react-confetti";
import { cn } from "@/lib/utils";

interface SetupStepProps {
  bedtimeReminder: string;
  morningReminder: string;
  onRemindersChange: (bedtime: string, morning: string) => void;
  onComplete: () => void;
  domainImages: Record<string, string[]>;
}

export function SetupStep({
  bedtimeReminder,
  morningReminder,
  onRemindersChange,
  onComplete,
  domainImages
}: SetupStepProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [activeImages, setActiveImages] = useState<string[]>([]);

  // Flatten images for the collage
  useEffect(() => {
    const allImages = Object.values(domainImages).flat();
    // Shuffle and pick up to 12 for the preview
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    setActiveImages(shuffled.slice(0, 12));
  }, [domainImages]);

  const handleComplete = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setShowConfetti(true);
    }, 1200);

    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 min-h-[60vh] flex flex-col justify-center">
      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
          recycle={false}
          numberOfPieces={400}
          colors={['#06b6d4', '#8b5cf6', '#3b82f6']}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-cyan mb-4"
        >
          <Activity className="w-3 h-3 animate-pulse" />
          SYSTEM CHECK: ALL SYSTEMS GO
        </motion.div>

        <h2 className="text-4xl font-bold text-white mb-2 glow-text-cyan">
          Initialization Protocol
        </h2>
        <p className="text-gray-400 font-light">
          Finalize operational parameters before system launch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* LEFT COL: CONFIGURATION */}
        <div className="space-y-6">
          {/* Pixel Budget */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-purple" />
              Focus Distribution
            </h3>

            <div className="space-y-5">
              {[
                { domain: "Career", pixels: 100, color: "#3b82f6" },
                { domain: "Health", pixels: 80, color: "#10b981" },
                { domain: "Learning", pixels: 70, color: "#f59e0b" },
                { domain: "Relationships", pixels: 50, color: "#ec4899" },
              ].map((item, index) => (
                <div key={item.domain}>
                  <div className="flex justify-between mb-1.5 text-xs font-mono">
                    <span className="text-gray-400">{item.domain.toUpperCase()}</span>
                    <span className="text-gray-500">{item.pixels} PX</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.pixels / 100) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">TOTAL SYSTEM LOAD</span>
                <span className="text-xs text-neon-cyan font-bold font-mono">100% OPTIMAL</span>
              </div>
            </div>
          </motion.div>

          {/* Reminders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Bell className="w-4 h-4 text-neon-cyan" />
              Sync Schedule
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 border border-white/5 p-4 rounded-xl">
                <label className="block text-[10px] font-mono text-gray-500 mb-2 uppercase">
                  Evening Sync
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <input
                    type="time"
                    value={bedtimeReminder}
                    onChange={(e) => onRemindersChange(e.target.value, morningReminder)}
                    className="bg-transparent text-white font-mono text-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-black/20 border border-white/5 p-4 rounded-xl">
                <label className="block text-[10px] font-mono text-gray-500 mb-2 uppercase">
                  Morning Brief
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <input
                    type="time"
                    value={morningReminder}
                    onChange={(e) => onRemindersChange(bedtimeReminder, e.target.value)}
                    className="bg-transparent text-white font-mono text-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COL: BOARD SIMULATION */}
        <div className="h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-1 rounded-2xl h-full relative overflow-hidden group min-h-[500px]"
          >
            {/* THE ACTUAL BOARD VISUALIZATION */}
            <motion.div
              className="w-full h-full bg-black rounded-xl overflow-hidden relative"
              animate={{
                filter: isLaunching ? "grayscale(0%)" : "grayscale(100%)"
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              {/* Grid of Images */}
              <div className="columns-2 md:columns-3 gap-2 p-2">
                {activeImages.map((src, i) => (
                  <div key={i} className="mb-2 break-inside-avoid">
                    <img src={src} className="w-full rounded-lg object-cover opacity-80" alt="Vision" />
                  </div>
                ))}
              </div>

              {/* Overlay Text */}
              <motion.div
                animate={{ opacity: isLaunching ? 0 : 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] z-10"
              >
                <div className="text-4xl mb-4 opacity-50">🎨</div>
                <p className="text-white font-bold text-lg tracking-widest uppercase">Grayscale Mode</p>
                <p className="text-gray-400 text-xs font-mono mt-2">Action required to colorize</p>
              </motion.div>

              {/* Launch Overlay Effect */}
              <AnimatePresence>
                {isLaunching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-neon-cyan/20 mix-blend-overlay z-20 pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Border Glow */}
            <div className={cn(
              "absolute inset-0 rounded-2xl border-2 pointer-events-none transition-all duration-1000",
              isLaunching ? "border-neon-cyan shadow-[0_0_30px_rgba(6,182,212,0.3)]" : "border-white/5"
            )} />

          </motion.div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <SystemButton
          onClick={handleComplete}
          size="lg"
          variant="gradient-purple"
          className={cn(
            "px-16 py-6 text-lg font-bold tracking-widest transition-all duration-500",
            isLaunching && "scale-110 shadow-[0_0_50px_rgba(139,92,246,0.6)]"
          )}
          disabled={isLaunching}
        >
          {isLaunching ? (
            <span className="flex items-center gap-3">
              <Activity className="w-5 h-5 animate-spin" />
              INITIALIZING...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <Power className="w-5 h-5" />
              LAUNCH SYSTEM
            </span>
          )}
        </SystemButton>
      </div>
    </div>
  );
}
