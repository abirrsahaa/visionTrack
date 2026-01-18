// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  bedtimeReminder: string;
  morningReminder: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  timezone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Domain Types
export interface DomainImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
  uploadedAt: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  colorHex: string;
  sortOrder: number;
  images: DomainImage[];
  createdAt: string;
}

export interface CreateDomainRequest {
  name: string;
  description: string;
  colorHex?: string;
}

export interface UpdateDomainRequest {
  name?: string;
  description?: string;
  colorHex?: string;
}

// Goal Types
export interface Milestone {
  id: string;
  title: string;
  targetDate: string | null;
  completedAt: string | null;
  sortOrder: number;
}

export interface Goal {
  id: string;
  domainId: string;
  title: string;
  description: string;
  status: "active" | "completed" | "archived";
  startDate: string;
  targetDate: string | null;
  milestones: Milestone[];
  createdAt: string;
}

export interface CreateGoalRequest {
  domainId: string;
  title: string;
  description: string;
  targetDate?: string;
}

export interface DecomposeResponse {
  goalId: string;
  milestones: Array<{
    title: string;
    targetDate: string | null;
  }>;
  todos: Array<{
    milestoneTitle: string;
    title: string;
    description: string;
    estimatedDuration?: string;
  }>;
  aiInsights: string;
}

export interface ApproveBreakdownRequest {
  milestones: Array<{
    title: string;
    targetDate: string | null;
  }>;
  todos: Array<{
    milestoneIndex: number;
    title: string;
    description: string;
    scheduledDate?: string;
  }>;
}

// Todo Types
export interface Todo {
  id: string;
  milestoneId: string;
  goalId: string;
  domainId: string;
  title: string;
  description: string;
  scheduledDate: string | null;
  status: "pending" | "approved" | "completed" | "skipped";
  approvedAt: string | null;
  completedAt: string | null;
  effortWeight: number;
  createdAt: string;
}

export interface TomorrowTasksResponse {
  suggestedTasks: Todo[];
  context: {
    yesterdayCompletionRate: number;
    energyLevel: number;
    aiReasoning: string;
  };
}

export interface ValidateTasksRequest {
  approvedTasks: string[];
  skippedTasks: string[];
  modifiedTasks?: Array<{
    id: string;
    title?: string;
    description?: string;
    effortWeight?: number;
  }>;
}

// Journal Types
export interface JournalTaskCompletion {
  todoId: string;
  title: string;
  completed: boolean;
  notes: string | null;
}

export interface Journal {
  id: string;
  userId: string;
  journalDate: string;
  entryText: string;
  emotionalState: string | null;
  energyLevel: number | null;
  aiReflection: string | null;
  submittedAt: string;
  completedTasks: JournalTaskCompletion[];
}

export interface CreateJournalRequest {
  journalDate: string;
  entryText: string;
  completedTasks: Array<{
    todoId: string;
    completed: boolean;
    notes?: string;
  }>;
}

export interface PixelsEarned {
  total: number;
  byDomain: Array<{
    domainId: string;
    domainName: string;
    pixels: number;
    colorHex?: string;
  }>;
  bonus?: {
    multiplier: number;
    reason: string;
  };
}

export interface CreateJournalResponse {
  journal: Journal;
  pixelsEarned: PixelsEarned;
  nextDayTasks: Todo[];
}

// Vision Board Types
export interface VisionBoardLayout {
  domains: Array<{
    domainId: string;
    region: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    pixels: Array<[number, number]>;
  }>;
}

export interface VisionBoard {
  id: string;
  userId: string;
  boardType: "weekly" | "monthly" | "quarterly" | "annual";
  periodStart: string;
  periodEnd: string;
  designStyle: string;
  layoutMetadata: VisionBoardLayout;
  baseImageUrl: string;
  currentImageUrl: string;
  totalPixels: number;
  coloredPixels: number;
  lastUpdated: string;
  createdAt: string;
}

export interface GenerateBoardRequest {
  boardType?: "weekly" | "monthly";
  periodStart?: string;
  forceRegenerate?: boolean;
}

export interface BoardDesign {
  id: string;
  designName: string;
  designStyle: "grid" | "collage" | "cinematic" | "minimalist" | "symmetric";
  previewUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface SelectDesignRequest {
  designId: string;
}

export interface ExportResponse {
  downloadUrl: string;
  resolution: string;
  expiresAt: string;
}

// Pixel Types
export interface PixelSummary {
  totalPixels: number;
  byDomain: Array<{
    domainId: string;
    domainName: string;
    colorHex: string;
    totalPixels: number;
    percentage: number;
  }>;
  byDate: Array<{
    date: string;
    totalPixels: number;
    byDomain: Array<{
      domainId: string;
      pixels: number;
    }>;
  }>;
}

// Timeline Types
export interface TimelineSnapshot {
  id: string;
  snapshotDate: string;
  snapshotType: "daily" | "weekly" | "monthly" | "quarterly";
  boardImageUrl: string;
  narrativeText: string | null;
  animationUrl: string | null;
  pixelsSummary: {
    totalPixels: number;
    completionRate: number;
  };
  createdAt: string;
}

// Preferences Types
export interface UpdateRemindersRequest {
  bedtimeReminder?: string;
  morningReminder?: string;
  bedtimeEnabled?: boolean;
  morningEnabled?: boolean;
}

export interface UserPreferences {
  reminders: {
    bedtime: { time: string; enabled: boolean };
    morning: { time: string; enabled: boolean };
  };
  notifications: {
    push: boolean;
    email: boolean;
  };
}