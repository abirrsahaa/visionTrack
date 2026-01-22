import { apiClient, shouldUseMockData } from "./client";
import type {
  Goal,
  CreateGoalRequest,
  DecomposeResponse,
  ApproveBreakdownRequest,
} from "@/lib/types";
import { mockGoals6Months } from "@/lib/utils/mockData6Months";

export const goalsApi = {
  getByDomain: async (domainId: string): Promise<Goal[]> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockGoals6Months.filter((g) => g.domainId === domainId);
    }

    const response = await apiClient.get<Goal[]>(`/goals?domainId=${domainId}`);
    return response.data;
  },

  getAll: async (): Promise<Goal[]> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Attempt to load from localStorage for Onboarding persistence
      if (typeof window !== "undefined") {
        const storedData = localStorage.getItem("vision-board-data");
        if (storedData) {
          try {
            const userData = JSON.parse(storedData);
            if (userData.goals && Array.isArray(userData.goals) && userData.domains) {
              return userData.goals.map((g: any, index: number) => {
                // Find domain index for stable ID
                const domainIndex = userData.domains.findIndex((d: any) => d.name === g.domain);
                const domainId = domainIndex >= 0 ? `dom_${domainIndex}` : `dom_${index}`;

                return {
                  id: `goal_${index}`,
                  domainId: domainId,
                  title: `Strategic Plan: ${g.domain}`,
                  description: `AI-generated roadmap for ${g.domain}`,
                  status: "active",
                  startDate: new Date().toISOString(),
                  targetDate: null,
                  milestones: (g.milestones || []).map((m: string, mIndex: number) => ({
                    id: `mile_${index}_${mIndex}`,
                    title: m,
                    targetDate: null,
                    completedAt: null,
                    sortOrder: mIndex
                  })),
                  createdAt: userData.createdAt || new Date().toISOString(),
                };
              });
            }
          } catch (e) {
            console.error("Failed to parse local stored vision data for goals", e);
          }
        }
      }

      return mockGoals6Months;
    }

    const response = await apiClient.get<Goal[]>("/goals");
    return response.data;
  },

  create: async (data: CreateGoalRequest): Promise<Goal> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newGoal: Goal = {
        id: `goal_${Date.now()}`,
        domainId: data.domainId,
        title: data.title,
        description: data.description,
        status: "active",
        startDate: data.targetDate || new Date().toISOString().split("T")[0],
        targetDate: data.targetDate || null,
        milestones: [],
        createdAt: new Date().toISOString(),
      };
      mockGoals6Months.push(newGoal);
      return newGoal;
    }

    const response = await apiClient.post<Goal>("/goals", data);
    return response.data;
  },

  decompose: async (goalId: string): Promise<DecomposeResponse> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        goalId,
        milestones: [
          {
            title: "Milestone 1",
            targetDate: null,
          },
          {
            title: "Milestone 2",
            targetDate: null,
          },
        ],
        todos: [
          {
            milestoneTitle: "Milestone 1",
            title: "Todo 1",
            description: "Description",
            estimatedDuration: "1 hour",
          },
        ],
        aiInsights: "AI-generated insights about breaking down this goal.",
      };
    }

    const response = await apiClient.post<DecomposeResponse>(`/goals/${goalId}/decompose`, {});
    return response.data;
  },

  approveBreakdown: async (goalId: string, data: ApproveBreakdownRequest): Promise<Goal> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const goal = mockGoals6Months.find((g) => g.id === goalId);
      if (!goal) throw new Error("Goal not found");
      // Update goal with milestones
      goal.milestones = data.milestones.map((m, i) => ({
        id: `mile_${i}`,
        title: m.title,
        targetDate: m.targetDate,
        completedAt: null,
        sortOrder: i,
      }));
      return goal;
    }

    const response = await apiClient.post<Goal>(`/goals/${goalId}/approve-breakdown`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<Goal>): Promise<Goal> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const goal = mockGoals6Months.find((g) => g.id === id);
      if (!goal) throw new Error("Goal not found");
      Object.assign(goal, data);
      return goal;
    }

    const response = await apiClient.put<Goal>(`/goals/${id}`, data);
    return response.data;
  },
};
