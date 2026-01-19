# Visual Life Execution System - Frontend Developer Guide

## Executive Summary

A frontend application where users transform life goals into evolving visual art. Users create life domains, set goals, journal daily, and watch their custom vision board progressively colorize based on real effort. The backend handles all business logic, AI processing, and data persistence—your job is to create an intuitive, beautiful interface that makes effort feel rewarding.

---

## 1. TECH STACK

### Required Technologies
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.3+
- **Styling:** Tailwind CSS
- **State Management:** Zustand + React Query (TanStack Query)
- **Canvas/Graphics:** Konva.js or Fabric.js
- **Animations:** Framer Motion
- **Form Handling:** React Hook Form + Zod validation
- **HTTP Client:** Axios (configured with interceptors)

### Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (protected)/
│   │   ├── dashboard/
│   │   ├── domains/
│   │   ├── journal/
│   │   ├── timeline/
│   │   └── settings/
│   └── layout.tsx
├── components/
│   ├── auth/
│   ├── domains/
│   ├── journal/
│   ├── boards/
│   ├── timeline/
│   └── shared/
├── lib/
│   ├── api/               # API client & endpoints
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Zustand stores
│   ├── utils/             # Helper functions
│   └── types/             # TypeScript interfaces
├── public/
└── styles/
```

---

## 2. API CONTRACT & DATA MODELS

### Authentication

#### POST `/auth/register`
**Request:**
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  timezone: string; // e.g., "America/Los_Angeles"
}
```

**Response:**
```typescript
interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    timezone: string;
    createdAt: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
```

**Dummy Data:**
```typescript
const mockAuthResponse: AuthResponse = {
  user: {
    id: "usr_abc123",
    email: "alice@example.com",
    name: "Alice Johnson",
    timezone: "America/New_York",
    createdAt: "2025-01-01T00:00:00Z"
  },
  tokens: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
};
```

#### POST `/auth/login`
**Request:** Same as register (email + password)  
**Response:** Same as register

#### POST `/auth/refresh`
**Request:**
```typescript
interface RefreshRequest {
  refreshToken: string;
}
```
**Response:** Same `tokens` object as register

#### GET `/auth/me`
**Headers:** `Authorization: Bearer {accessToken}`  
**Response:**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  bedtimeReminder: string; // "22:00:00"
  morningReminder: string; // "07:00:00"
  createdAt: string;
}
```

---

### Domains

#### GET `/domains`
**Headers:** `Authorization: Bearer {accessToken}`  
**Response:**
```typescript
interface Domain {
  id: string;
  name: string;
  description: string;
  colorHex: string; // "#3B82F6"
  sortOrder: number;
  images: DomainImage[];
  createdAt: string;
}

interface DomainImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
  uploadedAt: string;
}

type DomainsResponse = Domain[];
```

**Dummy Data:**
```typescript
const mockDomains: Domain[] = [
  {
    id: "dom_career",
    name: "Career",
    description: "Advance to senior engineering role",
    colorHex: "#3B82F6",
    sortOrder: 1,
    images: [
      {
        id: "img_1",
        imageUrl: "https://example.com/career-1.jpg",
        sortOrder: 1,
        uploadedAt: "2025-01-01T10:00:00Z"
      },
      {
        id: "img_2",
        imageUrl: "https://example.com/career-2.jpg",
        sortOrder: 2,
        uploadedAt: "2025-01-01T10:05:00Z"
      }
    ],
    createdAt: "2025-01-01T09:00:00Z"
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
        imageUrl: "https://example.com/health-1.jpg",
        sortOrder: 1,
        uploadedAt: "2025-01-01T11:00:00Z"
      }
    ],
    createdAt: "2025-01-01T09:30:00Z"
  },
  {
    id: "dom_learning",
    name: "Learning",
    description: "Master machine learning fundamentals",
    colorHex: "#F59E0B",
    sortOrder: 3,
    images: [],
    createdAt: "2025-01-01T10:00:00Z"
  }
];
```

#### POST `/domains`
**Request:**
```typescript
interface CreateDomainRequest {
  name: string;
  description: string;
  colorHex?: string; // Optional, backend assigns if missing
}
```

**Response:** Single `Domain` object

#### POST `/domains/:id/images`
**Request:** `multipart/form-data` with file upload  
**Alternative:** Request presigned S3 URL first, then upload directly

**Flow 1 (Direct Upload):**
```typescript
const formData = new FormData();
formData.append('file', fileBlob);
// Response: { imageUrl: string, imageId: string }
```

**Flow 2 (Presigned URL):**
```typescript
// Step 1: GET /domains/:id/upload-url
// Response: { uploadUrl: string, imageKey: string }

// Step 2: PUT to uploadUrl (S3) with file
// Headers: { 'Content-Type': file.type }

// Step 3: POST /domains/:id/images/confirm
// Request: { imageKey: string }
// Response: DomainImage object
```

#### PUT `/domains/:id`
**Request:**
```typescript
interface UpdateDomainRequest {
  name?: string;
  description?: string;
  colorHex?: string;
}
```
**Response:** Updated `Domain` object

#### DELETE `/domains/:id`
**Response:** `{ success: true }`

---

### Goals

#### GET `/goals?domainId={domainId}`
**Response:**
```typescript
interface Goal {
  id: string;
  domainId: string;
  title: string;
  description: string;
  status: "active" | "completed" | "archived";
  startDate: string; // ISO date
  targetDate: string | null;
  milestones: Milestone[];
  createdAt: string;
}

interface Milestone {
  id: string;
  title: string;
  targetDate: string | null;
  completedAt: string | null;
  sortOrder: number;
}

type GoalsResponse = Goal[];
```

**Dummy Data:**
```typescript
const mockGoals: Goal[] = [
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
        sortOrder: 1
      },
      {
        id: "mile_2",
        title: "Lead major project",
        targetDate: "2025-06-30",
        completedAt: null,
        sortOrder: 2
      }
    ],
    createdAt: "2025-01-01T12:00:00Z"
  }
];
```

#### POST `/goals`
**Request:**
```typescript
interface CreateGoalRequest {
  domainId: string;
  title: string;
  description: string;
  targetDate?: string; // ISO date
}
```
**Response:** Single `Goal` object (without milestones initially)

#### POST `/goals/:id/decompose`
**Request:**
```typescript
interface DecomposeRequest {
  // Optional: additional context
  userContext?: string;
}
```

**Response:**
```typescript
interface DecomposeResponse {
  goalId: string;
  milestones: Array<{
    title: string;
    targetDate: string | null;
  }>;
  todos: Array<{
    milestoneTitle: string; // Links to milestone
    title: string;
    description: string;
    estimatedDuration?: string; // "30 minutes"
  }>;
  aiInsights: string; // Explanation from AI
}
```

**Dummy Data:**
```typescript
const mockDecompose: DecomposeResponse = {
  goalId: "goal_career_1",
  milestones: [
    {
      title: "Complete system design course",
      targetDate: "2025-03-31"
    },
    {
      title: "Lead major project",
      targetDate: "2025-06-30"
    },
    {
      title: "Present at tech talk",
      targetDate: "2025-09-30"
    }
  ],
  todos: [
    {
      milestoneTitle: "Complete system design course",
      title: "Enroll in Grokking the System Design course",
      description: "Sign up on Educative platform",
      estimatedDuration: "15 minutes"
    },
    {
      milestoneTitle: "Complete system design course",
      title: "Complete Module 1: Scalability basics",
      description: "Watch videos and complete exercises",
      estimatedDuration: "2 hours"
    },
    {
      milestoneTitle: "Lead major project",
      title: "Identify high-impact project opportunity",
      description: "Discuss with manager during 1-on-1",
      estimatedDuration: "30 minutes"
    }
  ],
  aiInsights: "Breaking your goal into quarterly milestones allows steady progress. Each milestone builds skills needed for promotion: technical depth, leadership, and visibility."
};
```

#### POST `/goals/:id/approve-breakdown`
**Request:**
```typescript
interface ApproveBreakdownRequest {
  milestones: Array<{
    title: string;
    targetDate: string | null;
  }>;
  todos: Array<{
    milestoneIndex: number; // Which milestone this belongs to
    title: string;
    description: string;
    scheduledDate?: string; // ISO date
  }>;
}
```
**Response:** Updated `Goal` object with milestones and todos populated

---

### Todos

#### GET `/todos?goalId={goalId}`
**Response:**
```typescript
interface Todo {
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
  effortWeight: number; // 0.5 to 2.0, default 1.0
  createdAt: string;
}

