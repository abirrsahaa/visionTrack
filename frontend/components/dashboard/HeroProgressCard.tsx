"use client";

import { motion } from "framer-motion";
import { Eye, FileText, Clock, Award } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface HeroProgressCardProps {
  level?: number;
  totalJournals?: number;
  totalHours?: number;
  isPro?: boolean;
  className?: string;
}

export function HeroProgressCard({
  level = 12,
  totalJournals = 42,
  totalHours = 170,
  isPro = true,
  className,
}: HeroProgressCardProps) {
  const stats = [
    {
      icon: Eye,
      label: "level",
      value: level.toString(),
      color: "text-white",
    },
    {
      icon: FileText,
      label: "journals",
      value: totalJournals.toString(),
      color: "text-white",
    },
    {
      icon: Clock,
      label: "hours",
      value: totalHours.toString(),
      color: "text-white",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 gradient-orange-pink shadow-xl",
        className
      )}
    >
      {/* PRO Badge */}
      {isPro && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="absolute top-4 right-4"
        >
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400 rounded-full shadow-lg">
            <Award className="w-3.5 h-3.5 text-yellow-900" />
            <span className="text-xs font-bold text-yellow-900 uppercase">
              PRO
            </span>
          </div>
        </motion.div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange/80 via-pink-500/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Your Progress
          </h3>
          <p className="text-sm text-white/80">
            Keep up the great work!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 uppercase tracking-wide mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
    </motion.div>
  );
}
