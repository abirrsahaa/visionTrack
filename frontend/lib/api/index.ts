// Centralized API exports
export * from "./client";
export * from "./auth";
export * from "./domains";
export * from "./goals";
export * from "./todos";
export * from "./journals";
export * from "./boards";
export * from "./timeline";
export * from "./pixels";

// Re-export as api object for easier imports
import { authApi } from "./auth";
import { domainsApi } from "./domains";
import { goalsApi } from "./goals";
import { todosApi } from "./todos";
import { journalsApi } from "./journals";
import { boardsApi } from "./boards";
import { timelineApi } from "./timeline";
import { pixelsApi } from "./pixels";

export const api = {
  auth: authApi,
  domains: domainsApi,
  goals: goalsApi,
  todos: todosApi,
  journals: journalsApi,
  boards: boardsApi,
  timeline: timelineApi,
  pixels: pixelsApi,
};