type TodosResponse = Todo[];
```

**Dummy Data:**
```typescript
const mockTodos: Todo[] = [
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
    createdAt: "2025-01-15T10:00:00Z"
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
    createdAt: "2025-01-15T10:05:00Z"
  }
];
```

#### GET `/todos/today`
**Response:** Array of todos scheduled for today (same `Todo[]` structure)

#### GET `/tasks/tomorrow`
**Response:**
```typescript
interface TomorrowTasksResponse {
  suggestedTasks: Todo[]; // AI-generated, status: "pending"
  context: {
    yesterdayCompletionRate: number; // 0.0 to 1.0
    energyLevel: number; // 1 to 5
    aiReasoning: string; // Why these tasks were suggested
  };
}
```

**Dummy Data:**
```typescript
const mockTomorrowTasks: TomorrowTasksResponse = {
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
      createdAt: "2025-01-17T22:00:00Z"
    },
    {
      id: "todo_tomorrow_2",
      milestoneId: "mile_health_1",
      goalId: "goal_health_1",
      domainId: "dom_health",
      title: "Morning yoga (20 min)",
      description: "Focus on flexibility routine",
      scheduledDate: "2025-01-18",
      status: "pending",
      approvedAt: null,
      completedAt: null,
      effortWeight: 1.0,
      createdAt: "2025-01-17T22:00:00Z"
    }
  ],
  context: {
    yesterdayCompletionRate: 0.75,
    energyLevel: 4,
    aiReasoning: "You had great momentum yesterday (75% completion). Maintaining 2-3 tasks keeps progress steady without overwhelming you. Added yoga since you mentioned feeling energized."
  }
};
```

#### POST `/tasks/validate`
**Request:**
```typescript
interface ValidateTasksRequest {
  approvedTasks: string[]; // Array of todo IDs
  skippedTasks: string[]; // Array of todo IDs
  modifiedTasks?: Array<{
    id: string;
    title?: string;
    description?: string;
    effortWeight?: number;
  }>;
}
```
**Response:** `{ success: true, approvedCount: number }`

---

### Journals

#### GET `/journals/:date`
**Params:** `date` in format `YYYY-MM-DD`  
**Response:**
```typescript
interface Journal {
  id: string;
  userId: string;
  journalDate: string;
  entryText: string;
  emotionalState: string | null; // "motivated", "tired", "frustrated"
  energyLevel: number | null; // 1 to 5
  aiReflection: string | null;
  submittedAt: string;
  completedTasks: Array<{
    todoId: string;
    title: string;
    completed: boolean;
    notes: string | null;
  }>;
}
```

**Dummy Data:**
```typescript
const mockJournal: Journal = {
  id: "jrn_20250117",
  userId: "usr_abc123",
  journalDate: "2025-01-17",
  entryText: "Great day! Finished the project proposal ahead of schedule. Feeling energized and ready to tackle more challenges. Skipped reading because I was too focused on work.",
  emotionalState: "motivated",
  energyLevel: 4,
  aiReflection: "You showed strong focus today, completing high-priority work ahead of schedule. Your energy is high—consider channeling this momentum into learning tomorrow.",
  submittedAt: "2025-01-17T22:30:00Z",
  completedTasks: [
    {
      todoId: "todo_1",
      title: "Finish project proposal",
      completed: true,
      notes: "Submitted 2 days early!"
    },
    {
      todoId: "todo_2",
      title: "Read 30 pages",
      completed: false,
      notes: "Ran out of time"
    }
  ]
};
```

#### POST `/journals`
**Request:**
```typescript
interface CreateJournalRequest {
  journalDate: string; // YYYY-MM-DD
  entryText: string;
  completedTasks: Array<{
    todoId: string;
    completed: boolean;
    notes?: string;
  }>;
}
```

**Response:**
```typescript
interface CreateJournalResponse {
  journal: Journal; // Full journal object with AI reflection
  pixelsEarned: {
    total: number;
    byDomain: Array<{
      domainId: string;
      domainName: string;
      pixels: number;
    }>;
  };
  nextDayTasks: Todo[]; // Preview of tomorrow's AI-generated tasks
}
```

**Dummy Data:**
```typescript
const mockJournalResponse: CreateJournalResponse = {
  journal: mockJournal,
  pixelsEarned: {
    total: 75,
    byDomain: [
      { domainId: "dom_career", domainName: "Career", pixels: 50 },
      { domainId: "dom_health", domainName: "Health", pixels: 25 },
      { domainId: "dom_learning", domainName: "Learning", pixels: 0 }
    ]
  },
  nextDayTasks: [
    /* Tomorrow's suggested tasks */
  ]
};
```

#### GET `/journals?start={YYYY-MM-DD}&end={YYYY-MM-DD}`
**Response:** Array of `Journal` objects

---

### Vision Boards

#### GET `/boards/current`
**Response:**
```typescript
interface VisionBoard {
  id: string;
  userId: string;
  boardType: "weekly" | "monthly" | "quarterly" | "annual";
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  designStyle: string; // "grid", "collage", "cinematic"
  layoutMetadata: {
    domains: Array<{
      domainId: string;
      region: {
        x: number; // 0-100 (percentage)
        y: number; // 0-100 (percentage)
        width: number; // 0-100 (percentage)
        height: number; // 0-100 (percentage)
      };
      pixels: Array<[number, number]>; // [[x, y], ...] in pixel coordinates
    }>;
  };
  baseImageUrl: string; // Grayscale master board
  currentImageUrl: string; // Progressively colored board
  totalPixels: number;
  coloredPixels: number;
  lastUpdated: string;
  createdAt: string;
}
```

**Dummy Data:**
```typescript
const mockBoard: VisionBoard = {
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
        pixels: [[0, 0], [1, 0], [2, 0], /* 2500 total */]
      },
      {
        domainId: "dom_health",
        region: { x: 50, y: 0, width: 50, height: 50 },
        pixels: [[50, 0], [51, 0], /* 2500 total */]
      },
      {
        domainId: "dom_learning",
        region: { x: 0, y: 50, width: 50, height: 50 },
        pixels: [[0, 50], [1, 50], /* 2500 total */]
      }
    ]
  },
  baseImageUrl: "https://cdn.example.com/boards/board_week_3_gray.jpg",
  currentImageUrl: "https://cdn.example.com/boards/board_week_3_colored.jpg",
  totalPixels: 7500,
  coloredPixels: 3200,
  lastUpdated: "2025-01-17T22:30:00Z",
  createdAt: "2025-01-13T00:00:00Z"
};
```

#### POST `/boards/generate`
**Request:**
```typescript
interface GenerateBoardRequest {
  boardType?: "weekly" | "monthly"; // Default: weekly
  periodStart?: string; // ISO date, default: current week
  forceRegenerate?: boolean; // Regenerate even if exists
}
```
**Response:** Single `VisionBoard` object

#### GET `/boards/designs`
**Response:**
```typescript
interface BoardDesign {
  id: string;
  designName: string;
  designStyle: "grid" | "collage" | "cinematic" | "minimalist" | "symmetric";
  previewUrl: string;
  isActive: boolean;
  createdAt: string;
}

