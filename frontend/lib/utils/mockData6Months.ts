// Comprehensive 6-month mock data generator
// Simulates a user 6 months into their journey
import type {
  Domain,
  Goal,
  Todo,
  Journal,
  VisionBoard,
  TimelineSnapshot,
  PixelSummary,
  TomorrowTasksResponse,
} from "@/lib/types";
import { subDays, addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSunday } from "date-fns";

// Helper: Generate date ranges for 6 months ago to today
const TODAY = new Date();
const SIX_MONTHS_AGO = subDays(TODAY, 180);
const START_DATE = SIX_MONTHS_AGO;

// Helper: Generate weekly dates
function getWeekDates(weekOffset: number) {
  const weekStart = addDays(START_DATE, weekOffset * 7);
  const weekEnd = addDays(weekStart, 6);
  return {
    start: format(weekStart, "yyyy-MM-dd"),
    end: format(weekEnd, "yyyy-MM-dd"),
    date: format(weekEnd, "yyyy-MM-dd"), // Week end date for snapshots
  };
}

// Helper: Generate monthly dates
function getMonthDates(monthOffset: number) {
  const monthStart = addDays(START_DATE, monthOffset * 30);
  const monthEnd = addDays(monthStart, 29);
  return {
    start: format(monthStart, "yyyy-MM-dd"),
    end: format(monthEnd, "yyyy-MM-dd"),
  };
}

// Domains with rich data
export const mockDomains6Months: Domain[] = [
  {
    id: "dom_career",
    name: "Career",
    description: "Advance to senior engineering role and build technical leadership",
    colorHex: "#3B82F6",
    sortOrder: 1,
    images: [
      {
        id: "img_career_1",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
        sortOrder: 1,
        uploadedAt: "2024-07-01T10:00:00Z",
      },
      {
        id: "img_career_2",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        sortOrder: 2,
        uploadedAt: "2024-07-01T10:05:00Z",
      },
      {
        id: "img_career_3",
        imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
        sortOrder: 3,
        uploadedAt: "2024-07-15T14:00:00Z",
      },
    ],
    createdAt: "2024-07-01T09:00:00Z",
  },
  {
    id: "dom_health",
    name: "Health",
    description: "Build functional strength, flexibility, and sustainable fitness habits",
    colorHex: "#10B981",
    sortOrder: 2,
    images: [
      {
        id: "img_health_1",
        imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
        sortOrder: 1,
        uploadedAt: "2024-07-01T11:00:00Z",
      },
      {
        id: "img_health_2",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        sortOrder: 2,
        uploadedAt: "2024-08-10T09:00:00Z",
      },
    ],
    createdAt: "2024-07-01T09:30:00Z",
  },
  {
    id: "dom_learning",
    name: "Learning",
    description: "Master machine learning fundamentals and data science",
    colorHex: "#F59E0B",
    sortOrder: 3,
    images: [
      {
        id: "img_learning_1",
        imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
        sortOrder: 1,
        uploadedAt: "2024-07-05T10:00:00Z",
      },
      {
        id: "img_learning_2",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        sortOrder: 2,
        uploadedAt: "2024-09-20T15:00:00Z",
      },
    ],
    createdAt: "2024-07-01T10:00:00Z",
  },
  {
    id: "dom_relationships",
    name: "Relationships",
    description: "Deepen connections with family and friends",
    colorHex: "#EC4899",
    sortOrder: 4,
    images: [
      {
        id: "img_relationships_1",
        imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800",
        sortOrder: 1,
        uploadedAt: "2024-07-10T12:00:00Z",
      },
    ],
    createdAt: "2024-07-01T11:00:00Z",
  },
];

