"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { PixelEarnedAnimation } from "@/components/journal/PixelEarnedAnimation";
import { MilestoneCelebration } from "@/components/dashboard/MilestoneCelebration";
import { calculateStreak } from "@/lib/utils/streakCalculator";
import { generateActivityFeed } from "@/lib/utils/generateJournalHistory";
import { TodayTasks } from "@/components/dashboard/TodayTasks";
import { VisionBoardPreview } from "@/components/dashboard/VisionBoardPreview";
import { WeeklyBoardDisplay } from "@/components/dashboard/WeeklyBoardDisplay";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { StreakBadge } from "@/components/dashboard/StreakBadge";
import { LevelCard } from "@/components/dashboard/LevelCard";
import { CommunityWidget } from "@/components/dashboard/CommunityWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingMilestones } from "@/components/dashboard/UpcomingMilestones";
import { TodayFocusBanner } from "@/components/dashboard/TodayFocusBanner";
import { HeroProgressCard } from "@/components/dashboard/HeroProgressCard";
import { WeeklyProgressChart } from "@/components/dashboard/WeeklyProgressChart";
import { LifeDomainsPanel } from "@/components/dashboard/LifeDomainsPanel";
import { DomainCategoryGrid } from "@/components/dashboard/DomainCategoryGrid";
import { SystemPanel } from "@/components/shared/SystemPanel";
import { NightJournalPanel } from "@/components/dashboard/NightJournalPanel";
import type { Todo, CreateJournalRequest, PixelsEarned } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [boardType, setBoardType] = useState<"weekly" | "monthly" | "quarterly">("weekly");
  const [showPixelAnimation, setShowPixelAnimation] = useState(false);
  const [pixelsEarned, setPixelsEarned] = useState<PixelsEarned | null>(null);
  const [celebratedMilestones, setCelebratedMilestones] = useState<Set<number>>(new Set());
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);

  // Fetch current board - supports weekly, monthly, and quarterly
  const { data: currentBoard, isLoading: boardLoading } = useQuery({
    queryKey: [...queryKeys.boards.current, boardType],
    queryFn: async () => {
      if (boardType === "monthly") {
        return api.boards.getMonthly(0);
      } else if (boardType === "quarterly") {
        // For quarterly, we can use the annual board or aggregate monthly boards
        // Using annual board as quarterly view for now
        return api.boards.getAnnual();
      }
      // Default: weekly
      return api.boards.getCurrent();
    },
  });

  // Fetch pixel summary
  const { data: pixelSummary } = useQuery({
    queryKey: queryKeys.pixels.summary(
      currentBoard?.periodStart,
      currentBoard?.periodEnd
    ),
    queryFn: () =>
      api.pixels.getSummary({
        start: currentBoard?.periodStart,
        end: currentBoard?.periodEnd,
      }),
    enabled: !!currentBoard,
  });

  // Fetch domains
  const { data: domains, isLoading: domainsLoading } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  // Fetch journals for streak calculation
  const { data: journals } = useQuery({
    queryKey: queryKeys.journals.all,
    queryFn: () => api.journals.getAll(),
  });

  // Calculate streak
  const streakData = journals ? calculateStreak(journals) : {
    currentStreak: 0,
    longestStreak: 0,
    totalJournals: 0,
    streakStartDate: null,
    isActive: false,
  };

  // Generate activity feed
  const activities = journals ? generateActivityFeed(journals, pixelSummary) : [];

  // Calculate completion percentage
  const completionPercentage = currentBoard?.totalPixels
    ? Math.round((currentBoard.coloredPixels / currentBoard.totalPixels) * 100)
    : 0;

  // Calculate level and XP (mock data)
  const level = 12;
  const totalXP = 8420;
  const xpToNextLevel = 420;
  const currentXPInLevel = totalXP - (level - 1) * 700;
  const xpRequiredForNext = 700;

  // Check if journal is pending today
  const hasPendingJournal = !journals?.some(
    (j) => j.journalDate === format(new Date(), "yyyy-MM-dd")
  );

  // Calculate milestones for upcoming
  const streakDaysUntil30 = Math.max(0, 30 - streakData.currentStreak);
  const percentUntil50Vision = Math.max(0, 50 - completionPercentage);

  // Check for milestone achievements
  useEffect(() => {
    if (!currentBoard) return;

    const milestones = [50, 75, 100];
    const percentage = completionPercentage;

    milestones.forEach((milestone) => {
      if (percentage >= milestone && !celebratedMilestones.has(milestone)) {
        setCelebratedMilestones((prev) => new Set(prev).add(milestone));
        setCurrentMilestone(milestone);
      }
    });
  }, [completionPercentage, currentBoard, celebratedMilestones]);

  // Calculate domain progress map
  const domainProgress = new Map<string, number>();
  if (pixelSummary && domains) {
    pixelSummary.byDomain.forEach((domainData) => {
      domainProgress.set(domainData.domainId, domainData.percentage * 100);
    });
  }

  // Journal submission handler
  const handleJournalSubmit = (text: string) => {
    // This would trigger journal submission - placeholder for now
    console.log("Journal submitted:", text);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground">Your Journey</h1>
          <p className="text-foreground-tertiary mt-1">Witness your effort turning into art</p>
        </motion.div>

        {/* Top Row: Vision Board (2 columns) + Split Card (1 column) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 lg:items-stretch">
          {/* Vision Board - Spans 2 columns, main element - matches height of right column */}
          <div className="lg:col-span-2 flex">
            <SystemPanel className="p-0 overflow-hidden w-full flex flex-col">
              <WeeklyBoardDisplay
                board={currentBoard || null}
                domains={domains || []}
                boardType={boardType}
                onBoardTypeChange={setBoardType}
                isLoading={boardLoading || domainsLoading}
              />
            </SystemPanel>
          </div>

          {/* Split Card: Weekly Progress (top) + Hero Progress (bottom) */}
          <div className="flex flex-col gap-6">
            {/* Weekly Progress Chart - Upper Half */}
            <div className="flex-1 min-h-0">
              <WeeklyProgressChart journals={journals || []} className="h-full" />
            </div>

            {/* Hero Progress Card - Lower Half */}
            <div className="flex-1 min-h-0">
              <HeroProgressCard
                level={level}
                totalJournals={journals?.length || 0}
                totalHours={Math.round((journals?.length || 0) * 2.5)}
                isPro={true}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Middle Row: 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Domains Progress */}
          <SystemPanel>
            <LifeDomainsPanel
              domains={domains || []}
              domainProgress={domainProgress}
              onDomainClick={(domain) => router.push(`/domains`)}
            />
          </SystemPanel>

          {/* Journal Entry */}
          <SystemPanel>
            <NightJournalPanel
              onSubmit={handleJournalSubmit}
              isLoading={false}
            />
          </SystemPanel>

          {/* Quick Actions */}
          <QuickActions hasPendingJournal={hasPendingJournal} />
        </div>

        {/* Domain Category Grid (Bottom) */}
        {domains && domains.length > 0 && (
          <SystemPanel>
            <DomainCategoryGrid
              domains={domains}
              onDomainClick={(domain) => router.push(`/domains`)}
            />
          </SystemPanel>
        )}
      </div>

      {/* Milestone Celebration Modal */}
      {currentMilestone !== null && currentBoard && (
        <MilestoneCelebration
          milestone={currentMilestone}
          currentPixels={currentBoard.coloredPixels}
          totalPixels={currentBoard.totalPixels}
          onClose={() => setCurrentMilestone(null)}
        />
      )}
    </div>
  );
}