type BoardDesignsResponse = BoardDesign[];
```

**Dummy Data:**
```typescript
const mockDesigns: BoardDesign[] = [
  {
    id: "design_grid",
    designName: "Balanced Grid",
    designStyle: "grid",
    previewUrl: "https://cdn.example.com/designs/grid_preview.jpg",
    isActive: true,
    createdAt: "2025-01-01T10:00:00Z"
  },
  {
    id: "design_collage",
    designName: "Organic Collage",
    designStyle: "collage",
    previewUrl: "https://cdn.example.com/designs/collage_preview.jpg",
    isActive: false,
    createdAt: "2025-01-01T10:00:00Z"
  },
  {
    id: "design_cinematic",
    designName: "Cinematic Wide",
    designStyle: "cinematic",
    previewUrl: "https://cdn.example.com/designs/cinematic_preview.jpg",
    isActive: false,
    createdAt: "2025-01-01T10:00:00Z"
  }
];
```

#### POST `/boards/select-design`
**Request:**
```typescript
interface SelectDesignRequest {
  designId: string;
}
```
**Response:** `{ success: true, regenerating: boolean }`

#### GET `/boards/:id/export?resolution={resolution}`
**Params:** `resolution` = `mobile` | `desktop_hd` | `desktop_4k`  
**Response:**
```typescript
interface ExportResponse {
  downloadUrl: string; // S3 signed URL
  resolution: string; // "1170x2532"
  expiresAt: string; // ISO timestamp
}
```

---

### Pixel History

#### GET `/pixels/summary?start={YYYY-MM-DD}&end={YYYY-MM-DD}`
**Response:**
```typescript
interface PixelSummary {
  totalPixels: number;
  byDomain: Array<{
    domainId: string;
    domainName: string;
    colorHex: string;
    totalPixels: number;
    percentage: number; // 0.0 to 1.0
  }>;
  byDate: Array<{
    date: string; // YYYY-MM-DD
    totalPixels: number;
    byDomain: Array<{
      domainId: string;
      pixels: number;
    }>;
  }>;
}
```

**Dummy Data:**
```typescript
const mockPixelSummary: PixelSummary = {
  totalPixels: 525,
  byDomain: [
    {
      domainId: "dom_career",
      domainName: "Career",
      colorHex: "#3B82F6",
      totalPixels: 300,
      percentage: 0.57
    },
    {
      domainId: "dom_health",
      domainName: "Health",
      colorHex: "#10B981",
      totalPixels: 150,
      percentage: 0.29
    },
    {
      domainId: "dom_learning",
      domainName: "Learning",
      colorHex: "#F59E0B",
      totalPixels: 75,
      percentage: 0.14
    }
  ],
  byDate: [
    {
      date: "2025-01-13",
      totalPixels: 75,
      byDomain: [
        { domainId: "dom_career", pixels: 50 },
        { domainId: "dom_health", pixels: 25 }
      ]
    },
    {
      date: "2025-01-14",
      totalPixels: 100,
      byDomain: [
        { domainId: "dom_career", pixels: 50 },
        { domainId: "dom_health", pixels: 25 },
        { domainId: "dom_learning", pixels: 25 }
      ]
    }
    // ... more days
  ]
};
```

---

### Timeline & Wraps

#### GET `/timeline?weeks={count}`
**Params:** `weeks` = number of weeks to fetch (default: 4)  
**Response:**
```typescript
interface TimelineSnapshot {
  id: string;
  snapshotDate: string; // YYYY-MM-DD
  snapshotType: "daily" | "weekly" | "monthly" | "quarterly";
  boardImageUrl: string;
  narrativeText: string | null;
  animationUrl: string | null; // Video URL
  pixelsSummary: {
    totalPixels: number;
    completionRate: number; // 0.0 to 1.0
  };
  createdAt: string;
}

type TimelineResponse = TimelineSnapshot[];
```

**Dummy Data:**
```typescript
const mockTimeline: TimelineSnapshot[] = [
  {
    id: "snap_week_1",
    snapshotDate: "2025-01-06",
    snapshotType: "weekly",
    boardImageUrl: "https://cdn.example.com/snapshots/week_1.jpg",
    narrativeText: "Your first week set the foundation. Career pixels started flowing as you completed onboarding tasks. Health stayed steady with 3 workouts. 42% of your canvas began to glow.",
    animationUrl: "https://cdn.example.com/wraps/week_1.mp4",
    pixelsSummary: {
      totalPixels: 315,
      completionRate: 0.42
    },
    createdAt: "2025-01-06T23:00:00Z"
  },
  {
    id: "snap_week_2",
    snapshotDate: "2025-01-13",
    snapshotType: "weekly",
    boardImageUrl: "https://cdn.example.com/snapshots/week_2.jpg",
    narrativeText: "Momentum built this week. You pushed through resistance—Career pixels blazed with 4 major completions. Learning pixels emerged as you started your course. 67% of your board now glows.",
    animationUrl: "https://cdn.example.com/wraps/week_2.mp4",
    pixelsSummary: {
      totalPixels: 503,
      completionRate: 0.67
    },
    createdAt: "2025-01-13T23:00:00Z"
  }
];
```

#### GET `/wraps/weekly/:date`
**Params:** `date` in format `YYYY-MM-DD` (date of week end)  
**Response:** Single `TimelineSnapshot` object

---

### Settings & Preferences

#### PUT `/preferences/reminders`
**Request:**
```typescript
interface UpdateRemindersRequest {
  bedtimeReminder?: string; // "22:00:00"
  morningReminder?: string; // "07:00:00"
  bedtimeEnabled?: boolean;
  morningEnabled?: boolean;
}
```
**Response:** Updated `User` object

#### GET `/preferences`
**Response:**
```typescript
interface UserPreferences {
  reminders: {
    bedtime: { time: string; enabled: boolean };
    morning: { time: string; enabled: boolean };
  };
  notifications: {
    push: boolean;
    email: boolean;
  };
}
```

---

## 3. FRONTEND COMPONENT ARCHITECTURE

### Authentication Flow

#### Component: `SignUpPage.tsx`
**Location:** `app/(auth)/signup/page.tsx`

**State Management:**
```typescript
// Using React Hook Form + Zod
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  timezone: z.string()
});

type SignupForm = z.infer<typeof signupSchema>;
```

**API Integration:**
```typescript
const { mutate: signup, isPending } = useMutation({
  mutationFn: (data: SignupForm) => api.auth.register(data),
  onSuccess: (response) => {
    // Store tokens in localStorage/cookie
    authStore.setTokens(response.tokens);
    authStore.setUser(response.user);
    router.push('/dashboard');
  },
  onError: (error) => {
    toast.error('Signup failed');
  }
});
```

**UI Elements:**
- Email input with validation
- Password input with strength indicator
- Name input
- Timezone selector (auto-detect + manual override)
- Submit button (loading state during `isPending`)

---

#### Component: `LoginPage.tsx`
**Location:** `app/(auth)/login/page.tsx`

Similar structure to SignupPage, simpler form (email + password only).

---

#### Store: `authStore` (Zustand)
**Location:** `lib/stores/authStore.ts`

```typescript
interface AuthState {
  user: User | null;
  tokens: { accessToken: string; refreshToken: string } | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setTokens: (tokens) => set({ tokens }),
  logout: () => {
    set({ user: null, tokens: null, isAuthenticated: false });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}));
```

---

### Domain Management

#### Component: `DomainList.tsx`
**Location:** `app/(protected)/domains/page.tsx`

**Data Fetching:**
```typescript
const { data: domains, isLoading } = useQuery({
  queryKey: ['domains'],
  queryFn: api.domains.getAll
});
```

**UI Structure:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {domains?.map(domain => (
    <DomainCard key={domain.id} domain={domain} />
  ))}
  <AddDomainCard onClick={() => setShowCreateModal(true)} />
</div>
```

**Features:**
- Display domain cards with images (carousel if multiple)
- Color indicator badge
- Edit/Delete actions (dropdown menu)
- Create new domain button
- Empty state if no domains

---

#### Component: `DomainCard.tsx`
**Location:** `components/domains/DomainCard.tsx`

**Props:**
```typescript
interface DomainCardProps {
  domain: Domain;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

**UI Elements:**
- Image carousel (if multiple images) using Swiper or similar
- Domain name (truncated if long)
- Description preview
- Color indicator dot
- Action menu (3-dot icon)
- Click to navigate to domain detail page

---

#### Component: `DomainEditor.tsx`
**Location:** `components/domains/DomainEditor.tsx`

**Used in:** Modal or dedicated page for create/edit

**Form State:**
```typescript
const domainSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  colorHex: z.string().regex(/^#[0-9A-F]{6}$/i).optional()
});

