"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { MilestoneCelebration } from "@/components/dashboard/MilestoneCelebration";
import { calculateStreak } from "@/lib/utils/streakCalculator";
import { VisionBoardWidget } from "@/components/dashboard/VisionBoardWidget";
import { HeroProgressCard } from "@/components/dashboard/HeroProgressCard";
import { LifeDomainsPanel } from "@/components/dashboard/LifeDomainsPanel";
import { SystemPanel } from "@/components/shared/SystemPanel";
import { NightJournalPanel } from "@/components/dashboard/NightJournalPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Compass, Sparkles, Terminal, Activity, LayoutDashboard } from "lucide-react";
import type { Domain } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [boardType, setBoardType] = useState<"weekly" | "monthly" | "annual">("weekly");
  const [celebratedMilestones, setCelebratedMilestones] = useState<Set<number>>(new Set());
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);

  const [isSubmittingJournal, setIsSubmittingJournal] = useState(false);
  const queryClient = useQueryClient();

  const handleJournalSubmit = async (text: string) => {
    setIsSubmittingJournal(true);
    try {
      await api.journals.create({
        journalDate: format(new Date(), "yyyy-MM-dd"),
        entryText: text,
        completedTasks: []
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.journals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.boards.current });
    } catch (error) {
      console.error("Failed to submit journal", error);
    } finally {
      setIsSubmittingJournal(false);
    }
  };

  // --- Data Fetching --- 
  const { data: currentBoard, isLoading: boardLoading } = useQuery({
    queryKey: [...queryKeys.boards.current, boardType],
    queryFn: async () => {
      // API call routing based on view type
      if (boardType === "monthly") return api.boards.getMonthly(0);
      if (boardType === "annual") return api.boards.getAnnual();
      return api.boards.getCurrent();
    },
  });

  const { data: pixelSummary } = useQuery({
    queryKey: queryKeys.pixels.summary(currentBoard?.periodStart, currentBoard?.periodEnd),
    queryFn: () => api.pixels.getSummary(currentBoard?.periodStart, currentBoard?.periodEnd),
    enabled: !!currentBoard,
  });

  const { data: domains, isLoading: domainsLoading } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  const { data: journals } = useQuery({
    queryKey: queryKeys.journals.all,
    queryFn: () => api.journals.getAll(),
  });

  // Calculations
  const streakData = journals ? calculateStreak(journals) : { currentStreak: 0, isActive: false };
  const completionPercentage = currentBoard?.totalPixels
    ? Math.round((currentBoard.coloredPixels / currentBoard.totalPixels) * 100)
    : 0;

  const hasPendingJournal = !journals?.some(
    (j) => j.journalDate === format(new Date(), "yyyy-MM-dd")
  );

  // Milestones Check
  useEffect(() => {
    if (!currentBoard) return;
    const milestones = [50, 75, 100];
    milestones.forEach((milestone) => {
      if (completionPercentage >= milestone && !celebratedMilestones.has(milestone)) {
        setCelebratedMilestones((prev) => new Set(prev).add(milestone));
        setCurrentMilestone(milestone);
      }
    });
  }, [completionPercentage, currentBoard, celebratedMilestones]);

  const domainProgress = useMemo(() => {
    const map = new Map<string, number>();
    if (pixelSummary && domains) {
      pixelSummary.byDomain.forEach((d) => map.set(d.domainId, d.percentage * 100));
    }
    return map;
  }, [pixelSummary, domains]);

  const handleViewChange = useCallback((view: "weekly" | "monthly" | "annual") => {
    setBoardType(view);
  }, []);

  // BOLT: Stabilize callback to prevent LifeDomainsPanel re-renders
  const handleDomainClick = useCallback((_domain: Domain) => {
    router.push(`/domains`);
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-purple/30">

      {/* HUD Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5 py-3 px-6 lg:px-12 mb-6 transition-all duration-300">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-purple/10 rounded-lg border border-purple/20">
              <Compass className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest uppercase">Command Center</h1>
              <p className="text-[10px] text-foreground-tertiary font-mono">SYSTEM READY // {format(new Date(), "yyyy.MM.dd")}</p>
            </div>
          </div>

          {/* Global Stats Ticker */}
          <div className="hidden lg:flex items-center gap-8 bg-black/20 px-6 py-2 rounded-full border border-white/5">
            <div className="flex items-center gap-3">
              <Activity className="w-3 h-3 text-green-400" />
              <span className="text-xs font-mono text-foreground-secondary">STREAK: <span className="text-white">{streakData.currentStreak} DAYS</span></span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span className="text-xs font-mono text-foreground-secondary">LEVEL 12 ARCH: <span className="text-white">8420 XP</span></span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-3 h-3 text-purple-400" />
              <span className="text-xs font-mono text-foreground-secondary">VISION SYNC: <span className="text-white">{completionPercentage}%</span></span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-orange opacity-20" />
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* THE ARCHITECT'S DESK LAYOUT */}
        {/* 3 Columns: INPUT (Tools) -> OUTPUT (Vision) -> CONTROL (Stats) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[800px]">

          {/* LEFT COLUMN: INPUT TOOLS (3 Cols) */}
          <div className="xl:col-span-3 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar no-scrollbar">

            {/* Daily Protocol (Tasks) */}
            <SystemPanel className="bg-[#0a0a0a] border-white/5 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Daily Protocol</h3>
                <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono text-foreground-tertiary">3 PENDING</span>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5 transition-all cursor-pointer">
                    <div className="mt-1 w-4 h-4 rounded border border-white/20 group-hover:border-purple/50 flex items-center justify-center transition-colors">
                      <div className="w-2 h-2 rounded-sm bg-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground-secondary group-hover:text-foreground transition-colors">Complete module {i} design</p>
                      <p className="text-[10px] text-foreground-tertiary mt-0.5">CAREER // 150 XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </SystemPanel>




            {/* Night Journal (Input) - FLEX GROW with MINIMUM HEIGHT */}
            <SystemPanel className="bg-[#0a0a0a] border-white/5 flex-grow min-h-[300px] flex flex-col">
              <NightJournalPanel
                onSubmit={handleJournalSubmit}
                isLoading={isSubmittingJournal}
              />
            </SystemPanel>

            {/* System Log / Terminal - MOVED HERE */}
            <div className="flex-shrink-0 min-h-[160px] bg-black/80 border border-white/10 rounded-xl p-4 font-mono text-xs text-foreground-secondary overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple/20 to-transparent" />
              <div className="flex items-center gap-2 mb-3 text-purple-400">
                <Terminal className="w-3 h-3" />
                <span className="tracking-widest uppercase text-[10px]">Event Stream</span>
              </div>
              <div className="space-y-2 relative z-10">
                <p className="opacity-50 text-[10px]">10:42:05</p>
                <p className="text-gray-400">&gt; User session active.</p>
                <p className="text-gray-400">&gt; Pixel engine online.</p>
                <div className="pl-2 border-l border-white/10 my-2">
                  <p className="text-green-400">Journal Entry received.</p>
                  <p className="text-purple-400">+45 Pixels generated.</p>
                </div>
                <p className="text-gray-400">&gt; <span className="animate-pulse">Awaiting new directives...</span></p>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: THE MASTERPIECE (6 Cols) */}
          <div className="xl:col-span-6 h-full flex flex-col gap-4">
            <div className="flex-1 rounded-2xl border border-white/10 bg-[#050505] shadow-2xl overflow-hidden relative group">
              {/* Decorative Blueprint Lines */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20" />

              <VisionBoardWidget
                board={currentBoard || null}
                domains={domains || []}
                currentView={boardType as "weekly" | "monthly" | "annual"}
                onViewChange={handleViewChange}
                isLoading={boardLoading || domainsLoading}
              />
            </div>

            {/* Under-board: Process Visualization */}
            <div className="h-16 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between px-6">
              <div className="flex items-center gap-4 opacity-50">
                <span className="text-xs font-mono text-gray-500">INPUT SOURCE</span>
                <div className="h-1 w-8 bg-gray-800 rounded-full" />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-3 bg-purple rounded-sm"
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest ml-2">Processing Reality</span>
              </div>

              <div className="flex items-center gap-4 opacity-50">
                <div className="h-1 w-8 bg-gray-800 rounded-full" />
                <span className="text-xs font-mono text-gray-500">VISUAL OUTPUT</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTROL & FEEDBACK (3 Cols) */}
          <div className="xl:col-span-3 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar no-scrollbar">

            {/* Hero Card Small */}
            <div className="h-48 flex-shrink-0">
              <HeroProgressCard
                level={Math.floor((currentBoard?.coloredPixels || 0) / 1000) + 1}
                progress={((currentBoard?.coloredPixels || 0) % 1000) / 10}
                totalJournals={journals?.length || 0}
                totalHours={Math.round((journals?.length || 0) * 0.5)} // avg 30 mins
                isPro={true}
                className="h-full border border-white/10"
              />
            </div>

            {/* Domain Status Grid */}
            <SystemPanel className="bg-[#0a0a0a] border-white/5 max-h-[300px] flex flex-col">
              <div className="overflow-y-auto custom-scrollbar pr-2 -mr-2">
                <LifeDomainsPanel
                  domains={domains || []}
                  domainProgress={domainProgress}
                  onDomainClick={handleDomainClick}
                />
              </div>
            </SystemPanel>

            {/* Quick Actions (Moved HERE to Right Column) */}
            <div className="flex-shrink-0">
              <QuickActions hasPendingJournal={hasPendingJournal} />
            </div>

          </div>
        </div>
      </div>

      {/* Celebration Modal */}
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
