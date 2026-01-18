// Mock data for development when backend is not available
import type {
  User,
  Domain,
  Goal,
  Todo,
  Journal,
  VisionBoard,
  BoardDesign,
  TimelineSnapshot,
  TomorrowTasksResponse,
  PixelSummary,
  AuthResponse,
} from "@/lib/types";

export const mockUser: User = {
  id: "usr_abc123",
  email: "alice@example.com",
  name: "Alice Johnson",
  timezone: "America/New_York",
  bedtimeReminder: "22:00:00",
  morningReminder: "07:00:00",
  createdAt: "2025-01-01T00:00:00Z",
};

export const mockAuthResponse: AuthResponse = {
  user: mockUser,
  tokens: {
    accessToken: "mock_access_token_" + Date.now(),
    refreshToken: "mock_refresh_token_" + Date.now(),
  },
};

export const mockDomains: Domain[] = [
  {
    id: "dom_career",
    name: "Career",
    description: "Advance to senior engineering role",
    colorHex: "#3B82F6",
    sortOrder: 1,
    images: [
      {
        id: "img_1",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
        sortOrder: 1,
        uploadedAt: "2025-01-01T10:00:00Z",
      },
      {
        id: "img_2",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        sortOrder: 2,
        uploadedAt: "2025-01-01T10:05:00Z",
      },
    ],
    createdAt: "2025-01-01T09:00:00Z",
  },
  {
    id: "dom_health",
    name: "Health",
    description: "Build functional strength and flexibility",
    colorHex: "#10B981",
    sortOrder: 2,
    images: [
      {
        id: "img_3",
        imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
        sortOrder: 1,
        uploadedAt: "2025-01-01T11:00:00Z",
      },
    ],
    createdAt: "2025-01-01T09:30:00Z",
  },
  {
    id: "dom_learning",
    name: "Learning",
    description: "Master machine learning fundamentals",
    colorHex: "#F59E0B",
    sortOrder: 3,
    images: [],
    createdAt: "2025-01-01T10:00:00Z",
  },
];

export const mockGoals: Goal[] = [
  {
    id: "goal_career_1",
    domainId: "dom_career",
    title: "Get promoted to Senior Engineer",
    description: "Demonstrate technical leadership and system design skills",
    status: "active",
    startDate: "2025-01-01",
    targetDate: "2025-12-31",
    milestones: [
      {
        id: "mile_1",
        title: "Complete system design course",
        targetDate: "2025-03-31",
        completedAt: null,
        sortOrder: 1,
      },
      {
        id: "mile_2",
        title: "Lead major project",
        targetDate: "2025-06-30",
        completedAt: null,
        sortOrder: 2,
      },
    ],
    createdAt: "2025-01-01T12:00:00Z",
  },
];

export const mockTodos: Todo[] = [
  {
    id: "todo_1",
    milestoneId: "mile_1",
    goalId: "goal_career_1",
    domainId: "dom_career",
    title: "Enroll in system design course",
    description: "Sign up on Educative platform",
    scheduledDate: "2025-01-18",
    status: "approved",
    approvedAt: "2025-01-17T08:00:00Z",
    completedAt: null,
    effortWeight: 0.5,
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "todo_2",
    milestoneId: "mile_1",
    goalId: "goal_career_1",
    domainId: "dom_career",
    title: "Complete Module 1: Scalability",
    description: "Watch videos and complete exercises",
    scheduledDate: "2025-01-19",
    status: "pending",
    approvedAt: null,
    completedAt: null,
    effortWeight: 1.5,
    createdAt: "2025-01-15T10:05:00Z",
  },
];

export const mockJournal: Journal = {
  id: "jrn_20250117",
  userId: "usr_abc123",
  journalDate: "2025-01-17",
  entryText: "Great day! Finished the project proposal ahead of schedule. Feeling energized and ready to tackle more challenges.",
  emotionalState: "motivated",
  energyLevel: 4,
  aiReflection: "You showed strong focus today, completing high-priority work ahead of schedule. Your energy is high—consider channeling this momentum into learning tomorrow.",
  submittedAt: "2025-01-17T22:30:00Z",
  completedTasks: [
    {
      todoId: "todo_1",
      title: "Finish project proposal",
      completed: true,
      notes: "Submitted 2 days early!",
    },
    {
      todoId: "todo_2",
      title: "Read 30 pages",
      completed: false,
      notes: "Ran out of time",
    },
  ],
};