type DomainForm = z.infer<typeof domainSchema>;
```

**API Integration:**
```typescript
const { mutate: createDomain } = useMutation({
  mutationFn: api.domains.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['domains'] });
    toast.success('Domain created!');
    onClose();
  }
});
```

**UI Elements:**
- Name input
- Description textarea
- Color picker (default palette + custom)
- Image uploader section
- Save/Cancel buttons

---

#### Component: `ImageUploader.tsx`
**Location:** `components/domains/ImageUploader.tsx`

**Props:**
```typescript
interface ImageUploaderProps {
  domainId: string;
  existingImages: DomainImage[];
  maxImages?: number; // Default: 5
  onImagesChange: (images: DomainImage[]) => void;
}
```

**Upload Flow:**
```typescript
const uploadImage = async (file: File) => {
  // Option 1: Direct upload
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.domains.uploadImage(domainId, formData);
  
  // Option 2: Presigned URL
  // const { uploadUrl, imageKey } = await api.domains.getUploadUrl(domainId);
  // await fetch(uploadUrl, { method: 'PUT', body: file });
  // const response = await api.domains.confirmUpload(domainId, imageKey);
  
  return response;
};
```

**UI Elements:**
- Drag-and-drop zone
- File picker button
- Image preview grid
- Delete image button per image
- Upload progress indicator
- Reorder images (drag handles)

---

### Goal Management

#### Component: `GoalList.tsx`
**Location:** `components/domains/GoalList.tsx`

**Props:**
```typescript
interface GoalListProps {
  domainId: string;
}
```

**Data Fetching:**
```typescript
const { data: goals } = useQuery({
  queryKey: ['goals', domainId],
  queryFn: () => api.goals.getByDomain(domainId)
});
```

**UI Structure:**
```tsx
<div className="space-y-4">
  {goals?.map(goal => (
    <GoalCard key={goal.id} goal={goal} />
  ))}
  <Button onClick={() => setShowCreateGoal(true)}>
    + Add Goal
  </Button>
</div>
```

---

#### Component: `GoalCard.tsx`
**Location:** `components/goals/GoalCard.tsx`

**Props:**
```typescript
interface GoalCardProps {
  goal: Goal;
  expanded?: boolean;
}
```

**UI Elements:**
- Goal title and description
- Status badge (active/completed/archived)
- Progress bar (based on milestones)
- Milestone list (collapsible)
- Target date
- Edit/Archive actions
- "Decompose with AI" button (if no milestones)

---

#### Component: `GoalDecomposer.tsx`
**Location:** `components/goals/GoalDecomposer.tsx`

**Props:**
```typescript
interface GoalDecomposerProps {
  goalId: string;
  onComplete: () => void;
}
```

**Flow:**
```typescript
const [step, setStep] = useState<'loading' | 'review' | 'editing'>('loading');
const [breakdown, setBreakdown] = useState<DecomposeResponse | null>(null);

// Step 1: Request AI decomposition
const { mutate: decompose } = useMutation({
  mutationFn: () => api.goals.decompose(goalId),
  onSuccess: (data) => {
    setBreakdown(data);
    setStep('review');
  }
});

// Step 2: Review and edit suggestions
const editMilestone = (index: number, updates: Partial<Milestone>) => {
  // Update local state
};

// Step 3: Approve and save
const { mutate: approveBreakdown } = useMutation({
  mutationFn: (data: ApproveBreakdownRequest) => 
    api.goals.approveBreakdown(goalId, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['goals'] });
    onComplete();
  }
});
```

**UI Elements:**

**Loading State:**
- Animated spinner with AI-themed messaging
- "AI is analyzing your goal..."

**Review State:**
- AI insights text box
- Milestones list (editable)
  - Each milestone: title, target date, edit/delete buttons
- Todos grouped under milestones
  - Each todo: title, description, estimated duration
  - Drag to reorder
- "Looks good" / "Let me edit" buttons

**Editing State:**
- Inline editing for all fields
- Add/remove milestones and todos
- "Save changes" button

---

### Daily Journal

#### Component: `JournalEditor.tsx`
**Location:** `app/(protected)/journal/page.tsx`

**State Management:**
```typescript
const [journalText, setJournalText] = useState('');
const [taskCompletions, setTaskCompletions] = useState<Map<string, boolean>>(new Map());

const { data: todayTasks } = useQuery({
  queryKey: ['todos', 'today'],
  queryFn: api.todos.getToday
});
```

**Submit Flow:**
```typescript
const { mutate: submitJournal, isPending } = useMutation({
  mutationFn: (data: CreateJournalRequest) => api.journals.create(data),
  onSuccess: (response) => {
    // Show pixel animation
    setShowPixelAnimation(true);
    setPixelsEarned(response.pixelsEarned);
    
    // Preview tomorrow's tasks
    setTomorrowTasks(response.nextDayTasks);
    
    // Invalidate queries
    queryClient.invalidateQueries({ queryKey: ['boards'] });
    queryClient.invalidateQueries({ queryKey: ['pixels'] });
  }
});

const handleSubmit = () => {
  const completedTasks = Array.from(taskCompletions.entries()).map(([todoId, completed]) => ({
    todoId,
    completed,
    notes: null // Optional: add notes field
  }));
  
  submitJournal({
    journalDate: format(new Date(), 'yyyy-MM-dd'),
    entryText: journalText,
    completedTasks
  });
};
```

**UI Structure:**
```tsx
<div className="max-w-3xl mx-auto p-6">
  {/* Header */}
  <h1>How was today?</h1>
  <p className="text-gray-500">
    {format(new Date(), 'EEEE, MMMM d, yyyy')}
  </p>
  
  {/* Journal Entry */}
  <textarea
    value={journalText}
    onChange={(e) => setJournalText(e.target.value)}
    placeholder="Reflect on your day..."
    className="w-full h-48 p-4 border rounded-lg"
  />
  
  {/* Suggested Prompts */}
  <div className="text-sm text-gray-400 mt-2">
    <p>• What did you complete?</p>
    <p>• What challenged you?</p>
    <p>• How do you feel about tomorrow?</p>
  </div>
  
  {/* Today's Tasks */}
  <div className="mt-8">
    <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
    {todayTasks?.map(task => (
      <TaskCheckbox
        key={task.id}
        task={task}
        checked={taskCompletions.get(task.id) ?? false}
        onChange={(checked) => {
          setTaskCompletions(prev => new Map(prev).set(task.id, checked));
        }}
      />
    ))}
  </div>
  
  {/* Submit Button */}
  <Button
    onClick={handleSubmit}
    disabled={isPending || !journalText.trim()}
    className="w-full mt-6"
  >
    {isPending ? 'Saving...' : 'Save Journal'}
  </Button>
</div>

{/* Pixel Animation Modal */}
{showPixelAnimation && (
  <PixelEarnedAnimation
    pixels={pixelsEarned}
    onComplete={() => setShowPixelAnimation(false)}
  />
)}
```

---

#### Component: `PixelEarnedAnimation.tsx`
**Location:** `components/journal/PixelEarnedAnimation.tsx`

**Props:**
```typescript
interface PixelEarnedAnimationProps {
  pixels: {
    total: number;
    byDomain: Array<{
      domainId: string;
      domainName: string;
      pixels: number;
    }>;
  };
  onComplete: () => void;
}
```

**Animation Sequence:**
```typescript
// Using Framer Motion
const sequence = [
  { scale: 0, opacity: 0 }, // Initial
  { scale: 1.2, opacity: 1, transition: { duration: 0.3 } }, // Pop in
  { scale: 1, transition: { duration: 0.2 } } // Settle
];
```

**UI Elements:**
- Full-screen overlay (semi-transparent background)
- Centered card with pixel counts
- Domain breakdown with colored badges
- Animated numbers counting up
- Confetti animation (react-confetti)
- "View Board" button (closes modal and navigates)

---

### Morning Task Validator

#### Component: `MorningValidator.tsx`
**Location:** `app/(protected)/tasks/validate/page.tsx`

**Data Fetching:**
```typescript
const { data: tomorrowData } = useQuery({
  queryKey: ['tasks', 'tomorrow'],
  queryFn: api.tasks.getTomorrow
});

const [approvedTasks, setApprovedTasks] = useState<Set<string>>(new Set());
const [skippedTasks, setSkippedTasks] = useState<Set<string>>(new Set());
```

**Validation Flow:**
```typescript
const { mutate: validateTasks } = useMutation({
  mutationFn: (data: ValidateTasksRequest) => api.tasks.validate(data),
  onSuccess: () => {
    toast.success('Your day is ready!');
    router.push('/dashboard');
  }
});

