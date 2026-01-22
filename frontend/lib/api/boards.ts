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

      // Attempt to load from localStorage for Onboarding persistence
      if (typeof window !== "undefined") {
        const storedData = localStorage.getItem("vision-board-data");
        if (storedData) {
          try {
            const userData = JSON.parse(storedData);
            if (userData.domains && Array.isArray(userData.domains)) {
              // Generate meaningful board data based on user domains
              const boardId = `board_${Date.now()}`;
              const totalPixels = 1000; // Mock total
              const coloredPixels = 350; // Mock progress

              // Distribute pixels among domains
              const domainLayouts = userData.domains.map((d: any, index: number) => {
                return {
                  domainId: `dom_${index}`, // MATCHES STABLE ID IN DOMAINS API
                  region: { x: 0, y: 0, width: 100, height: 100 }, // Mock region
                  // Generate some random pixel coordinates [x, y]
                  pixels: Array.from({ length: 50 }, () => [
                    Math.floor(Math.random() * 50),
                    Math.floor(Math.random() * 50)
                  ])
                };
              });

              return {
                id: boardId,
                userId: "user_mock",
                boardType: "weekly",
                periodStart: new Date().toISOString(),
                periodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                designStyle: userData.design || "grid",
                layoutMetadata: {
                  domains: domainLayouts
                },
                baseImageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
                currentImageUrl: "",
                totalPixels,
                coloredPixels,
                lastUpdated: new Date().toISOString(),
                createdAt: new Date().toISOString()
              } as VisionBoard;
            }
          } catch (e) {
            console.error("Failed to parse local stored vision data for board", e);
          }
        }
      }

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
