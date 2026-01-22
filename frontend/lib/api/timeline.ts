import { getTimelineWeeks } from "@/app/actions";

export const timelineApi = {
  getWeeks: async (count: number = 26): Promise<TimelineSnapshot[]> => {
    // Call server action directly
    return await getTimelineWeeks(count);
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