export const mockBoard: VisionBoard = {
  id: "board_week_3",
  userId: "usr_abc123",
  boardType: "weekly",
  periodStart: "2025-01-13",
  periodEnd: "2025-01-19",
  designStyle: "grid",
  layoutMetadata: {
    domains: [
      {
        domainId: "dom_career",
        region: { x: 0, y: 0, width: 50, height: 50 },
        pixels: [[0, 0], [1, 0], [2, 0]],
      },
      {
        domainId: "dom_health",
        region: { x: 50, y: 0, width: 50, height: 50 },
        pixels: [[50, 0], [51, 0]],
      },
    ],
  },
  baseImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
  currentImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
  totalPixels: 7500,
  coloredPixels: 3200,
  lastUpdated: "2025-01-17T22:30:00Z",
  createdAt: "2025-01-13T00:00:00Z",
};

export const mockDesigns: BoardDesign[] = [
  {
    id: "design_grid",
    designName: "Balanced Grid",
    designStyle: "grid",
    previewUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    isActive: true,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "design_collage",
    designName: "Organic Collage",
    designStyle: "collage",
    previewUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
    isActive: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
];

export const mockTimeline: TimelineSnapshot[] = [
  {
    id: "snap_week_1",
    snapshotDate: "2025-01-06",
    snapshotType: "weekly",
    boardImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    narrativeText: "Your first week set the foundation. Career pixels started flowing as you completed onboarding tasks. Health stayed steady with 3 workouts. 42% of your canvas began to glow.",
    animationUrl: null,
    pixelsSummary: {
      totalPixels: 315,
      completionRate: 0.42,
    },
    createdAt: "2025-01-06T23:00:00Z",
  },
  {
    id: "snap_week_2",
    snapshotDate: "2025-01-13",
    snapshotType: "weekly",
    boardImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    narrativeText: "Momentum built this week. You pushed through resistance—Career pixels blazed with 4 major completions. Learning pixels emerged as you started your course. 67% of your board now glows.",
    animationUrl: null,
    pixelsSummary: {
      totalPixels: 503,
      completionRate: 0.67,
    },
    createdAt: "2025-01-13T23:00:00Z",
  },
];

export const mockTomorrowTasks: TomorrowTasksResponse = {
  suggestedTasks: [
    {
      id: "todo_tomorrow_1",
      milestoneId: "mile_1",
      goalId: "goal_career_1",
      domainId: "dom_career",
      title: "Review system design patterns",
      description: "Read Chapter 2 notes",
      scheduledDate: "2025-01-18",
      status: "pending",
      approvedAt: null,
      completedAt: null,
      effortWeight: 1.0,
      createdAt: "2025-01-17T22:00:00Z",
    },
  ],
  context: {
    yesterdayCompletionRate: 0.75,
    energyLevel: 4,
    aiReasoning: "You had great momentum yesterday (75% completion). Maintaining 2-3 tasks keeps progress steady without overwhelming you.",
  },
};

export const mockPixelSummary: PixelSummary = {
  totalPixels: 525,
  byDomain: [
    {
      domainId: "dom_career",
      domainName: "Career",
      colorHex: "#3B82F6",
      totalPixels: 300,
      percentage: 0.57,
    },
    {
      domainId: "dom_health",
      domainName: "Health",
      colorHex: "#10B981",
      totalPixels: 150,
      percentage: 0.29,
    },
    {
      domainId: "dom_learning",
      domainName: "Learning",
      colorHex: "#F59E0B",
      totalPixels: 75,
      percentage: 0.14,
    },
  ],
  byDate: [
    {
      date: "2025-01-13",
      totalPixels: 75,
      byDomain: [
        { domainId: "dom_career", pixels: 50 },
        { domainId: "dom_health", pixels: 25 },
      ],
    },
    {
      date: "2025-01-14",
      totalPixels: 100,
      byDomain: [
        { domainId: "dom_career", pixels: 50 },
        { domainId: "dom_health", pixels: 25 },
        { domainId: "dom_learning", pixels: 25 },
      ],
    },
  ],
};