// Goals with progress over 6 months
export const mockGoals6Months: Goal[] = [
  {
    id: "goal_career_1",
    domainId: "dom_career",
    title: "Get promoted to Senior Engineer",
    description: "Demonstrate technical leadership, system design skills, and mentor junior developers",
    status: "active",
    startDate: "2024-07-01",
    targetDate: "2024-12-31",
    milestones: [
      {
        id: "mile_career_1",
        title: "Complete system design course",
        targetDate: "2024-09-30",
        completedAt: "2024-09-25T00:00:00Z",
        sortOrder: 1,
      },
      {
        id: "mile_career_2",
        title: "Lead major infrastructure project",
        targetDate: "2024-11-30",
        completedAt: null,
        sortOrder: 2,
      },
      {
        id: "mile_career_3",
        title: "Present at tech talk and mentor 2 juniors",
        targetDate: "2024-12-31",
        completedAt: null,
        sortOrder: 3,
      },
    ],
    createdAt: "2024-07-01T12:00:00Z",
  },
  {
    id: "goal_health_1",
    domainId: "dom_health",
    title: "Build functional strength and flexibility",
    description: "Complete 150 workouts and achieve flexibility goals",
    status: "active",
    startDate: "2024-07-01",
    targetDate: "2024-12-31",
    milestones: [
      {
        id: "mile_health_1",
        title: "Complete 50 workouts",
        targetDate: "2024-09-01",
        completedAt: "2024-08-28T00:00:00Z",
        sortOrder: 1,
      },
      {
        id: "mile_health_2",
        title: "Complete 100 workouts",
        targetDate: "2024-11-01",
        completedAt: "2024-10-29T00:00:00Z",
        sortOrder: 2,
      },
      {
        id: "mile_health_3",
        title: "Complete 150 workouts",
        targetDate: "2024-12-31",
        completedAt: null,
        sortOrder: 3,
      },
    ],
    createdAt: "2024-07-01T13:00:00Z",
  },
  {
    id: "goal_learning_1",
    domainId: "dom_learning",
    title: "Master ML fundamentals and build 3 projects",
    description: "Complete Andrew Ng's ML course and apply knowledge",
    status: "active",
    startDate: "2024-07-01",
    targetDate: "2024-12-31",
    milestones: [
      {
        id: "mile_learning_1",
        title: "Complete ML course modules 1-5",
        targetDate: "2024-10-31",
        completedAt: "2024-10-20T00:00:00Z",
        sortOrder: 1,
      },
      {
        id: "mile_learning_2",
        title: "Build first ML project",
        targetDate: "2024-11-30",
        completedAt: null,
        sortOrder: 2,
      },
    ],
    createdAt: "2024-07-01T14:00:00Z",
  },
];

// Generate 26 weekly boards (6 months)
export function generateWeeklyBoards(): VisionBoard[] {
  const boards: VisionBoard[] = [];
  const totalWeeks = 26;
  
  for (let i = 0; i < totalWeeks; i++) {
    const weekDates = getWeekDates(i);
    // Progressive completion: starts at 20%, grows to 78% by week 26
    const completionRate = 0.20 + (i / totalWeeks) * 0.58;
    const totalPixels = 7500; // Per week (distributed across 4 domains = 1875 per domain)
    const coloredPixels = Math.round(totalPixels * completionRate);
    
    // Calculate pixels per domain (maintaining ratios)
    const careerPixels = Math.round(coloredPixels * 0.45);
    const healthPixels = Math.round(coloredPixels * 0.30);
    const learningPixels = Math.round(coloredPixels * 0.15);
    const relationshipsPixels = coloredPixels - careerPixels - healthPixels - learningPixels;
    
    boards.push({
      id: `board_week_${i + 1}`,
      userId: "usr_abc123",
      boardType: "weekly",
      periodStart: weekDates.start,
      periodEnd: weekDates.end,
      designStyle: "grid",
      layoutMetadata: {
        domains: [
          {
            domainId: "dom_career",
            region: { x: 0, y: 0, width: 100, height: 25 }, // Top strip
            pixels: generatePixelCoordinatesForRegion(0, 0, 100, 25, careerPixels, totalPixels / 4),
          },
          {
            domainId: "dom_health",
            region: { x: 0, y: 25, width: 100, height: 25 }, // Second strip
            pixels: generatePixelCoordinatesForRegion(0, 25, 100, 25, healthPixels, totalPixels / 4),
          },
          {
            domainId: "dom_learning",
            region: { x: 0, y: 50, width: 100, height: 25 }, // Third strip
            pixels: generatePixelCoordinatesForRegion(0, 50, 100, 25, learningPixels, totalPixels / 4),
          },
          {
            domainId: "dom_relationships",
            region: { x: 0, y: 75, width: 100, height: 25 }, // Bottom strip
            pixels: generatePixelCoordinatesForRegion(0, 75, 100, 25, relationshipsPixels, totalPixels / 4),
          },
        ],
      },
      baseImageUrl: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&week=${i + 1}`,
      currentImageUrl: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&week=${i + 1}&colored=${Math.round(completionRate * 100)}`,
      totalPixels,
      coloredPixels,
      lastUpdated: format(addDays(new Date(weekDates.end), -1), "yyyy-MM-dd'T'22:30:00'Z'"),
      createdAt: format(new Date(weekDates.start), "yyyy-MM-dd'T'00:00:00'Z'"),
    });
  }
  
  return boards;
}

