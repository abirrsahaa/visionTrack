"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { SystemPanel } from "@/components/shared/SystemPanel";
import { MorningValidationPanel } from "@/components/dashboard/MorningValidationPanel";
import { AINarrativePanel } from "@/components/dashboard/AINarrativePanel";
import type { Todo, ValidateTasksRequest, Domain } from "@/lib/types";

export default function TaskValidationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [approvedTasks, setApprovedTasks] = useState<Set<string>>(new Set());
  const [skippedTasks, setSkippedTasks] = useState<Set<string>>(new Set());

  const { data: tomorrowData, isLoading: tasksLoading } = useQuery({
    queryKey: queryKeys.todos.tomorrow,
    queryFn: api.todos.getTomorrow,
  });

  const { data: domains, isLoading: domainsLoading } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  const { mutate: validateTasks, isPending: isLockingDay } = useMutation({
    mutationFn: (data: ValidateTasksRequest) => api.todos.validate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.today });
      queryClient.invalidateQueries({ queryKey: queryKeys.todos.tomorrow });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      console.error("Failed to validate tasks:", error);
    },
  });

  const handleTaskToggle = (taskId: string) => {
    // Toggle between approved and skipped
    if (approvedTasks.has(taskId)) {
      setApprovedTasks((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
      setSkippedTasks((prev) => new Set(prev).add(taskId));
    } else if (skippedTasks.has(taskId)) {
      setSkippedTasks((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
      setApprovedTasks((prev) => new Set(prev).add(taskId));
    } else {
      setApprovedTasks((prev) => new Set(prev).add(taskId));
    }
  };

  const handleLockDay = () => {
    const allTaskIds = tomorrowData?.suggestedTasks.map((t) => t.id) || [];
    const finalApproved = Array.from(approvedTasks);
    const finalSkipped = Array.from(skippedTasks);
    
    // Ensure all tasks are either approved or skipped
    const unhandled = allTaskIds.filter(
      (id) => !finalApproved.includes(id) && !finalSkipped.includes(id)
    );

    if (unhandled.length > 0) {
      // Auto-approve unhandled tasks
      unhandled.forEach((id) => finalApproved.push(id));
    }

    validateTasks({
      approvedTasks: finalApproved,
      skippedTasks: finalSkipped,
      modifiedTasks: [],
    });
  };

  const tasks = tomorrowData?.suggestedTasks || [];

  // Generate AI recommendations
  const aiRecommendations = tomorrowData?.context
    ? [
        `Completion rate: ${Math.round(tomorrowData.context.yesterdayCompletionRate * 100)}%`,
        `Energy level: ${tomorrowData.context.energyLevel}/5`,
      ]
    : [];

  return (
    <div className="min-h-screen bg-arch-dark-bg-primary max-w-5xl mx-auto space-y-6 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-mono text-2xl font-bold text-arch-dark-text-primary mb-2 uppercase tracking-wider">
          Morning Validation
        </h1>
        <p className="font-mono text-xs text-arch-dark-text-tertiary">
          Review and approve your AI-suggested tasks for today
        </p>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Tasks */}
        <div className="lg:col-span-2">
          <SystemPanel>
            <MorningValidationPanel
              tasks={tasks}
              domains={domains || []}
              completedTasks={approvedTasks}
              onTaskToggle={handleTaskToggle}
              onLockDay={handleLockDay}
              isLocking={isLockingDay}
            />
          </SystemPanel>

          {/* AI Context */}
          {tomorrowData?.context && (
            <SystemPanel className="mt-6">
              <AINarrativePanel
                narrative={tomorrowData.context.aiReasoning}
                recommendations={aiRecommendations}
              />
            </SystemPanel>
          )}
        </div>

        {/* Sidebar - Stats */}
        <div className="lg:col-span-1">
          <SystemPanel>
            <div className="space-y-4">
              <div>
                <p className="font-mono text-xs text-arch-dark-text-tertiary mb-2 uppercase">
                  TASK SUMMARY
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-arch-dark-text-secondary">
                      APPROVED
                    </span>
                    <span className="font-mono text-sm font-bold text-arch-dark-text-primary">
                      {approvedTasks.size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-arch-dark-text-secondary">
                      SKIPPED
                    </span>
                    <span className="font-mono text-sm font-bold text-arch-dark-text-tertiary">
                      {skippedTasks.size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-arch-dark-border-primary">
                    <span className="font-mono text-xs text-arch-dark-text-secondary">
                      TOTAL
                    </span>
                    <span className="font-mono text-sm font-bold text-arch-dark-text-primary">
                      {tasks.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SystemPanel>
        </div>
      </div>
    </div>
  );
}
