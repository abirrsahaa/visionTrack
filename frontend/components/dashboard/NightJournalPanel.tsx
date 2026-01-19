"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smile, Paperclip, Send, Loader2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils/cn";

interface NightJournalPanelProps {
  initialText?: string;
  onSubmit?: (text: string) => void;
  isLoading?: boolean;
}

export function NightJournalPanel({
  initialText = "",
  onSubmit,
  isLoading = false,
}: NightJournalPanelProps) {
  const [journalText, setJournalText] = useState(initialText);
  const [isFocused, setIsFocused] = useState(false);
  const today = format(new Date(), "yyyy_MM_dd");

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`journal-draft-${today}`);
    if (saved && !initialText) {
      setJournalText(saved);
    }
  }, [today, initialText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (journalText) {
        localStorage.setItem(`journal-draft-${today}`, journalText);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [journalText, today]);

  const handleSubmit = () => {
    if (journalText.trim() && onSubmit) {
      onSubmit(journalText);
      localStorage.removeItem(`journal-draft-${today}`);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple animate-pulse" />
          <h3 className="text-xs font-bold text-foreground-secondary uppercase tracking-widest leading-none">
            Mission Log
          </h3>
        </div>
        <span className="text-[10px] font-mono text-purple-400 border border-purple/20 bg-purple/10 px-2 py-0.5 rounded">
          ENTRY_{today}
        </span>
      </div>

      {/* Editor Container */}
      <div className={cn(
        "relative flex-1 rounded-xl overflow-hidden transition-all duration-300 group",
        "bg-[#080808] border",
        isFocused ? "border-purple/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]" : "border-white/10"
      )}>
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Left Gutter */}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-white/5 border-r border-white/5 flex flex-col items-center py-4 gap-2 z-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <span key={i} className="text-[10px] font-mono text-gray-700">{i}</span>
          ))}
        </div>

        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="// Describe the friction and the flow..."
          className="w-full h-full bg-transparent p-4 pl-12 font-mono text-sm text-gray-300 placeholder-gray-700 resize-none focus:outline-none leading-relaxed custom-scrollbar relative z-20"
        />

        {/* Blinking Cursor Decoration (only visible when not focused or empty to encourage typing) */}
        {!isFocused && !journalText && (
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute top-4 left-12 w-2 h-5 bg-purple pointer-events-none z-10"
          />
        )}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
            <Smile className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={!journalText.trim() || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all",
            !journalText.trim() || isLoading
              ? "bg-white/5 text-gray-600 cursor-not-allowed"
              : "bg-purple hover:bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Upload to Core</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