const handleStartDay = () => {
  const approved = Array.from(approvedTasks);
  const skipped = Array.from(skippedTasks);
  
  validateTasks({ approvedTasks: approved, skippedTasks: skipped });
};
```

**UI Structure:**
```tsx
<div className="max-w-4xl mx-auto p-6">
  {/* Header with AI Context */}
  <div className="bg-blue-50 p-4 rounded-lg mb-6">
    <p className="text-sm text-gray-600">
      Based on yesterday ({tomorrowData?.context.yesterdayCompletionRate}% completion):
    </p>
    <p className="mt-2">{tomorrowData?.context.aiReasoning}</p>
  </div>
  
  {/* Tasks by Domain */}
  {groupBy(tomorrowData?.suggestedTasks, 'domainId').map(([domainId, tasks]) => (
    <div key={domainId} className="mb-6">
      <h2 className="text-lg font-semibold mb-3">
        {getDomainName(domainId)}
      </h2>
      
      {tasks.map(task => (
        <TaskValidationCard
          key={task.id}
          task={task}
          onAccept={() => setApprovedTasks(prev => new Set(prev).add(task.id))}
          onSkip={() => setSkippedTasks(prev => new Set(prev).add(task.id))}
          onAdjust={() => openAdjustDialog(task)}
        />
      ))}
    </div>
  ))}
  
  {/* Start Day Button */}
  <Button
    onClick={handleStartDay}
    className="w-full mt-8"
    size="lg"
  >
    Start My Day
  </Button>
</div>
```

---

#### Component: `TaskValidationCard.tsx`
**Location:** `components/tasks/TaskValidationCard.tsx`

**Props:**
```typescript
interface TaskValidationCardProps {
  task: Todo;
  onAccept: () => void;
  onSkip: () => void;
  onAdjust: () => void;
}
```

**UI Elements:**
- Task title and description
- Estimated effort (based on effortWeight)
- Action buttons:
  - ✓ Accept (green)
  - ⏭ Skip today (gray)
  - ✏ Adjust (blue)
- Visual state indicator (accepted/skipped/pending)

---

### Vision Board Display

#### Component: `VisionBoard.tsx`
**Location:** `app/(protected)/dashboard/page.tsx`

**Data Fetching:**
```typescript
const { data: currentBoard, isLoading } = useQuery({
  queryKey: ['boards', 'current'],
  queryFn: api.boards.getCurrent,
  refetchInterval: 5000 // Auto-refresh every 5s during active journaling
});

const { data: pixelSummary } = useQuery({
  queryKey: ['pixels', 'summary'],
  queryFn: () => api.pixels.getSummary({
    start: currentBoard?.periodStart,
    end: currentBoard?.periodEnd
  }),
  enabled: !!currentBoard
});
```

**UI Structure:**
```tsx
<div className="space-y-6">
  {/* Board Header */}
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold">Your Vision Board</h1>
      <p className="text-gray-500">
        Week of {format(parseISO(currentBoard?.periodStart), 'MMM d')} - 
        {format(parseISO(currentBoard?.periodEnd), 'MMM d')}
      </p>
    </div>
    
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => setShowDesignSelector(true)}>
        Change Design
      </Button>
      <Button variant="outline" onClick={handleExport}>
        Export Wallpaper
      </Button>
    </div>
  </div>
  
  {/* Board Display */}
  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
    {isLoading ? (
      <Skeleton className="w-full h-full" />
    ) : (
      <img
        src={currentBoard?.currentImageUrl}
        alt="Vision Board"
        className="w-full h-full object-cover"
      />
    )}
    
    {/* Progress Overlay */}
    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg">
      <p className="text-sm font-medium">
        {currentBoard?.coloredPixels} / {currentBoard?.totalPixels} pixels
      </p>
      <div className="w-48 h-2 bg-gray-200 rounded-full mt-1">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{
            width: `${(currentBoard?.coloredPixels / currentBoard?.totalPixels) * 100}%`
          }}
        />
      </div>
    </div>
  </div>
  
  {/* Domain Breakdown */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {pixelSummary?.byDomain.map(domain => (
      <DomainProgressCard key={domain.domainId} domain={domain} />
    ))}
  </div>
</div>
```

---

#### Component: `BoardCanvas.tsx` (Advanced Version)
**Location:** `components/boards/BoardCanvas.tsx`

**For Progressive Coloring Animation:**

If you want to show real-time pixel coloring (not just image replacement), use HTML Canvas:

```typescript
import { useEffect, useRef } from 'react';

interface BoardCanvasProps {
  board: VisionBoard;
  animateNewPixels?: boolean;
}

export const BoardCanvas: React.FC<BoardCanvasProps> = ({ board, animateNewPixels }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Load base grayscale image
    const baseImg = new Image();
    baseImg.src = board.baseImageUrl;
    baseImg.onload = () => {
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
      
      // Load colored image
      const colorImg = new Image();
      colorImg.src = board.currentImageUrl;
      colorImg.onload = () => {
        // Draw colored pixels on top using board.layoutMetadata
        board.layoutMetadata.domains.forEach(domain => {
          // For each colored pixel coordinate, draw from color image
          // This is simplified - actual implementation would use pixel data
        });
      };
    };
  }, [board]);
  
  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      className="w-full h-full"
    />
  );
};
```

**Note:** For MVP, simple image display is sufficient. Canvas-based progressive coloring is Phase 2 enhancement.

---

#### Component: `DesignSelector.tsx`
**Location:** `components/boards/DesignSelector.tsx`

**Data Fetching:**
```typescript
const { data: designs } = useQuery({
  queryKey: ['board-designs'],
  queryFn: api.boards.getDesigns
});

const { mutate: selectDesign } = useMutation({
  mutationFn: (designId: string) => api.boards.selectDesign({ designId }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['boards'] });
    toast.success('Design updated! Regenerating your board...');
    onClose();
  }
});
```

**UI Structure:**
```tsx
<Modal open={open} onClose={onClose}>
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Choose Your Board Design</h2>
    
    <div className="grid grid-cols-2 gap-4">
      {designs?.map(design => (
        <div
          key={design.id}
          onClick={() => selectDesign(design.id)}
          className={cn(
            "cursor-pointer border-2 rounded-lg overflow-hidden transition",
            design.isActive ? "border-blue-500" : "border-gray-200 hover:border-gray-400"
          )}
        >
          <img
            src={design.previewUrl}
            alt={design.designName}
            className="w-full aspect-video object-cover"
          />
          <div className="p-3">
            <p className="font-medium">{design.designName}</p>
            <p className="text-sm text-gray-500">{design.designStyle}</p>
          </div>
          {design.isActive && (
            <div className="bg-blue-500 text-white text-xs px-2 py-1">
              Active
            </div>
          )}
        </div>
      ))}
    </div>
    
    <Button
      variant="outline"
      onClick={() => selectDesign('regenerate')}
      className="w-full mt-4"
    >
      Generate New Designs
    </Button>
  </div>
</Modal>
```

---

### Timeline & Journey View

#### Component: `TimelineView.tsx`
**Location:** `app/(protected)/timeline/page.tsx`

**Data Fetching:**
```typescript
const [weeksToShow, setWeeksToShow] = useState(8);

const { data: timeline } = useQuery({
  queryKey: ['timeline', weeksToShow],
  queryFn: () => api.timeline.get({ weeks: weeksToShow })
});
```

**UI Structure:**
```tsx
<div className="p-6">
  <h1 className="text-3xl font-bold mb-6">Your Journey</h1>
  
  {/* Timeline Scroll */}
  <div className="relative">
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
      {timeline?.map((snapshot, index) => (
        <WeekCard
          key={snapshot.id}
          snapshot={snapshot}
          index={index}
          onClick={() => setSelectedSnapshot(snapshot)}
        />
      ))}
    </div>
  </div>
  
  {/* Load More */}
  <Button
    variant="ghost"
    onClick={() => setWeeksToShow(prev => prev + 4)}
    className="mt-4"
  >
    Load Earlier Weeks
  </Button>
  
  {/* Selected Snapshot Modal */}
  {selectedSnapshot && (
    <SnapshotDetailModal
      snapshot={selectedSnapshot}
      onClose={() => setSelectedSnapshot(null)}
    />
  )}
</div>
```

---

#### Component: `WeekCard.tsx`
**Location:** `components/timeline/WeekCard.tsx`

**Props:**
```typescript
interface WeekCardProps {
  snapshot: TimelineSnapshot;
  index: number;
  onClick: () => void;
}
```

**UI Elements:**
```tsx
<div
  onClick={onClick}
  className="flex-shrink-0 w-80 cursor-pointer snap-center"
