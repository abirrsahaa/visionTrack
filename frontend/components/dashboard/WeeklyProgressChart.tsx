"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface WeeklyProgressChartProps {
  journals?: Array<{ journalDate: string }>;
  className?: string;
}

export function WeeklyProgressChart({
  journals = [],
  className,
}: WeeklyProgressChartProps) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Calculate which days have journals (simplified - check last 7 days)
  const today = new Date();
  const getDayJournalCount = (dayIndex: number) => {
    const targetDate = new Date(today);
    const daysSinceMonday = (today.getDay() + 6) % 7; // Monday = 0
    const daysBack = daysSinceMonday - dayIndex;
    targetDate.setDate(today.getDate() - daysBack);
    
    const dateStr = targetDate.toISOString().split("T")[0];
    return journals.filter((j) => j.journalDate === dateStr).length > 0;
  };

  // Activity levels (simulated - could be based on actual activity)
  const activityLevels = daysOfWeek.map((_, index) => {
    const hasJournal = getDayJournalCount(index);
    return hasJournal ? Math.random() * 60 + 40 : Math.random() * 30;
  });

  const completedDays = daysOfWeek.filter((_, index) => getDayJournalCount(index)).length;
  const completionPercentage = (completedDays / 7) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("dark-card p-6", className)}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">
          Weekly Progress
        </h3>
        <span className="text-xs text-foreground-tertiary">
          {completedDays}/7 days
        </span>
      </div>

      {/* Days of Week with Checkmarks */}
      <div className="flex items-center justify-between mb-6">
        {daysOfWeek.map((day, index) => {
          const isCompleted = getDayJournalCount(index);
          const isToday = index === ((today.getDay() + 6) % 7);
          
          return (
            <motion.div
              key={day}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-all",
                  isCompleted
                    ? "bg-green/20 border-2 border-green"
                    : "bg-background-tertiary border-2 border-gray-400",
                  isToday && "ring-2 ring-purple ring-offset-2 ring-offset-background"
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green" />
                  </motion.div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isToday
                    ? "text-purple"
                    : isCompleted
                    ? "text-foreground-secondary"
                    : "text-foreground-tertiary"
                )}
              >
                {day}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Bar Chart */}
      <div className="space-y-2">
        <div className="flex items-end justify-between gap-1 h-16">
          {activityLevels.map((level, index) => (
            <motion.div
              key={index}
              className="flex-1 gradient-purple rounded-t-lg relative overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: `${level}%` }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-purple-dark to-transparent opacity-50"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, delay: index * 0.1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completion Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-foreground-tertiary">This Week</span>
          <span className="text-sm font-semibold text-foreground-secondary">
            {Math.round(completionPercentage)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