// Generate 6 monthly boards
// Monthly boards are DIFFERENT layout but RELATED to main board (diagonal mosaic)
export function generateMonthlyBoards(): VisionBoard[] {
  const boards: VisionBoard[] = [];
  const totalMonths = 6;
  
  for (let i = 0; i < totalMonths; i++) {
    const monthDates = getMonthDates(i);
    // Progressive completion: starts at 15%, grows to 75% by month 6
    const completionRate = 0.15 + (i / totalMonths) * 0.60;
    const totalPixels = 30000; // Per month
    const coloredPixels = Math.round(totalPixels * completionRate);
    
    // Monthly layout: Diagonal mosaic (different from main board's 2x2 grid)
    boards.push({
      id: `board_month_${i + 1}`,
      userId: "usr_abc123",
      boardType: "monthly",
      periodStart: monthDates.start,
      periodEnd: monthDates.end,
      designStyle: "mosaic",
      layoutMetadata: {
        domains: [
          {
            domainId: "dom_career",
            region: { x: 0, y: 0, width: 60, height: 60 }, // Top-left larger
            pixels: generatePixelCoordinatesForRegion(0, 0, 60, 60, Math.round(coloredPixels * 0.45), totalPixels / 4),
          },
          {
            domainId: "dom_health",
            region: { x: 40, y: 0, width: 60, height: 40 }, // Top-right
            pixels: generatePixelCoordinatesForRegion(40, 0, 60, 40, Math.round(coloredPixels * 0.30), totalPixels / 4),
          },
          {
            domainId: "dom_learning",
            region: { x: 0, y: 40, width: 40, height: 60 }, // Bottom-left
            pixels: generatePixelCoordinatesForRegion(0, 40, 40, 60, Math.round(coloredPixels * 0.15), totalPixels / 4),
          },
          {
            domainId: "dom_relationships",
            region: { x: 40, y: 40, width: 60, height: 60 }, // Bottom-right larger
            pixels: generatePixelCoordinatesForRegion(40, 40, 60, 60, Math.round(coloredPixels * 0.10), totalPixels / 4),
          },
        ],
      },
      baseImageUrl: `https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&month=${i + 1}`,
      currentImageUrl: `https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&month=${i + 1}&colored=${Math.round(completionRate * 100)}`,
      totalPixels,
      coloredPixels,
      lastUpdated: format(addDays(new Date(monthDates.end), -1), "yyyy-MM-dd'T'23:00:00'Z'"),
      createdAt: format(new Date(monthDates.start), "yyyy-MM-dd'T'00:00:00'Z'"),
    });
  }
  
  return boards;
}

