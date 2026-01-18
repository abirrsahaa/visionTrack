"use client";

import { motion } from "framer-motion";
import { Zap, Lock } from "lucide-react";
import { TaskItem } from "@/components/shared/TaskItem";
import { SystemButton } from "@/components/shared/SystemButton";
import type { Todo, Domain } from "@/lib/types";

interface MorningValidationPanelProps {
  tasks: Todo[];
  domains: Domain[];
  completedTasks?: Set<string>;
  onTaskToggle?: (taskId: string) => void;
  onLockDay?: () => void;
  isLocking?: boolean;
}

export function MorningValidationPanel({
  tasks,
  domains,
  completedTasks = new Set(),
  onTaskToggle,
  onLockDay,
  isLocking = false,
}: MorningValidationPanelProps) {
  const getDomainName = (domainId: string) => {
    return domains.find((d) => d.id === domainId)?.name || "GENERAL";
  };

  const allTasksCompleted = tasks.length > 0 && tasks.every((t) => completedTasks.has(t.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-arch-dark-text-primary" />
        <h3 className="font-mono text-xs font-semibold text-arch-dark-text-primary uppercase tracking-wider">
          MORNING VALIDATION
        </h3>
      </div>

      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              domain={getDomainName(task.domainId)}
              effort={task.effortWeight ? `${task.effortWeight}H DEEP WORK` : undefined}
              completed={completedTasks.has(task.id)}
              onToggle={onTaskToggle}
            />
          ))
        ) : (
          <p className="font-mono text-xs text-arch-dark-text-tertiary py-4 text-center">
            NO TASKS FOR TODAY
          </p>
        )}
      </div>

      {tasks.length > 0 && (
        <SystemButton
          variant="primary"
          onClick={onLockDay}
          disabled={!allTasksCompleted || isLocking}
          isLoading={isLocking}
          className="w-full flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          LOCK DAY STRUCTURE
        </SystemButton>
      )}
    </div>
  );
}
