"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { SystemPanel } from "@/components/shared/SystemPanel";
import { NightJournalPanel } from "@/components/dashboard/NightJournalPanel";
import { TaskItem } from "@/components/shared/TaskItem";
import { PixelEarnedAnimation } from "@/components/journal/PixelEarnedAnimation";
import { BonusHourBanner } from "@/components/dashboard/BonusHourBanner";
import { isBonusHourActive, calculatePixelBonus } from "@/lib/utils/bonusCalculator";
import { isWeekend } from "date-fns";
import type { Todo, CreateJournalRequest, PixelsEarned, Domain } from "@/lib/types";

export default function JournalPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const [taskCompletions, setTaskCompletions] = useState<Map<string, boolean>>(new Map());
  const [showPixelAnimation, setShowPixelAnimation] = useState(false);
  const [pixelsEarned, setPixelsEarned] = useState<PixelsEarned | null>(null);

  // Fetch today's tasks
  const { data: todayTasks, isLoading: tasksLoading } = useQuery({
    queryKey: queryKeys.todos.today,
    queryFn: api.todos.getToday,
  });

  // Fetch domains
  const { data: domains } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  // Fetch existing journals
  const { data: journals } = useQuery({
    queryKey: queryKeys.journals.all,
    queryFn: () => api.journals.getAll(),
  });

  // Submit journal
  const { mutate: submitJournal, isPending } = useMutation({
    mutationFn: api.journals.create,
    onSuccess: (response) => {
      // Clear draft
      localStorage.removeItem(`journal-draft-${today}`);

      // Show pixel animation
      setPixelsEarned(response.pixelsEarned);
      setShowPixelAnimation(true);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.current });
      queryClient.invalidateQueries({ queryKey: queryKeys.pixels.summary() });
      queryClient.invalidateQueries({ queryKey: queryKeys.journals.all });
    },
    onError: (error: Error) => {
      console.error("Failed to submit journal:", error);
    },
  });

  const handleJournalSubmit = (text: string) => {
    const completedTasks = Array.from(taskCompletions.entries()).map(([todoId, completed]) => ({
      todoId,
      completed,
      notes: undefined,
    }));

    submitJournal({
      journalDate: today,
      entryText: text,
      completedTasks,
    });
  };

  const handleTaskToggle = (taskId: string) => {
    setTaskCompletions((prev) => {
      const next = new Map(prev);
      next.set(taskId, !next.get(taskId));
      return next;
    });
  };

  // Check bonus conditions
  const now = new Date();
  const bonusActive = isBonusHourActive(now, 22, 23);
  const isFirstJournalOfDay = !journals?.some((j) => j.journalDate === today);
  const isLuckyDay = Math.random() < 0.05;

  const bonusMultiplier = calculatePixelBonus({
    isFirstJournalOfDay,
    isBonusHour: bonusActive,
    isWeekend: isWeekend(now),
    isLuckyDay,
  });

  const getDomainName = (domainId: string) => {
    return domains?.find((d) => d.id === domainId)?.name || "GENERAL";
  };

  return (
    <div className="min-h-screen bg-background max-w-4xl mx-auto space-y-6 py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <h1 className="font-mono text-2xl font-bold text-foreground mb-2 uppercase tracking-wider">
          Night Journal
        </h1>
        <p className="font-mono text-xs text-foreground-secondary">
          {format(new Date(), "EEEE, MMMM d, yyyy").toUpperCase()}
        </p>
      </motion.div>

      {/* Bonus Hour Banner */}
      {(bonusActive || isLuckyDay || isFirstJournalOfDay) && (
        <BonusHourBanner
          bonusMultiplier={bonusMultiplier}
          startTime={new Date(now.setHours(22, 0, 0, 0))}
          endTime={new Date(now.setHours(23, 0, 0, 0))}
        />
      )}

      {/* Journal Entry Panel */}
      <SystemPanel>
        <NightJournalPanel onSubmit={handleJournalSubmit} isLoading={isPending} />
      </SystemPanel>

      {/* Today's Tasks */}
      {todayTasks && todayTasks.length > 0 && (
        <SystemPanel title="TODAY'S TASKS">
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                domain={getDomainName(task.domainId)}
                effort={task.effortWeight ? `${task.effortWeight}H DEEP WORK` : undefined}
                completed={taskCompletions.get(task.id) || false}
                onToggle={handleTaskToggle}
              />
            ))}
          </div>
        </SystemPanel>
      )}

      {/* Pixel Animation Modal */}
      {showPixelAnimation && pixelsEarned && (
        <PixelEarnedAnimation
          pixels={pixelsEarned}
          onComplete={() => {
            setShowPixelAnimation(false);
            router.push("/dashboard");
          }}
        />
      )}
    </div>
  );
}
