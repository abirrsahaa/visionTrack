import { apiClient, shouldUseMockData } from "./client";
import type { TimelineSnapshot } from "@/lib/types";
import { generateTimelineSnapshots } from "@/lib/utils/mockData6Months";

export const timelineApi = {
  getWeeks: async (count: number = 26): Promise<TimelineSnapshot[]> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const allSnapshots = generateTimelineSnapshots();
      return allSnapshots.slice(-count);
    }

    const response = await apiClient.get<TimelineSnapshot[]>(`/timeline?weeks=${count}`);
    return response.data;
  },

  getWeeklyWrap: async (date: string): Promise<TimelineSnapshot> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const allSnapshots = generateTimelineSnapshots();
      const snapshot = allSnapshots.find((s) => s.snapshotDate === date);
      if (!snapshot) throw new Error("Weekly wrap not found");
      return snapshot;
    }

    const response = await apiClient.get<TimelineSnapshot>(`/wraps/weekly/${date}`);
    return response.data;
  },
};
