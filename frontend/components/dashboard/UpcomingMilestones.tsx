"use client";

import { motion } from "framer-motion";
import { Flame, Star, Palette, ArrowRight } from "lucide-react";
import { CountUp } from "@/components/shared/CountUp";

interface Milestone {
  id: string;
  type: "streak" | "level" | "vision";
  title: string;
  progress: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface UpcomingMilestonesProps {
  streakDaysUntil30?: number;
  xpUntilNextLevel?: number;
  percentUntil50Vision?: number;
}

export function UpcomingMilestones({
  streakDaysUntil30 = 15,
  xpUntilNextLevel = 420,
  percentUntil50Vision = 2,
}: UpcomingMilestonesProps) {
  const milestones: Milestone[] = [
    {
      id: "streak-30",
      type: "streak",
      title: "30 Day Streak",
      progress: `${streakDaysUntil30} more days`,
      icon: Flame,
      color: "orange",
    },
    {
      id: "level-13",
      type: "level",
      title: "Level 13",
      progress: `${xpUntilNextLevel} XP remaining`,
      icon: Star,
      color: "yellow",
    },
    {
      id: "vision-50",
      type: "vision",
      title: "50% Vision Complete",
      progress: `${percentUntil50Vision}% to go`,
      icon: Palette,
      color: "purple",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      orange: {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
      },
      yellow: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
      },
      purple: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      },
    };
    return colors[color] || colors.orange;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Milestones</h3>

      <div className="space-y-3">
        {milestones.map((milestone, index) => {
          const Icon = milestone.icon;
          const colors = getColorClasses(milestone.color);

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 ${colors.bg} ${colors.border} transition-all cursor-pointer`}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                className={`p-2 rounded-lg ${colors.bg}`}
              >
                <Icon className={`w-5 h-5 ${colors.text}`} />
              </motion.div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-0.5">{milestone.title}</h4>
                <p className={`text-xs font-medium ${colors.text}`}>{milestone.progress}</p>
              </div>

              <ArrowRight className={`w-4 h-4 ${colors.text} opacity-50`} />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
