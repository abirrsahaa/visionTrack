import { apiClient, shouldUseMockData } from "./client";
import type { Journal, CreateJournalRequest, CreateJournalResponse } from "@/lib/types";
import { generateJournalHistory } from "@/lib/utils/generateJournalHistory";

export const journalsApi = {
  getByDate: async (date: string): Promise<Journal | null> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const journals = generateJournalHistory(180);
      return journals.find((j) => j.journalDate === date) || null;
    }

    const response = await apiClient.get<Journal>(`/journals/${date}`);
    return response.data;
  },

  getRange: async (start: string, end: string): Promise<Journal[]> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const allJournals = generateJournalHistory(180);
      return allJournals.filter(
        (j) => j.journalDate >= start && j.journalDate <= end
      );
    }

    const response = await apiClient.get<Journal[]>("/journals", {
      params: { start, end },
    });
    return response.data;
  },

  create: async (data: CreateJournalRequest): Promise<CreateJournalResponse> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const completedCount = data.completedTasks.filter((t) => t.completed)
        .length;
      const totalTasks = data.completedTasks.length;
      const completionRate = totalTasks > 0 ? completedCount / totalTasks : 0.5;

      // Calculate base pixels based on completion rate
      const basePixels = 100;
      let totalPixels = basePixels;
      if (completionRate >= 0.8) totalPixels = 100;
      else if (completionRate >= 0.5) totalPixels = 75;
      else totalPixels = 50;

      // Calculate bonus multiplier
      const now = new Date();
      const hour = now.getHours();
      const isBonusHour = hour >= 22 && hour < 23; // 10 PM - 11 PM
      const isWeekend = now.getDay() === 0 || now.getDay() === 6;
      const isLuckyDay = Math.random() < 0.05; // 5% chance

      let multiplier = 1.0;
      if (isLuckyDay) multiplier = 3.0;
      else if (isBonusHour) multiplier = 1.5;
      else if (isWeekend) multiplier = 1.2;

      // First journal of day always gets 2x
      const journals = generateJournalHistory(7);
      const todayJournals = journals.filter(
        (j) => j.journalDate === data.journalDate
      );
      if (todayJournals.length === 0) {
        multiplier = Math.max(multiplier, 2.0);
      }

      const finalPixels = Math.round(totalPixels * multiplier);

      const mockDomains = [
        { id: "dom_career", name: "Career", colorHex: "#3B82F6" },
        { id: "dom_health", name: "Health", colorHex: "#10B981" },
        { id: "dom_learning", name: "Learning", colorHex: "#F59E0B" },
        { id: "dom_relationships", name: "Relationships", colorHex: "#EC4899" },
      ];

      const completedTasksWithTitles = data.completedTasks.map((tc) => {
        return {
          ...tc,
          title: "Task", // In real implementation, fetch from todos
          notes: tc.notes || null,
        };
      });

      const journal: Journal = {
        id: `jrn_${data.journalDate}`,
        userId: "usr_abc123",
        journalDate: data.journalDate,
        entryText: data.entryText,
        emotionalState: "motivated",
        energyLevel: 4,
        aiReflection: "Great reflection! Keep up the good work.",
        submittedAt: new Date().toISOString(),
        completedTasks: completedTasksWithTitles,
      };

      const pixelsEarned = {
        total: finalPixels,
        byDomain: mockDomains.map((domain) => ({
          domainId: domain.id,
          domainName: domain.name,
          pixels: Math.round(finalPixels / mockDomains.length),
          colorHex: domain.colorHex,
        })),
        bonus: multiplier > 1.0 ? {
          multiplier,
          reason: isLuckyDay
            ? "Lucky Day! 🍀"
            : isBonusHour
            ? "Bonus Hour ✨"
            : isWeekend
            ? "Weekend Bonus"
            : "First Journal of Day",
        } : undefined,
      };

      return {
        journal,
        pixelsEarned,
        nextDayTasks: [], // Would come from API
      };
    }

    const response = await apiClient.post<CreateJournalResponse>("/journals", data);
    return response.data;
  },

  getAll: async (): Promise<Journal[]> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return generateJournalHistory(180);
    }

    const response = await apiClient.get<Journal[]>("/journals");
    return response.data;
  },
};