// Generate MAIN annual board (6 months of progress)
// This is the MAIN vision board - it accumulates progress from all weekly/monthly boards
// Layout: Clean 2x2 grid (different from weekly strips and monthly mosaic)
export function generateAnnualBoard(): VisionBoard {
  // Calculate total completion from all weekly/monthly progress
  const weeklyBoards = generateWeeklyBoards();
  const totalWeeklyPixels = weeklyBoards.reduce((sum, board) => sum + board.coloredPixels, 0);
  const totalWeeklyTotalPixels = weeklyBoards.reduce((sum, board) => sum + board.totalPixels, 0);
  
  const completionRate = totalWeeklyTotalPixels > 0 
    ? totalWeeklyPixels / totalWeeklyTotalPixels 
    : 0.65; // Fallback to 65%
  
  const totalPixels = 195000; // 6 months total
  const coloredPixels = Math.round(totalPixels * completionRate);
  
  const careerPixels = Math.round(coloredPixels * 0.45);
  const healthPixels = Math.round(coloredPixels * 0.30);
  const learningPixels = Math.round(coloredPixels * 0.15);
  const relationshipsPixels = coloredPixels - careerPixels - healthPixels - learningPixels;
  
  return {
    id: "board_main_2024",
    userId: "usr_abc123",
    boardType: "annual",
    periodStart: format(START_DATE, "yyyy-MM-dd"),
    periodEnd: format(TODAY, "yyyy-MM-dd"),
    designStyle: "main", // Main board has its own style
    // Main board layout: Clean 2x2 grid (master layout)
    layoutMetadata: {
      domains: [
        {
          domainId: "dom_career",
          region: { x: 0, y: 0, width: 50, height: 50 },
          pixels: generatePixelCoordinatesForRegion(0, 0, 50, 50, careerPixels, totalPixels / 4),
        },
        {
          domainId: "dom_health",
          region: { x: 50, y: 0, width: 50, height: 50 },
          pixels: generatePixelCoordinatesForRegion(50, 0, 50, 50, healthPixels, totalPixels / 4),
        },
        {
          domainId: "dom_learning",
          region: { x: 0, y: 50, width: 50, height: 50 },
          pixels: generatePixelCoordinatesForRegion(0, 50, 50, 50, learningPixels, totalPixels / 4),
        },
        {
          domainId: "dom_relationships",
          region: { x: 50, y: 50, width: 50, height: 50 },
          pixels: generatePixelCoordinatesForRegion(50, 50, 50, 50, relationshipsPixels, totalPixels / 4),
        },
      ],
    },
    baseImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&type=main",
    currentImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&type=main&colored=" + Math.round(completionRate * 100),
    totalPixels,
    coloredPixels,
    lastUpdated: format(TODAY, "yyyy-MM-dd'T'23:59:59'Z'"),
    createdAt: format(START_DATE, "yyyy-MM-dd'T'00:00:00'Z'"),
  };
}

// Helper: Generate pixel coordinates for a region (percentage-based, then converted to actual coordinates)
function generatePixelCoordinatesForRegion(
  regionX: number,
  regionY: number,
  regionWidth: number,
  regionHeight: number,
  coloredCount: number,
  totalPixelsInRegion: number
): Array<[number, number]> {
  const pixels: Array<[number, number]> = [];
  
  // Calculate how many pixels to represent (simplified - we'll generate a pattern)
  // Each pixel represents progress in percentage coordinates (0-100)
  const completionRate = coloredCount / totalPixelsInRegion;
  const regionPixelWidth = regionWidth; // Already in percentage
  const regionPixelHeight = regionHeight; // Already in percentage
  
  // Generate a grid pattern within the region
  const gridSize = 20; // 20x20 grid within each region
  const cellsToColor = Math.floor(gridSize * gridSize * completionRate);
  
  for (let i = 0; i < cellsToColor; i++) {
    const col = i % gridSize;
    const row = Math.floor(i / gridSize);
    
    // Convert grid cell to percentage coordinates within region
    const px = regionX + (col / gridSize) * regionWidth;
    const py = regionY + (row / gridSize) * regionHeight;
    
    pixels.push([px, py]);
  }
  
  return pixels;
}

