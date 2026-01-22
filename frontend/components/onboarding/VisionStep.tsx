"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { SystemButton } from "@/components/shared/SystemButton";

interface VisionStepProps {
  visionText: string;
  onVisionChange: (text: string) => void;
  extractedDomains?: string[];
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

export function VisionStep({
  visionText,
  onVisionChange,
  onAnalyze,
  isAnalyzing = false,
}: VisionStepProps) {
  const wordCount = visionText.trim().split(/\s+/).filter(Boolean).length;

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("onboarding-vision-draft");
    if (saved && !visionText) {
      onVisionChange(saved);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visionText) {
        localStorage.setItem("onboarding-vision-draft", visionText);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [visionText]);

  return (
    <div className="max-w-4xl mx-auto min-h-[60vh] flex flex-col justify-center relative">
      {/* Background Particles (Decorative) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-10"
      >
        <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-neon-purple bg-purple-500/10 border border-purple-500/20 rounded-full animate-pulse-slow">
          PHASE 1: INCEPTION
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight glow-text-purple">
          Envision Your Future
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Describe your ideal life 1 year from now. Be specific about how it feels, what you see, and what you've achieved.
          <span className="text-neon-cyan"> The system will architect the rest.</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative group"
      >
        {/* Breathing Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-2xl opacity-20 group-hover:opacity-30 blur-lg transition duration-500 group-focus-within:opacity-50 group-focus-within:animate-pulse-slow" />

        <div className="relative">
          <motion.textarea
            value={visionText}
            onChange={(e) => onVisionChange(e.target.value)}
            placeholder="I wake up in my sun-lit apartment overlooking the city. I've successfully launched my sustainable fashion brand..."
            rows={10}
            className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8 font-sans text-xl text-white placeholder-gray-600 resize-none focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all shadow-2xl"
            whileFocus={{ scale: 1.01, boxShadow: "0 0 30px rgba(139, 92, 246, 0.1)" }}
          />
          <div className="absolute bottom-6 right-6 font-mono text-xs text-gray-400 bg-black/60 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {wordCount} WORDS
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between mt-6 px-2"
      >
        <span className="text-xs text-gray-500 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Auto-saving active
        </span>

        <SystemButton
          onClick={onAnalyze}
          disabled={!visionText.trim() || isAnalyzing}
          isLoading={isAnalyzing}
          variant="gradient-purple"
          size="lg"
          className="px-8 shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Analyze & Continue
        </SystemButton>
      </motion.div>
    </div>
  );
}
