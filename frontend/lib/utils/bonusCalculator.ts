/**
 * Bonus pixel calculation utilities
 */

export interface BonusConditions {
  isFirstJournalOfDay: boolean;
  isBonusHour: boolean;
  isWeekend: boolean;
  isLuckyDay: boolean;
}

/**
 * Check if current time is within bonus hour window
 */
export function isBonusHourActive(
  currentTime: Date,
  startHour: number,
  endHour: number
): boolean {
  const currentHour = currentTime.getHours();
  return currentHour >= startHour && currentHour < endHour;
}

/**
 * Calculate pixel bonus multiplier based on various conditions
 * Returns a number (multiplier) to match existing usage
 */
export function calculatePixelBonus(conditions: BonusConditions): number {
  let multiplier = 1.0;

  // First journal of day always gets 2x
  if (conditions.isFirstJournalOfDay) {
    multiplier = 2.0;
  }

  // Bonus hour: 1.5x (stacks with first journal)
  if (conditions.isBonusHour) {
    multiplier *= 1.5;
  }

  // Weekend: 1.2x
  if (conditions.isWeekend) {
    multiplier *= 1.2;
  }

  // Lucky day: 3x (rare, exciting)
  if (conditions.isLuckyDay) {
    multiplier = 3.0;
  }

  return multiplier;
}
