import { format, subDays } from "date-fns";
import type { Journal, PixelSummary } from "@/lib/types";

export interface ActivityItem {
  id: string;
  type: "journal" | "task" | "milestone" | "streak" | "pixel_earn";
  timestamp: string;
  title: string;
  description?: string;
  pixels?: number;
}

/**
 * Generate mock journal history for streak calculation
 * Creates entries for the last N days (some missing to simulate real usage)
 */
export function generateJournalHistory(daysBack: number = 180): Journal[] {
  const journals: Journal[] = [];
  const today = new Date();

  // Generate journals with some gaps (80% completion rate)
  for (let i = 0; i < daysBack; i++) {
    const journalDate = subDays(today, i);
    
    // Skip random days (20% chance) to simulate missing journals
    if (Math.random() > 0.2) {
      const journal: Journal = {
        id: `jrn_${format(journalDate, "yyyy-MM-dd")}`,
        userId: "usr_abc123",
        journalDate: format(journalDate, "yyyy-MM-dd"),
        entryText: `Reflection for ${format(journalDate, "MMMM d, yyyy")}`,
        emotionalState: ["motivated", "tired", "excited", "calm", "focused"][
          Math.floor(Math.random() * 5)
        ],
        energyLevel: Math.floor(Math.random() * 3) + 3, // 3-5
        aiReflection: "Great progress today!",
        submittedAt: format(journalDate, "yyyy-MM-dd'T'22:30:00'Z'"),
        completedTasks: [],
      };
      journals.push(journal);
    }
  }

  // Sort by date (newest first)
  return journals.sort(
    (a, b) =>
      new Date(b.journalDate).getTime() - new Date(a.journalDate).getTime()
  );
}

/**
 * Generate mock activity feed items
 */
export function generateActivityFeed(
  journals: Journal[],
  pixelSummary?: PixelSummary
): ActivityItem[] {
  const activities: ActivityItem[] = [];
  const now = new Date();

  // Recent journal entry
  if (journals.length > 0 && journals[0]) {
    const latestJournal = journals[0];
    const daysAgo = Math.floor(
      (now.getTime() - new Date(latestJournal.journalDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    activities.push({
      id: `activity_${latestJournal.id}`,
      type: "journal" as const,
      timestamp: latestJournal.submittedAt,
      title: "Journal entry completed",
      description: `${latestJournal.entryText.substring(0, 50)}...`,
      pixels: 75,
    });
  }

  // Calculate streak
  let streak = 0;
  let checkDate = new Date();
  
  for (let i = 0; i < journals.length; i++) {
    const journalDate = new Date(journals[i].journalDate);
    const expectedDate = format(checkDate, "yyyy-MM-dd");
    const journalDateStr = format(journalDate, "yyyy-MM-dd");
    
    if (journalDateStr === expectedDate || 
        journalDateStr === format(subDays(checkDate, 1), "yyyy-MM-dd")) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  // Streak milestone
  if (streak >= 7 && streak % 7 === 0) {
    activities.unshift({
      id: `activity_streak_${streak}`,
      type: "streak" as const,
      timestamp: new Date().toISOString(),
      title: `${streak}-day streak achieved! 🔥`,
      description: "Keep up the amazing consistency!",
    });
  }

  // Milestone achievements
  if (pixelSummary && pixelSummary.totalPixels > 0) {
    const milestones = [1000, 5000, 10000, 25000, 50000, 100000];
    const currentTotal = pixelSummary.totalPixels;
    
    for (const milestone of milestones) {
      if (currentTotal >= milestone && currentTotal < milestone + 500) {
        activities.unshift({
          id: `activity_milestone_${milestone}`,
          type: "milestone" as const,
          timestamp: new Date().toISOString(),
          title: `🎯 Milestone reached: ${milestone.toLocaleString()} pixels!`,
          description: "Amazing progress!",
        });
        break;
      }
    }
  }

  return activities;
}
