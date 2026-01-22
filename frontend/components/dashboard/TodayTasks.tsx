"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, Target, ListTodo, TrendingUp, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { CountUp } from "@/components/shared/CountUp";
import { AnimatedProgressBar } from "@/components/shared/AnimatedProgressBar";
import { cn } from "@/lib/utils/cn";

export function TodayTasks() {
  const [activeTab, setActiveTab] = useState<"today" | "progress" | "activity">("today");

  const { data: todayTasks, isLoading } = useQuery({
    queryKey: queryKeys.todos.today,
    queryFn: api.todos.getToday,
  });

  const completedTasks = todayTasks?.filter(task => task.completedAt)?.length || 0;
  const totalTasks = todayTasks?.length || 0;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.01 }}
      className="dark-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Today's Tasks</h2>
        {totalTasks > 0 && (
          <div className="flex items-center gap-2 text-green font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            <span>
              <CountUp to={completedTasks} />/<CountUp to={totalTasks} /> Complete
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <TabButton
          label="Today"
          icon={<ListTodo className="w-4 h-4" />}
          isActive={activeTab === "today"}
          onClick={() => setActiveTab("today")}
        />
        <TabButton
          label="Progress"
          icon={<TrendingUp className="w-4 h-4" />}
          isActive={activeTab === "progress"}
          onClick={() => setActiveTab("progress")}
        />
        <TabButton
          label="Activity"
          icon={<Clock className="w-4 h-4" />}
          isActive={activeTab === "activity"}
          onClick={() => setActiveTab("activity")}
        />
      </div>

      {/* Tab Content */}
      <div className="min-h-[150px]">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-background-tertiary rounded-lg animate-pulse" />
            ))}
          </div>
        ) : activeTab === "today" && todayTasks && todayTasks.length > 0 ? (
          <motion.div
            key="today-tasks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {todayTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-background-tertiary border border-gray-200 hover:bg-background-secondary transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!task.completedAt}
                  readOnly
                  className="form-checkbox h-5 w-5 text-purple rounded border-gray-300"
                />
                <div className="flex-1">
                  <p className={cn(
                    "font-medium text-foreground",
                    task.completedAt && "line-through text-foreground-tertiary"
                  )}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-foreground-tertiary mt-0.5">{task.description}</p>
                  )}
                </div>
                {task.completedAt && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : activeTab === "progress" ? (
          <motion.div
            key="progress-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-4"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">Overall Task Progress</h3>
            <AnimatedProgressBar
              percentage={completionPercentage}
              height="md"
              color="gradient-multi-color"
              showShimmer={true}
            />
            <p className="text-sm text-foreground-secondary mt-2">
              You've completed <CountUp to={completedTasks} /> out of{" "}
              <CountUp to={totalTasks} /> tasks today.
            </p>
          </motion.div>
        ) : (
          <div className="py-8 text-center text-foreground-tertiary">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tasks for today</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, icon, isActive, onClick }: TabButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
        isActive
          ? "text-purple bg-background-secondary border-b-2 border-purple"
          : "text-foreground-tertiary hover:text-foreground hover:bg-background-tertiary"
      )}
      onClick={onClick}
      whileHover={{ y: isActive ? 0 : -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple"
        />
      )}
    </motion.button>
  );
}

