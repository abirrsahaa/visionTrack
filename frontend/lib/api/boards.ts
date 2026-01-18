import { apiClient, shouldUseMockData } from "./client";
import type {
  VisionBoard,
  GenerateBoardRequest,
  BoardDesign,
  SelectDesignRequest,
} from "@/lib/types";
import {
  getCurrentWeekBoard,
  getCurrentMonthBoard,
  generateAnnualBoard,
  generateWeeklyBoards,
  generateMonthlyBoards,
} from "@/lib/utils/mockData6Months";
import { mockDesigns } from "@/lib/utils/mockData";

export const boardsApi = {
  getCurrent: async (): Promise<VisionBoard> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getCurrentWeekBoard();
    }

    const response = await apiClient.get<VisionBoard>("/boards/current");
    return response.data;
  },

  getWeekly: async (weekOffset?: number): Promise<VisionBoard> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (weekOffset === undefined || weekOffset === 0) {
        return getCurrentWeekBoard();
      }
      // Return a board from the past
      const boards = generateWeeklyBoards();
      return boards[Math.max(0, boards.length - 1 - weekOffset)];
    }

    const response = await apiClient.get<VisionBoard>(`/boards/weekly?offset=${weekOffset || 0}`);
    return response.data;
  },

  getMonthly: async (monthOffset?: number): Promise<VisionBoard> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (monthOffset === undefined || monthOffset === 0) {
        return getCurrentMonthBoard();
      }
      // Return a board from the past
      const boards = generateMonthlyBoards();
      return boards[Math.max(0, boards.length - 1 - monthOffset)];
    }

    const response = await apiClient.get<VisionBoard>(`/boards/monthly?offset=${monthOffset || 0}`);
    return response.data;
  },

  getAnnual: async (): Promise<VisionBoard> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return generateAnnualBoard();
    }

    const response = await apiClient.get<VisionBoard>("/boards/annual");
    return response.data;
  },

  generate: async (data: GenerateBoardRequest): Promise<VisionBoard> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data.boardType === "monthly" ? getCurrentMonthBoard() : getCurrentWeekBoard();
    }

    const response = await apiClient.post<VisionBoard>("/boards/generate", data);
    return response.data;
  },

  getDesigns: async (): Promise<BoardDesign[]> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDesigns;
    }

    const response = await apiClient.get<BoardDesign[]>("/boards/designs");
    return response.data;
  },

  selectDesign: async (data: SelectDesignRequest): Promise<{ success: boolean; regenerating: boolean }> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, regenerating: true };
    }

    const response = await apiClient.post<{ success: boolean; regenerating: boolean }>(
      "/boards/select-design",
      data
    );
    return response.data;
  },
};
