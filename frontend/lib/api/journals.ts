import { apiClient, shouldUseMockData } from "./client";
import type { Journal, CreateJournalRequest, CreateJournalResponse } from "@/lib/types";
import { generateJournalHistory } from "@/lib/utils/generateJournalHistory";
import { getJournals, submitJournal } from "@/app/actions";

// ... existing code ...

export const journalsApi = {
  // ... getByDate, getRange ...

  create: async (data: CreateJournalRequest): Promise<CreateJournalResponse> => {
    // Server Action
    const result = await submitJournal(data.entryText);
    if (result.success) {
      // Construct partial response
      // Ideally submitJournal should return the created object
      // For now returning mock-like object using input data 
      return {
        journal: {
          id: "temp_id",
          userId: "me",
          journalDate: data.journalDate,
          entryText: data.entryText,
          emotionalState: "neutral",
          energyLevel: 5,
          aiReflection: null,
          submittedAt: new Date().toISOString(),
          completedTasks: []
        },
        pixelsEarned: {
          total: result.pixelsEarned,
          byDomain: [] // simplified
        },
        nextDayTasks: []
      } as any;
    }

    throw new Error("Failed to submit journal");
  },

  getAll: async (): Promise<Journal[]> => {
    const journals = await getJournals();
    if (journals) return journals;

    if (shouldUseMockData()) {
      // ... existing mock logic ...
      return generateJournalHistory(180);
    }
    return [];
  },
};