>
  {/* Week Image */}
  <div className="relative aspect-video rounded-lg overflow-hidden">
    <img
      src={snapshot.boardImageUrl}
      alt={`Week ${index + 1}`}
      className="w-full h-full object-cover"
    />
    
    {/* Completion Badge */}
    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-sm font-medium">
      {Math.round(snapshot.pixelsSummary.completionRate * 100)}%
    </div>
  </div>
  
  {/* Week Info */}
  <div className="mt-3">
    <p className="font-semibold">
      Week of {format(parseISO(snapshot.snapshotDate), 'MMM d')}
    </p>
    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
      {snapshot.narrativeText}
    </p>
    <p className="text-xs text-gray-400 mt-2">
      {snapshot.pixelsSummary.totalPixels} pixels earned
    </p>
  </div>
</div>
```

---

#### Component: `SnapshotDetailModal.tsx`
**Location:** `components/timeline/SnapshotDetailModal.tsx`

**Props:**
```typescript
interface SnapshotDetailModalProps {
  snapshot: TimelineSnapshot;
  onClose: () => void;
}
```

**UI Structure:**
```tsx
<Modal open={true} onClose={onClose} size="large">
  <div className="p-6">
    {/* Header */}
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-2xl font-bold">
          Week of {format(parseISO(snapshot.snapshotDate), 'MMMM d, yyyy')}
        </h2>
        <p className="text-gray-500 mt-1">
          {snapshot.pixelsSummary.totalPixels} pixels • 
          {Math.round(snapshot.pixelsSummary.completionRate * 100)}% complete
        </p>
      </div>
      <Button variant="ghost" onClick={onClose}>×</Button>
    </div>
    
    {/* Video Player (if available) */}
    {snapshot.animationUrl && (
      <div className="mb-6">
        <video
          src={snapshot.animationUrl}
          controls
          autoPlay
          className="w-full rounded-lg"
        />
      </div>
    )}
    
    {/* Board Image (if no video) */}
    {!snapshot.animationUrl && (
      <img
        src={snapshot.boardImageUrl}
        alt="Week snapshot"
        className="w-full rounded-lg mb-6"
      />
    )}
    
    {/* Narrative */}
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <p className="text-lg leading-relaxed">{snapshot.narrativeText}</p>
    </div>
    
    {/* Actions */}
    <div className="flex gap-3">
      <Button variant="outline" onClick={handleShare}>
        Share This Week
      </Button>
      <Button variant="outline" onClick={handleDownload}>
        Download Video
      </Button>
    </div>
  </div>
</Modal>
```

---

## 4. STATE MANAGEMENT ARCHITECTURE

### Zustand Stores

#### `authStore.ts`
Already covered above - manages user auth state.

#### `domainsStore.ts`
```typescript
interface DomainsState {
  domains: Domain[];
  activeDomainId: string | null;
  setDomains: (domains: Domain[]) => void;
  setActiveDomain: (id: string) => void;
  addDomain: (domain: Domain) => void;
  updateDomain: (id: string, updates: Partial<Domain>) => void;
  removeDomain: (id: string) => void;
}

