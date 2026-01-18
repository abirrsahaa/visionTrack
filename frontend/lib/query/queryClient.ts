import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  domains: {
    all: ["domains"] as const,
    detail: (id: string) => ["domains", id] as const,
  },
  goals: {
    all: ["goals"] as const,
    byDomain: (domainId: string) => ["goals", "domain", domainId] as const,
    detail: (id: string) => ["goals", id] as const,
  },
  todos: {
    today: ["todos", "today"] as const,
    tomorrow: ["todos", "tomorrow"] as const,
    byGoal: (goalId: string) => ["todos", "goal", goalId] as const,
  },
  journals: {
    all: ["journals"] as const,
    byDate: (date: string) => ["journals", "date", date] as const,
    range: (start: string, end: string) => ["journals", "range", start, end] as const,
  },
  boards: {
    current: ["boards", "current"] as const,
    weekly: (offset: number = 0) => ["boards", "weekly", offset] as const,
    monthly: (offset: number = 0) => ["boards", "monthly", offset] as const,
    annual: ["boards", "annual"] as const,
  },
  timeline: {
    weeks: (count: number) => ["timeline", "weeks", count] as const,
  },
  pixels: {
    summary: (start?: string, end?: string) =>
      start && end
        ? (["pixels", "summary", start, end] as const)
        : (["pixels", "summary"] as const),
  },
};
