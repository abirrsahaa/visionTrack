import { apiClient, shouldUseMockData } from "./client";
import type { PixelSummary } from "@/lib/types";
import { getPixelSummary6Months } from "@/lib/utils/mockData6Months";

export const pixelsApi = {
  getSummary: async (start?: string, end?: string): Promise<PixelSummary> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getPixelSummary6Months();
    }

    const params = new URLSearchParams();
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    const response = await apiClient.get<PixelSummary>(`/pixels/summary?${params.toString()}`);
    return response.data;
  },
};
