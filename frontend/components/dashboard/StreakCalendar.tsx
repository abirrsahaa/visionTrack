"use client";

import { motion } from "framer-motion";
import { format, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Journal } from "@/lib/types";

interface StreakCalendarProps {
  journals: Journal[];
  className?: string;
}

export function StreakCalendar({ journals, className = "" }: StreakCalendarProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create a map of journal dates for quick lookup
  const journalDates = new Set(
    journals.map((j) => format(new Date(j.journalDate), "yyyy-MM-dd"))
  );

  // Get journal dates from the last 90 days for context
  const last90Days = Array.from({ length: 90 }, (_, i) =>
    format(subDays(today, i), "yyyy-MM-dd")
  ).reverse();

  const getCellColor = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const isJournaled = journalDates.has(dateStr);

    if (isToday(date)) {
      return isJournaled ? "bg-green-500" : "bg-yellow-400 border-2 border-yellow-600";
    }

    if (isJournaled) {
      return "bg-green-500";
    }

    if (!isSameMonth(date, today)) {
      return "bg-gray-100";
    }

    // Check if date is in the past 90 days
    const dateStrFormatted = format(date, "yyyy-MM-dd");
    if (last90Days.includes(dateStrFormatted)) {
      return "bg-gray-200"; // Skipped day in recent history
    }

    return "bg-gray-100"; // Future days or old days not in range
  };

  const getCellIntensity = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const isJournaled = journalDates.has(dateStr);

    if (isToday(date) && !isJournaled) {
      return "opacity-100";
    }

    if (isJournaled) {
      // More recent journals are brighter
      const journal = journals.find(
        (j) => format(new Date(j.journalDate), "yyyy-MM-dd") === dateStr
      );
      if (journal) {
        const daysAgo =
          (today.getTime() - new Date(journal.journalDate).getTime()) /
          (1000 * 60 * 60 * 24);
        if (daysAgo < 7) return "opacity-100";
        if (daysAgo < 30) return "opacity-80";
        return "opacity-60";
      }
      return "opacity-100";
    }

    return "opacity-40";
  };

  // Calculate streak stats
  const currentStreak = journals.length > 0 ? 
    (() => {
      let streak = 0;
      let checkDate = new Date();
      
      for (let i = 0; i < 90; i++) {
        const dateStr = format(checkDate, "yyyy-MM-dd");
        if (journalDates.has(dateStr) || 
            (i === 0 && format(subDays(checkDate, 1), "yyyy-MM-dd") && 
             journalDates.has(format(subDays(checkDate, 1), "yyyy-MM-dd")))) {
          streak++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
      return streak;
    })() : 0;

  const totalJournaledThisMonth = daysInMonth.filter((date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return journalDates.has(dateStr);
  }).length;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900 text-lg">Journal Consistency</h3>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-gray-600">Journaled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-200" />
            <span className="text-gray-600">Skipped</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-blue-600 font-medium mb-1">Current Streak</p>
          <p className="text-2xl font-bold text-blue-900">{currentStreak} days</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-xs text-purple-600 font-medium mb-1">This Month</p>
          <p className="text-2xl font-bold text-purple-900">
            {totalJournaledThisMonth} / {daysInMonth.length}
          </p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div
              key={index}
              className="text-center text-xs font-semibold text-gray-500 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((date, index) => {
            const color = getCellColor(date);
            const intensity = getCellIntensity(date);
            const isJournaled = journalDates.has(format(date, "yyyy-MM-dd"));
            const isCurrentDay = isToday(date);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                className={`w-8 h-8 rounded-md ${color} ${intensity} transition-all cursor-pointer relative group`}
                title={
                  isCurrentDay
                    ? isJournaled
                      ? "Journaled today!"
                      : "Today - not yet journaled"
                    : isJournaled
                    ? `Journaled on ${format(date, "MMM d")}`
                    : format(date, "MMM d, yyyy")
                }
              >
                {isCurrentDay && (
                  <motion.div
                    className="absolute inset-0 rounded-md border-2 border-blue-600"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {format(date, "MMM d, yyyy")}
                    {isJournaled && " ✓"}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Motivation Message */}
      {currentStreak >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200"
        >
          <p className="text-sm font-semibold text-orange-900 text-center">
            🔥 Amazing! {currentStreak}-day streak! Keep it up!
          </p>
        </motion.div>
      )}
    </div>
  );
}
