"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smile, Paperclip, Send } from "lucide-react";
import { format } from "date-fns";
import { SystemButton } from "@/components/shared/SystemButton";

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
          NIGHT JOURNAL // REFLECTIONS
        </h3>
        <span className="text-[10px] text-foreground-tertiary">
          ENTRY_{today}
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <motion.textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="Describe the friction and the flow of today..."
          rows={8}
          className="w-full bg-background-tertiary border border-gray-200 rounded-lg p-4 font-sans text-sm text-foreground placeholder-foreground-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple transition-all shadow-sm"
          whileFocus={{ scale: 1.005 }}
        />
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            className="p-2 text-foreground-tertiary hover:text-foreground transition-colors rounded-lg hover:bg-background-secondary"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Smile className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="p-2 text-foreground-tertiary hover:text-foreground transition-colors rounded-lg hover:bg-background-secondary"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Paperclip className="w-4 h-4" />
          </motion.button>
        </div>

        <SystemButton
          variant="gradient-purple"
          onClick={handleSubmit}
          disabled={!journalText.trim() || isLoading}
          isLoading={isLoading}
          className="flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          COMMIT REFLECTION & AWARD PIXELS
        </SystemButton>
      </div>
    </div>
  );
}