// Generate 26 weekly timeline snapshots
export function generateTimelineSnapshots(): TimelineSnapshot[] {
  const snapshots: TimelineSnapshot[] = [];
  const narratives = [
    "Your first week set the foundation. Career pixels started flowing as you completed onboarding tasks. Health stayed steady with 3 workouts. 42% of your canvas began to glow.",
    "Momentum built this week. You pushed through resistance—Career pixels blazed with 4 major completions. Learning pixels emerged as you started your course. 67% of your board now glows.",
    "This week, you found your rhythm. All four domains showed progress, with career leading the way. Your consistency is paying off—58% completion.",
    "A breakthrough week! You completed a major milestone in your career goal. The board is now 64% colored. Keep this energy going.",
    "Steady progress this week. Health domain pixels are growing steadily. 52% complete. Your dedication is showing.",
    "Learning domain accelerated this week! You finished 3 course modules. 69% of the board is now glowing.",
    "This week, you balanced all domains beautifully. Relationships pixels started flowing too. 61% complete.",
    "Major milestone unlocked! Career goal progress is accelerating. 71% of your vision board is now colored.",
    "Consistency is your superpower. Another solid week across all domains. 66% completion.",
    "Health domain hit a milestone—50 workouts complete! The board is 74% colored now.",
    "Learning momentum is building. You're halfway through the ML course. 68% complete.",
    "Career pixels are blazing! Infrastructure project is progressing well. 76% of board colored.",
    "This week, you pushed through a challenging period. Your resilience shows. 63% complete.",
    "Breakthrough! Completed first ML project. Learning domain is glowing. 72% completion.",
    "All domains firing. This week was exceptional—career, health, learning all showed strong progress. 78% complete.",
    "Steady as she goes. Consistent effort across all areas. 70% of vision board colored.",
    "Health milestone: 100 workouts! Your discipline is inspiring. 75% completion.",
    "Career goal progress is accelerating. System design course completed. 79% complete.",
    "This week, learning took center stage. Multiple course modules finished. 73% colored.",
    "Balanced week with progress in relationships too. 71% of board is glowing.",
    "Health domain is flourishing. Flexibility improvements are noticeable. 77% complete.",
    "Career project is hitting milestones. Leadership skills are developing. 81% colored.",
    "All four domains showing strong progress. Your vision is materializing. 75% complete.",
    "This week, you achieved perfect balance across all life areas. 78% of board colored.",
    "Six months in! Your dedication has transformed your vision board. 82% complete. Amazing progress.",
    "Current week in progress. Maintaining momentum across all domains. Keep going!",
  ];
  
  const totalWeeks = 26;
  for (let i = 0; i < totalWeeks; i++) {
    const weekDates = getWeekDates(i);
    const completionRate = 0.42 + (i / totalWeeks) * 0.40;
    const totalPixels = Math.round(7500 * completionRate);
    
    snapshots.push({
      id: `snap_week_${i + 1}`,
      snapshotDate: weekDates.date,
      snapshotType: "weekly",
      boardImageUrl: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&week=${i + 1}`,
      narrativeText: narratives[i] || "Another week of progress on your journey.",
      animationUrl: i < 20 ? `https://cdn.example.com/wraps/week_${i + 1}.mp4` : null, // First 20 weeks have animations
      pixelsSummary: {
        totalPixels,
        completionRate,
      },
      createdAt: format(addDays(new Date(weekDates.end), 1), "yyyy-MM-dd'T'00:00:00'Z'"),
    });
  }
  
  return snapshots;
}

// Current week's board (week 26)
export function getCurrentWeekBoard(): VisionBoard {
  const boards = generateWeeklyBoards();
  return boards[boards.length - 1];
}

// Current month's board
export function getCurrentMonthBoard(): VisionBoard {
  const boards = generateMonthlyBoards();
  return boards[boards.length - 1];
}

// Comprehensive pixel summary for 6 months
export function getPixelSummary6Months(): PixelSummary {
  const totalPixels = 97500; // 6 months of progress
  const byDate: PixelSummary["byDate"] = [];
  
  // Generate daily pixel data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(TODAY, i), "yyyy-MM-dd");
    const basePixels = 75 + Math.floor(Math.random() * 50);
    byDate.push({
      date,
      totalPixels: basePixels,
      byDomain: [
        { domainId: "dom_career", pixels: Math.round(basePixels * 0.45) },
        { domainId: "dom_health", pixels: Math.round(basePixels * 0.30) },
        { domainId: "dom_learning", pixels: Math.round(basePixels * 0.15) },
        { domainId: "dom_relationships", pixels: Math.round(basePixels * 0.10) },
      ],
    });
  }
  
  return {
    totalPixels,
    byDomain: [
      {
        domainId: "dom_career",
        domainName: "Career",
        colorHex: "#3B82F6",
        totalPixels: Math.round(totalPixels * 0.45),
        percentage: 0.45,
      },
      {
        domainId: "dom_health",
        domainName: "Health",
        colorHex: "#10B981",
        totalPixels: Math.round(totalPixels * 0.30),
        percentage: 0.30,
      },
      {
        domainId: "dom_learning",
        domainName: "Learning",
        colorHex: "#F59E0B",
        totalPixels: Math.round(totalPixels * 0.15),
        percentage: 0.15,
      },
      {
        domainId: "dom_relationships",
        domainName: "Relationships",
        colorHex: "#EC4899",
        totalPixels: Math.round(totalPixels * 0.10),
        percentage: 0.10,
      },
    ],
    byDate,
  };
}

