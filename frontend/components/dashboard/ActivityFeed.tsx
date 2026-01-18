"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Target, Award, TrendingUp, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  type: "journal" | "task" | "milestone" | "streak" | "pixel_earn";
  timestamp: string;
  title: string;
  description?: string;
  pixels?: number;
  icon?: React.ReactNode;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 5 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "journal":
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case "task":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "milestone":
        return <Target className="w-4 h-4 text-purple-500" />;
      case "streak":
        return <Award className="w-4 h-4 text-orange-500" />;
      case "pixel_earn":
        return <TrendingUp className="w-4 h-4 text-pink-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Recent Activity
        </h3>
        {activities.length > maxItems && (
          <span className="text-xs text-gray-500">
            +{activities.length - maxItems} more
          </span>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            >
              {/* Icon */}
              <motion.div
                className="mt-0.5 flex-shrink-0"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: index * 0.2,
                }}
              >
                {activity.icon || getIcon(activity.type)}
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {activity.title}
                </p>
                {activity.description && (
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {activity.description}
                  </p>
                )}
                {activity.pixels && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-bold text-blue-600 mt-1"
                  >
                    +{activity.pixels.toLocaleString()} pixels
                  </motion.p>
                )}
              </div>

              {/* Timestamp */}
              <div className="flex-shrink-0 text-xs text-gray-500">
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs mt-1">Start journaling to see updates here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
