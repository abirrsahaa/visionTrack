import { format, differenceInDays, parseISO, startOfDay, isBefore, isAfter, subDays } from "date-fns";

export interface JournalEntry {
  journalDate: string; // ISO date string
}

/**
 * Calculate current streak from journal entries
 * Streak doesn't break - it "pauses" if user misses a day
 */
export function calculateStreak(entries: JournalEntry[]): {
  currentStreak: number;
  longestStreak: number;
  totalJournals: number;
  streakStartDate: string | null;
  isActive: boolean;
} {
  if (entries.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalJournals: 0,
      streakStartDate: null,
      isActive: false,
    };
  }

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.journalDate).getTime() - new Date(a.journalDate).getTime()
  );

  const today = startOfDay(new Date());
  const totalJournals = sortedEntries.length;

  // Calculate current streak (consecutive days with journal entries)
  let currentStreak = 0;
  let streakStartDate: string | null = null;
  let expectedDate = startOfDay(new Date());

  // Check if there's an entry today
  const todayEntry = sortedEntries.find(
    (entry) => format(parseISO(entry.journalDate), "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
  );

  if (todayEntry) {
    currentStreak = 1;
    streakStartDate = todayEntry.journalDate;
    expectedDate = subDays(expectedDate, 1);
  } else {
    // Check yesterday
    const yesterday = subDays(today, 1);
    const yesterdayEntry = sortedEntries.find(
      (entry) => format(parseISO(entry.journalDate), "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd")
    );

    if (yesterdayEntry) {
      currentStreak = 1;
      streakStartDate = yesterdayEntry.journalDate;
      expectedDate = subDays(yesterday, 1);
    }
  }

  // Count backwards for consecutive days
  for (const entry of sortedEntries) {
    const entryDate = startOfDay(parseISO(entry.journalDate));
    const expectedDateStr = format(expectedDate, "yyyy-MM-dd");
    const entryDateStr = format(entryDate, "yyyy-MM-dd");

    if (entryDateStr === expectedDateStr) {
      currentStreak++;
      expectedDate = subDays(expectedDate, 1);
    } else if (isBefore(entryDate, expectedDate)) {
      // Found a gap, but streak continues if we're still counting from recent entries
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 1; i < sortedEntries.length; i++) {
    const prevDate = startOfDay(parseISO(sortedEntries[i - 1].journalDate));
    const currDate = startOfDay(parseISO(sortedEntries[i].journalDate));
    const daysDiff = differenceInDays(prevDate, currDate);

    if (daysDiff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  // Check if streak is active (has entry today or yesterday)
  const isActive = todayEntry !== undefined || 
    sortedEntries.some(
      (entry) => format(parseISO(entry.journalDate), "yyyy-MM-dd") === format(subDays(today, 1), "yyyy-MM-dd")
    );

  return {
    currentStreak,
    longestStreak,
    totalJournals,
    streakStartDate,
    isActive,
  };
}

/**
 * Check if current time is within bonus hour window
 */
export function isBonusHourActive(
  currentTime: Date = new Date(),
  bonusStartHour: number = 22, // 10 PM
  bonusEndHour: number = 23 // 11 PM
): boolean {
  const hour = currentTime.getHours();
  return hour >= bonusStartHour && hour < bonusEndHour;
}

/**
 * Calculate pixel bonus multiplier based on various factors
 */
export function calculatePixelBonus({
  isFirstJournalOfDay = false,
  isBonusHour = false,
  isWeekend = false,
  isLuckyDay = false,
}: {
  isFirstJournalOfDay?: boolean;
  isBonusHour?: boolean;
  isWeekend?: boolean;
  isLuckyDay?: boolean;
}): number {
  let multiplier = 1.0;

  // First journal of day always gets 2x
  if (isFirstJournalOfDay) {
    multiplier = 2.0;
  }

  // Bonus hour: 1.5x (stacks with first journal)
  if (isBonusHour) {
    multiplier *= 1.5;
  }

  // Weekend: 1.2x
  if (isWeekend) {
    multiplier *= 1.2;
  }

  // Lucky day: 3x (rare, exciting)
  if (isLuckyDay) {
    multiplier = 3.0;
  }

  return multiplier;
}