// Today's todos (for current date)
export function getTodayTodos(): Todo[] {
  return [
    {
      id: "todo_today_1",
      milestoneId: "mile_career_2",
      goalId: "goal_career_1",
      domainId: "dom_career",
      title: "Review infrastructure project PR",
      description: "Review and approve pull request from team member",
      scheduledDate: format(TODAY, "yyyy-MM-dd"),
      status: "approved",
      approvedAt: format(subDays(TODAY, 1), "yyyy-MM-dd'T'07:00:00'Z'"),
      completedAt: null,
      effortWeight: 1.0,
      createdAt: format(subDays(TODAY, 2), "yyyy-MM-dd'T'10:00:00'Z'"),
    },
    {
      id: "todo_today_2",
      milestoneId: "mile_health_3",
      goalId: "goal_health_1",
      domainId: "dom_health",
      title: "Morning workout - Strength training",
      description: "45-minute strength training session",
      scheduledDate: format(TODAY, "yyyy-MM-dd"),
      status: "approved",
      approvedAt: format(subDays(TODAY, 1), "yyyy-MM-dd'T'07:00:00'Z'"),
      completedAt: null,
      effortWeight: 1.5,
      createdAt: format(subDays(TODAY, 2), "yyyy-MM-dd'T'10:00:00'Z'"),
    },
    {
      id: "todo_today_3",
      milestoneId: "mile_learning_2",
      goalId: "goal_learning_1",
      domainId: "dom_learning",
      title: "Continue ML project - Data preprocessing",
      description: "Work on data cleaning and feature engineering",
      scheduledDate: format(TODAY, "yyyy-MM-dd"),
      status: "approved",
      approvedAt: format(subDays(TODAY, 1), "yyyy-MM-dd'T'07:00:00'Z'"),
      completedAt: null,
      effortWeight: 2.0,
      createdAt: format(subDays(TODAY, 2), "yyyy-MM-dd'T'10:00:00'Z'"),
    },
  ];
}

// Tomorrow's suggested tasks
export function getTomorrowTasks(): TomorrowTasksResponse {
  return {
    suggestedTasks: [
      {
        id: "todo_tomorrow_1",
        milestoneId: "mile_career_2",
        goalId: "goal_career_1",
        domainId: "dom_career",
        title: "Mentor session with junior developer",
        description: "30-minute 1-on-1 to review code and provide guidance",
        scheduledDate: format(addDays(TODAY, 1), "yyyy-MM-dd"),
        status: "pending",
        approvedAt: null,
        completedAt: null,
        effortWeight: 1.0,
        createdAt: format(TODAY, "yyyy-MM-dd'T'22:00:00'Z'"),
      },
      {
        id: "todo_tomorrow_2",
        milestoneId: "mile_health_3",
        goalId: "goal_health_1",
        domainId: "dom_health",
        title: "Morning yoga session",
        description: "20-minute flexibility routine",
        scheduledDate: format(addDays(TODAY, 1), "yyyy-MM-dd"),
        status: "pending",
        approvedAt: null,
        completedAt: null,
        effortWeight: 1.0,
        createdAt: format(TODAY, "yyyy-MM-dd'T'22:00:00'Z'"),
      },
      {
        id: "todo_tomorrow_3",
        milestoneId: "mile_learning_2",
        goalId: "goal_learning_1",
        domainId: "dom_learning",
        title: "Complete ML course module 6",
        description: "Watch videos and complete exercises",
        scheduledDate: format(addDays(TODAY, 1), "yyyy-MM-dd"),
        status: "pending",
        approvedAt: null,
        completedAt: null,
        effortWeight: 1.5,
        createdAt: format(TODAY, "yyyy-MM-dd'T'22:00:00'Z'"),
      },
    ],
    context: {
      yesterdayCompletionRate: 0.85,
      energyLevel: 4,
      aiReasoning: "You had an excellent day yesterday with 85% completion! Your momentum is strong. Tomorrow's tasks are designed to maintain this energy while keeping a balanced workload. The mentor session will help build leadership skills for your promotion goal.",
    },
  };
}
