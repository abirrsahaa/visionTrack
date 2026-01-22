"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { getModel, getFastModel } from "@/lib/ai/model";

// Schema for the AI Deep Breakdown
const DecompositionSchema = z.object({
    milestones: z.array(z.string()).describe("4 Quarterly milestones (Q1, Q2, Q3, Q4)"),
    monthOneTodos: z.array(z.object({
        week: z.number().min(1).max(4),
        task: z.string().describe("Specific actionable task"),
        effort: z.enum(["Low", "Medium", "High"]).describe("Estimated effort"),
    })).describe("Detailed breakdown for the first month (4 weeks)"),
});

export async function decomposeGoal(domain: string, goal: string) {
    console.log(`SERVER ACTION: decomposeGoal called for domain: ${domain}`);
    try {
        console.log("SERVER ACTION: Calling AI with Fast Model...");
        const { object } = await generateObject({
            model: getFastModel(), // Switched to Flash for speed & better rate limits
            schema: DecompositionSchema,
            prompt: `
        You are a Strategic Planning AI.
        
        The user has a goal in the "${domain}" domain: "${goal}".
        
        Your task:
        1. Break this 1-year goal into 4 distinct Quarterly Milestones (Q1, Q2, Q3, Q4).
        2. Create a detailed weekly action plan for ONLY the first month (Month 1).
        
        Guidelines:
        - Be realistic. A user cannot run a marathon in Week 1.
        - Start small to build momentum.
        - Ensure tasks are concrete (e.g., "Research gyms" vs "Get fit").
      `,
        });

        console.log("SERVER ACTION: Decomposition Success");
        return { success: true, data: object };
    } catch (error) {
        console.error("SERVER ACTION: AI Decomposition Error:", error);
        return { success: false, error: "Failed to decompose goal." };
    }
}
