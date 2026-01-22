"use client";

import { motion } from "framer-motion";
import { Eye, Terminal, Activity, Zap, Cpu } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface HeroProgressCardProps {
  progress?: number;
}

export function HeroProgressCard({
  level = 1,
  totalJournals = 0,
  totalHours = 0,
  isPro = true,
  className,
  progress = 0,
}: HeroProgressCardProps) {

  // Calculate level progress
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-[#080808] border border-white/10 p-5 group",
        "shadow-[0_0_20px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {/* Background Tech Mesh */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Scanning Line Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-purple/5 to-transparent h-[20%] pointer-events-none z-10"
        animate={{ top: ["-20%", "120%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Header: ID & Status */}
      <div className="relative z-20 flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange/10 border border-orange/20 flex items-center justify-center relative overflow-hidden">
            <Cpu className="w-5 h-5 text-orange-400" />
            <div className="absolute inset-0 bg-orange/20 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none mb-1">Architect</h3>
            <p className="text-[10px] font-mono text-orange-400">ID: USER_01 // LEVEL {level}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[10px] font-mono text-green-400 animate-pulse">
            ONLINE
          </div>
        </div>
      </div>

      {/* Main Stats with Visual Ring */}
      <div className="relative z-20 flex items-center justify-between">

        {/* Circular Progress (Level/Sync) */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* SVG Ring */}
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-white/5"
            />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
              className="text-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white font-mono">{progress}%</span>
            <span className="text-[8px] text-gray-500 uppercase tracking-wider">SYNC</span>
          </div>
        </div>

        {/* Stats Column */}
        <div className="flex-1 pl-6 space-y-3">
          <div className="flex items-center justify-between group/stat">
            <div className="flex items-center gap-2 text-gray-400">
              <Terminal className="w-3 h-3 group-hover/stat:text-purple transition-colors" />
              <span className="text-xs font-mono uppercase">Sessions</span>
            </div>
            <span className="text-white font-mono text-sm">{totalJournals}</span>
          </div>
          <div className="w-full h-[1px] bg-white/5" />
          <div className="flex items-center justify-between group/stat">
            <div className="flex items-center gap-2 text-gray-400">
              <Activity className="w-3 h-3 group-hover/stat:text-green-400 transition-colors" />
              <span className="text-xs font-mono uppercase">Hours</span>
            </div>
            <span className="text-white font-mono text-sm">{totalHours}h</span>
          </div>
          <div className="w-full h-[1px] bg-white/5" />
          <div className="flex items-center justify-between group/stat">
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-3 h-3 group-hover/stat:text-yellow-400 transition-colors" />
              <span className="text-xs font-mono uppercase">Focus</span>
            </div>
            <span className="text-white font-mono text-sm">HIGH</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
