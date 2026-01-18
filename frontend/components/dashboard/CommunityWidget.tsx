"use client";

import { motion } from "framer-motion";
import { Trophy, Users, Flame, ArrowRight } from "lucide-react";

interface CommunityWidgetProps {
  weeklyRank?: number;
  activeMembers?: number;
  averageStreak?: number;
}

export function CommunityWidget({
  weeklyRank = 3,
  activeMembers = 234,
  averageStreak = 8,
}: CommunityWidgetProps) {
  const stats = [
    {
      icon: Trophy,
      label: `You're #${weeklyRank} this week`,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Users,
      label: `${activeMembers.toLocaleString()} active members`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Flame,
      label: `Avg streak: ${averageStreak} days`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
    >
      <h3 className="text-sm font-bold text-gray-900 mb-4">Community</h3>

      <div className="space-y-3 mb-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-2 rounded-lg ${stat.bgColor} transition-all hover:scale-105`}
          >
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="text-xs font-medium text-gray-700">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        View Leaderboard
        <ArrowRight className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
}
