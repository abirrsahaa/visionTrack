import { apiClient, shouldUseMockData } from "./client";
import type { Todo, TomorrowTasksResponse, ValidateTasksRequest } from "@/lib/types";
import { getTodayTodos, getTomorrowTasks } from "@/lib/utils/mockData6Months";

export const todosApi = {
  getToday: async (): Promise<Todo[]> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getTodayTodos();
    }

    const response = await apiClient.get<Todo[]>("/todos/today");
    return response.data;
  },

  getTomorrow: async (): Promise<TomorrowTasksResponse> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getTomorrowTasks();
    }

    const response = await apiClient.get<TomorrowTasksResponse>("/tasks/tomorrow");
    return response.data;
  },

  validate: async (data: ValidateTasksRequest): Promise<{ success: boolean; approvedCount: number }> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, approvedCount: data.approvedTasks.length };
    }

    const response = await apiClient.post<{ success: boolean; approvedCount: number }>("/tasks/validate", data);
    return response.data;
  },
};