export const useDomainsStore = create<DomainsState>((set) => ({
  domains: [],
  activeDomainId: null,
  setDomains: (domains) => set({ domains }),
  setActiveDomain: (id) => set({ activeDomainId: id }),
  addDomain: (domain) => set((state) => ({ 
    domains: [...state.domains, domain] 
  })),
  updateDomain: (id, updates) => set((state) => ({
    domains: state.domains.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  removeDomain: (id) => set((state) => ({
    domains: state.domains.filter(d => d.id !== id)
  }))
}));
```

#### `journalStore.ts`
```typescript
interface JournalState {
  currentJournal: Journal | null;
  isSubmitting: boolean;
  showPixelAnimation: boolean;
  pixelsEarned: CreateJournalResponse['pixelsEarned'] | null;
  setCurrentJournal: (journal: Journal | null) => void;
  setShowPixelAnimation: (show: boolean) => void;
  setPixelsEarned: (pixels: CreateJournalResponse['pixelsEarned']) => void;
}
```

### React Query Setup

#### `queryClient.ts`
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 0
    }
  }
});
```

#### Query Keys Convention
```typescript
// Centralized query keys
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const
  },
  domains: {
    all: ['domains'] as const,
    detail: (id: string) => ['domains', id] as const
  },
  goals: {
    all: ['goals'] as const,
    byDomain: (domainId: string) => ['goals', domainId] as const,
    detail: (id: string) => ['goals', id] as const
  },
  todos: {
    all: ['todos'] as const,
    today: ['todos', 'today'] as const,
    tomorrow: ['tasks', 'tomorrow'] as const,
    byGoal: (goalId: string) => ['todos', goalId] as const
  },
  boards: {
    current: ['boards', 'current'] as const,
    designs: ['board-designs'] as const,
    byId: (id: string) => ['boards', id] as const
  },
  pixels: {
    summary: (start?: string, end?: string) => ['pixels', 'summary', start, end] as const
  },
  timeline: {
    weeks: (count: number) => ['timeline', count] as const,
    wrap: (date: string) => ['wraps', 'weekly', date] as const
  }
};
```

---

## 5. API CLIENT ARCHITECTURE

### Base API Client Setup

Create a centralized API client with automatic token refresh and error handling.

**Location:** `lib/api/client.ts`

**Key Features:**
- Axios instance with base URL from environment variables
- Request interceptor to attach auth token from localStorage
- Response interceptor for token refresh on 401 errors
- Centralized error handling and logging
- Type-safe request/response using TypeScript generics

**Token Refresh Flow:**
When a request fails with 401, automatically call the refresh endpoint, update tokens, and retry the original request once.

---

### API Modules

Organize API calls by domain:

**Structure:**
```
lib/api/
├── client.ts          # Base axios instance
├── auth.ts            # Authentication endpoints
├── domains.ts         # Domain CRUD
├── goals.ts           # Goal management
├── todos.ts           # Todo operations
├── journals.ts        # Journal submissions
├── boards.ts          # Vision boards
├── timeline.ts        # Timeline & wraps
├── preferences.ts     # User settings
└── index.ts           # Export all modules
```

Each module exports typed functions that return promises with proper TypeScript interfaces.

---

## 6. ROUTING STRUCTURE

### App Router Pages

**Public Routes:**
- `/` - Landing page (marketing)
- `/login` - Login page
- `/signup` - Registration page

**Protected Routes (require authentication):**
- `/dashboard` - Main dashboard with current vision board
- `/domains` - Domain management (list, create, edit)
- `/domains/[id]` - Individual domain detail with goals
- `/journal` - Daily journal entry form
- `/journal/history` - Past journal entries
- `/tasks/validate` - Morning task validation
- `/timeline` - Journey view with weekly wraps
- `/settings` - User preferences and account settings
- `/settings/reminders` - Reminder configuration

**Middleware:**
Create middleware to protect routes and redirect unauthenticated users to login.

---

## 7. KEY USER FLOWS - FRONTEND PERSPECTIVE

### Flow 1: First-Time User Onboarding

**Pages Sequence:**
1. **Signup Page** → Create account, set timezone
2. **Welcome Modal** → Explain philosophy ("Your effort becomes art")
3. **Domain Creation** → Create 3-5 life domains (Career, Health, etc.)
4. **Image Upload** → Add 1-5 inspirational images per domain
5. **Design Selection** → Choose from 5-7 AI-generated board layouts
6. **Goal Setup** → Define first goals with AI assistance
7. **First Week Preview** → See grayscale board, set reminders
8. **Dashboard** → Land on main dashboard

**Frontend Responsibilities:**
- Wizard-style multi-step form with progress indicator
- Validate each step before proceeding
- Show preview of what's being created
- Store partial progress in localStorage (in case user refreshes)
- Smooth transitions between steps using Framer Motion

---

### Flow 2: Daily Evening Routine (Journal Entry)

**Trigger:** User opens app around bedtime (or clicks notification)

**Steps:**
1. Navigate to `/journal`
2. See today's date and empty text area
3. See list of today's scheduled tasks with checkboxes
4. Write journal entry (free-form text)
5. Check off completed tasks
6. Submit journal
7. **Animation:** Pixels earned popup with confetti
8. **Preview:** Tomorrow's AI-generated tasks shown
9. **Redirect:** Option to view updated board or return to dashboard

**Frontend Considerations:**
- Auto-save draft to localStorage every 30 seconds
- Show character count or word count (optional)
- Disable submit if entry is empty
- Handle network errors gracefully (retry mechanism)
- Pixel animation should be delightful but skippable

---

### Flow 3: Morning Task Validation

**Trigger:** User opens app in morning (or clicks notification)

**Steps:**
1. Navigate to `/tasks/validate`
2. See AI context box explaining why these tasks were chosen
3. Review each task grouped by domain
4. For each task, choose:
   - **Accept** (checkmark)
   - **Skip today** (no penalty, rolls forward)
   - **Adjust** (edit title, duration, or discuss with AI)
5. Click "Start My Day" to finalize
6. Tasks become "approved" and appear in tonight's journal

**Frontend Considerations:**
- Tasks should be clearly grouped by domain with color coding
- Accept/skip actions should give immediate visual feedback
- "Adjust" opens inline edit or modal with AI chat
- Disable "Start My Day" until all tasks are reviewed (accepted or skipped)
- Show summary count: "3 tasks accepted, 1 skipped"

---

### Flow 4: Viewing Progress Timeline

**Steps:**
1. Navigate to `/timeline`
2. See horizontal scrollable timeline of weekly cards
3. Each card shows: week date, board snapshot, completion %, narrative preview
4. Click any week to expand into full-screen modal
5. Modal shows:
   - Animated video (if available) of pixel progression
   - Full narrative text
   - Detailed stats
   - Share/download options
6. Close modal to return to timeline
7. Scroll to load earlier weeks (infinite scroll)

**Frontend Considerations:**
- Use horizontal scroll with snap points for smooth navigation
- Lazy load images as they come into viewport
- Video should autoplay when modal opens
- Download creates signed S3 URL and triggers browser download
- Share generates shareable link or opens native share sheet on mobile

---

### Flow 5: Changing a Goal (No Reset)

**Trigger:** User wants to switch from "Run marathon" to "Build strength"

**Steps:**
1. Navigate to domain detail page
2. Click "Edit" on existing goal
3. Change goal title and description
4. Add context in "What changed?" field
5. Click "Preview Transition"
6. See side-by-side comparison:
   - **Old goal:** Locked pixels (faded/labeled as archived)
   - **New goal:** Fresh grayscale area added to board
   - **AI narrative:** Transition story explaining the change
7. Confirm change
8. Board regenerates with old progress preserved, new area added

**Frontend Considerations:**
- Show clear visual distinction between archived and active goals
- Preview should accurately represent board changes
- Narrative should be prominently displayed (human-readable)
- Confirmation dialog prevents accidental changes
- After confirmation, show loading state while backend regenerates board

---

## 8. RESPONSIVE DESIGN REQUIREMENTS

### Breakpoints
- **Mobile:** < 768px (single column, touch-optimized)
- **Tablet:** 768px - 1024px (2-column layouts)
- **Desktop:** > 1024px (3-column layouts, expanded views)

### Mobile-Specific Considerations

**Dashboard:**
- Board image should be full-width on mobile
- Domain cards stack vertically
- Quick actions accessible via bottom navigation

**Journal Entry:**
- Full-screen on mobile for distraction-free writing
- Floating action button for submit
- Task checklist collapsible to save space

**Timeline:**
- Horizontal scroll remains (natural swipe gesture)
- Week cards smaller but still readable
- Tap to expand (not click)

**Task Validation:**
- One task per screen on mobile (vertical scroll or swipe)
- Large, thumb-friendly buttons
- Bottom sheet for "Adjust" actions

---

## 9. PERFORMANCE OPTIMIZATION

### Image Optimization
- Use Next.js Image component for automatic optimization
- Lazy load board images below the fold
- Serve WebP format with JPEG fallback
- Implement progressive image loading (blur placeholder)

### Data Fetching Strategy
- Use React Query's staleTime to avoid unnecessary refetches
- Prefetch next page data on timeline scroll
- Cache static data (domains, designs) aggressively
- Invalidate queries surgically (only what changed)

### Bundle Size
- Code-split by route (automatic with Next.js App Router)
- Lazy load heavy components (video player, canvas renderer)
- Tree-shake unused dependencies
- Use dynamic imports for modals and dialogs

### Animation Performance
- Use CSS transforms for animations (GPU-accelerated)
- Limit Framer Motion animations to essential interactions
- Debounce user inputs (journal auto-save, search)
- Use requestAnimationFrame for canvas rendering

---

## 10. ERROR HANDLING & EDGE CASES

### Network Errors
- Show toast notification for failed API calls
- Provide retry button for critical actions
- Save form data to localStorage before submission
- Display offline banner when network unavailable

### Validation Errors
- Show inline validation errors on forms
- Highlight required fields that are empty
- Prevent submission until all errors resolved
- Use Zod for consistent validation between frontend and backend expectations

### Empty States
- **No domains:** Show onboarding prompt to create first domain
- **No goals:** Encourage user to set goals with AI assistance
- **No journal entries:** Show welcome message explaining journaling
- **No timeline data:** Display placeholder for first few weeks

### Loading States
- Skeleton screens for list views
- Spinners for single-item fetches
- Progress bars for uploads
- Shimmer effects for images loading

---

## 11. ACCESSIBILITY REQUIREMENTS

### Keyboard Navigation
- All interactive elements focusable with Tab
- Modal dialogs trap focus
- Close dialogs with Escape key
- Submit forms with Enter key

### Screen Reader Support
- Proper semantic HTML (headings, lists, forms)
- ARIA labels for icon-only buttons
- Live regions for dynamic content (pixel counts, notifications)
- Alt text for all images (vision board descriptions)

### Color Contrast
- Maintain WCAG AA standards (4.5:1 for text)
- Don't rely solely on color for information
- Provide text labels alongside color indicators
- Support both light and dark modes

### Touch Targets
- Minimum 44x44px for mobile tap targets
- Adequate spacing between interactive elements
- Swipe gestures have clear visual affordances
- Long-press actions have haptic feedback (if available)

---

## 12. TESTING STRATEGY

### Unit Tests
- Test utility functions (date formatting, pixel calculations)
- Test form validation schemas
- Test state management logic (Zustand stores)
- Test API client error handling

### Component Tests
- Test user interactions (button clicks, form submissions)
- Test conditional rendering (loading, error, success states)
- Test prop variations
- Test accessibility features

### Integration Tests
- Test complete user flows (signup → onboarding → dashboard)
- Test API integration with mocked responses
- Test navigation between pages
- Test protected route redirects

### End-to-End Tests
Use Playwright or Cypress for critical paths:
- Complete onboarding flow
- Submit journal and see pixel update
- Validate morning tasks
- View timeline

---

## 13. ENVIRONMENT CONFIGURATION

### Required Environment Variables

**Development (.env.local):**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_CDN_URL=http://localhost:9000
NEXT_PUBLIC_ENV=development
```

**Production (.env.production):**
```
NEXT_PUBLIC_API_BASE_URL=https://api.visionlife.app/api
NEXT_PUBLIC_CDN_URL=https://cdn.visionlife.app
NEXT_PUBLIC_ENV=production
```

**All Environments:**
- Auth token storage key names
- Query cache settings
- Image upload size limits
- Video player configuration

---

## 14. DEPLOYMENT CHECKLIST

### Pre-Deployment
- Run build locally to catch errors
- Test with production API endpoint
- Verify all environment variables set
- Check bundle size (should be < 500KB initial)
- Run accessibility audit (Lighthouse)
- Test on mobile devices (iOS Safari, Android Chrome)

### Deployment
- Deploy to Vercel or similar platform
- Set up CDN for static assets
- Configure caching headers
- Set up error tracking (Sentry)
- Configure analytics (Google Analytics or PostHog)

### Post-Deployment
- Smoke test critical flows in production
- Monitor error rates in first 24 hours
- Check API response times
- Verify image loading from CDN
- Test push notifications (if implemented)

---

## 15. DEVELOPER WORKFLOW

### Getting Started
1. Clone repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Update API URL to point to local backend or staging
5. Run development server: `npm run dev`
6. Open browser to `http://localhost:3000`

### Development Loop
1. Pick a feature from backlog
2. Create feature branch
3. Implement component with TypeScript types
4. Test with mock data first
5. Integrate with real API endpoint
6. Handle loading/error states
7. Write basic component tests
8. Create PR with screenshots/videos
9. Code review and merge
10. Deploy to staging for QA

### Code Style
- Use ESLint and Prettier (enforce with pre-commit hooks)
- Follow component naming conventions (PascalCase)
- Keep components small and focused (< 200 lines)
- Extract reusable logic to custom hooks
- Document complex logic with inline comments
- Use TypeScript strictly (no `any` types)

---

## 16. THIRD-PARTY INTEGRATIONS

### Required Libraries
- **next**: Framework
- **react**: UI library
- **typescript**: Type safety
- **tailwindcss**: Styling
- **zustand**: State management
- **@tanstack/react-query**: Server state
- **axios**: HTTP client
- **react-hook-form**: Form handling
- **zod**: Validation
- **framer-motion**: Animations
- **date-fns**: Date utilities
- **lucide-react**: Icons

### Optional Enhancements
- **react-confetti**: Celebration animations
- **swiper**: Image carousels
- **recharts**: Charts/graphs for analytics
- **react-dropzone**: File uploads
- **react-toastify**: Notifications
- **next-pwa**: Progressive web app support

---

## 17. COMMON PITFALLS TO AVOID

**1. Not Handling Loading States**
Always show skeleton or spinner when data is loading. Never leave users staring at blank screen.

**2. Overfetching Data**
Use React Query's selective invalidation. Don't refetch everything on every action.

**3. Poor Mobile Experience**
Test on real devices, not just browser dev tools. Touch targets and scroll behavior matter.

**4. Blocking UI During Operations**
Show optimistic updates where possible. Don't freeze interface while waiting for API.

**5. Ignoring Accessibility**
Use semantic HTML and ARIA from the start. Retrofitting accessibility is painful.

**6. Hardcoding Values**
Use environment variables for URLs, keys, and configuration. Makes deployment easier.

**7. Not Validating User Input**
Validate on frontend AND backend. Use same schemas (Zod) for consistency.

**8. Memory Leaks**
Clean up subscriptions, timers, and event listeners in useEffect cleanup.

**9. Prop Drilling**
Use context or state management for deeply nested props. Don't pass through 5+ levels.

**10. Poor Error Messages**
Show user-friendly messages, not raw error codes. "Failed to save journal" not "500 Internal Server Error".

---

## 18. PROGRESSIVE ENHANCEMENT ROADMAP

### Phase 1: MVP (Core Features)
- Authentication and user management
- Domain and goal creation
- Daily journal with task tracking
- Basic vision board display (image-based)
- Weekly timeline view
- Morning task validation

### Phase 2: Visual Polish
- Multiple board design styles
- Pixel animation improvements
- Weekly wrap videos (server-rendered)
- Export wallpapers
- Enhanced timeline with filters

### Phase 3: Advanced Features
- Canvas-based progressive pixel coloring (real-time)
- AI chat for goal coaching
- Social sharing
- Mobile app (React Native)
- Offline support with sync

### Phase 4: Premium Features
- Custom board designs
- Advanced analytics dashboard
- Community goal templates
- Habit tracking integration
- Multi-language support

---

## 19. MONITORING & ANALYTICS

### Key Metrics to Track
- **Engagement:** Daily/weekly active users
- **Retention:** 7-day and 30-day retention rates
- **Core Loops:** Journal submission rate, task validation rate
- **Performance:** Page load times, API response times
- **Errors:** Error rates by endpoint, client-side crashes
- **Business:** Conversion rates, feature adoption

### Tracking Implementation
- Use event tracking for critical actions (journal submit, task accept)
- Track page views and navigation patterns
- Monitor form abandonment rates
- Track A/B test variations if applicable
- Set up funnels for onboarding and core flows

---

## 20. SECURITY BEST PRACTICES

### Frontend Security
- Store tokens in httpOnly cookies (if backend supports) or localStorage with XSS protection
- Sanitize user input before display (prevent XSS)
- Use Content Security Policy headers
- Validate file uploads (type, size) before sending to backend
- Never expose API keys in client code
- Use HTTPS everywhere in production

### Data Privacy
- Don't log sensitive user data (journal content, personal info)
- Respect user privacy settings
- Clear local storage on logout
- Implement "delete account" feature with data wipeout
- Follow GDPR/privacy law requirements

---

## 21. FINAL NOTES FOR FRONTEND DEVELOPERS

### Philosophy
This application is about making effort feel rewarding. Every interaction should reinforce the core loop: effort → pixels → visual progress → motivation.

### User Experience Priorities
1. **Instant Feedback:** When user completes a task, show immediate visual reward
2. **No Punishment:** Skipped tasks, paused goals, low completion rates have no negative consequences
3. **Narrative Over Metrics:** Tell stories, not just show numbers
4. **Beautiful Defaults:** The app should look good even with minimal user customization
5. **Respectful Timing:** Reminders are gentle, never aggressive or guilt-inducing

### Technical Priorities
1. **Type Safety:** Use TypeScript everywhere, no shortcuts
2. **Performance:** Fast load times, smooth animations, responsive interactions
3. **Accessibility:** Keyboard navigation, screen readers, proper semantics
4. **Mobile First:** Design for mobile, enhance for desktop
5. **Error Resilience:** Graceful degradation, clear error messages, recovery options

### Collaboration with Backend
- API contract is the source of truth (this document)
- Report any inconsistencies immediately
- Propose improvements to API design if it makes frontend cleaner
- Don't implement workarounds for bad API design—fix the API
- Keep mock data in sync with real API responses

### Deployment Strategy
- Deploy frequently (daily if possible)
- Use feature flags for incomplete features
- Staging environment mirrors production
- Rollback plan for every deployment
- Monitor error rates after each deploy

---

## APPENDIX: QUICK REFERENCE

### API Endpoints Summary
```
Auth:
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
GET    /auth/me

Domains:
GET    /domains
POST   /domains
PUT    /domains/:id
DELETE /domains/:id
POST   /domains/:id/images

Goals:
GET    /goals?domainId={id}
POST   /goals
POST   /goals/:id/decompose
POST   /goals/:id/approve-breakdown

Todos:
GET    /todos?goalId={id}
GET    /todos/today
GET    /tasks/tomorrow
POST   /tasks/validate

Journals:
GET    /journals/:date
POST   /journals
GET    /journals?start={date}&end={date}

Boards:
GET    /boards/current
POST   /boards/generate
GET    /boards/designs
POST   /boards/select-design
GET    /boards/:id/export

Timeline:
GET    /timeline?weeks={count}
GET    /wraps/weekly/:date

Pixels:
GET    /pixels/summary?start={date}&end={date}

Preferences:
GET    /preferences
PUT    /preferences/reminders
```

### Component Hierarchy
```
App
├── Auth Pages
│   ├── SignUpPage
│   └── LoginPage
├── Protected Pages
│   ├── Dashboard
│   │   ├── VisionBoard
│   │   ├── DomainProgressCard
│   │   └── QuickActions
│   ├── Domains
│   │   ├── DomainList
│   │   ├── DomainCard
│   │   └── DomainEditor
│   ├── Journal
│   │   ├── JournalEditor
│   │   ├── TaskCheckbox
│   │   └── PixelEarnedAnimation
│   ├── TaskValidator
│   │   ├── MorningValidator
│   │   └── TaskValidationCard
│   ├── Timeline
│   │   ├── TimelineView
│   │   ├── WeekCard
│   │   └── SnapshotDetailModal
│   └── Settings
│       ├── ReminderSettings
│       └── AccountSettings
└── Shared Components
    ├── Modal
    ├── Button
    ├── Input
    ├── Skeleton
    └── Toast
```

### Key Dates & Periods
- **Weekly boards:** Monday 00:00 to Sunday 23:59 (user timezone)
- **Journal deadline:** User's bedtime setting (default 22:00)
- **Task validation:** User's morning setting (default 07:00)
- **Weekly wrap generation:** Sunday 23:00
- **Board regeneration:** Monday 00:00

### Data Refresh Patterns
- **Real-time:** Vision board during active journaling session
- **Every 5 minutes:** Current board, pixel summary
- **On action:** After journal submit, task validation, goal changes
- **Manual:** Timeline snapshots (user scrolls to load more)
- **Never:** Domain images, user profile (until explicitly updated)

---

**END OF FRONTEND DEVELOPER GUIDE**

This document provides everything a frontend developer needs to build the Visual Life Execution System MVP. The backend is treated as a black box with well-defined API contracts. Focus on creating delightful user experiences that make effort feel rewarding, and remember: pixels never disappear, progress is never lost, and every action contributes to the user's visual journey.