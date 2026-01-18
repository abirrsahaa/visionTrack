"use client";

import { motion } from "framer-motion";
import { Check, Square } from "lucide-react";

interface TaskItemProps {
  id: string;
  title: string;
  domain: string;
  effort?: string;
  completed?: boolean;
  onToggle?: (id: string) => void;
}

export function TaskItem({
  id,
  title,
  domain,
  effort,
  completed = false,
  onToggle,
}: TaskItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-3 rounded hover:bg-arch-dark-bg-tertiary transition-colors"
    >
      <motion.button
        onClick={() => onToggle?.(id)}
        className="flex-shrink-0 mt-0.5"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {completed ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-5 h-5 rounded border-2 flex items-center justify-center"
            style={{ 
              borderColor: "#10B981",
              backgroundColor: "#10B981",
            }}
          >
            <Check className="w-3 h-3 text-white" />
          </motion.div>
        ) : (
          <Square className="w-5 h-5 text-arch-dark-text-tertiary hover:text-arch-dark-text-secondary transition-colors" />
        )}
      </motion.button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium mb-1 ${
            completed
              ? "text-arch-dark-text-tertiary line-through"
              : "text-arch-dark-text-primary"
          }`}
        >
          {title}
        </p>
        <p className="font-mono text-xs text-arch-dark-text-secondary">
          {domain.toUpperCase()} {effort && `• ${effort}`}
        </p>
      </div>
    </motion.div>
  );
}
