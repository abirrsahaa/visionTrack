"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { getFastModel } from "@/lib/ai/model";

// Schema for the AI response
const DomainSchema = z.object({
    domains: z.array(
        z.object({
            name: z.string().describe("Name of the domain (e.g., 'Career', 'Health')"),
            description: z.string().describe("Brief 5-word description of the vision for this domain"),
            suggestedGoal: z.string().describe("A high-level 1-year goal for this domain"),
            colorHex: z.string().describe("Suggested hex color code for this domain (pastel/vibrant)"),
            imageKeywords: z.array(z.string()).describe("3-5 visual search keywords for finding aesthetic images (e.g. 'coding setup neon', 'healthy food flatlay')"),
        })
    ),
});

/**
 * Extracts structured domains from a free-form vision text.
 * Uses the 'Flash' model for low latency.
 */
export async function extractDomainsFromVision(visionText: string) {
    console.log("SERVER ACTION: extractDomainsFromVision called with:", visionText.substring(0, 50) + "...");
    try {
        console.log("SERVER ACTION: Calling AI with Fast Model...");
        const { object } = await generateObject({
            model: getFastModel(),
            schema: DomainSchema,
            prompt: `
        You are an expert Life Coach and Vision Architect.
        Analyze the following user's life vision statement and extract distinct life domains.
        
        Examples of domains: Career, Health, Relationships, Finance, Creativity, Spirituality, Travel.
        
        For each domain, extract:
        1. A clear Name.
        2. A concise description of their specific desire in this area.
        3. A concrete 1-year goal implied by the text.
        4. A color code that matches the "vibe" of this domain.
        5. Visual Keywords: 3-5 specific visual search terms that would produce beautiful, pinterest-style images for this domain. Be descriptive (e.g., replace "office" with "minimalist workspace macbook plant").

        Vision Text:
        "${visionText}"
      `,
        });

        console.log("SERVER ACTION: AI Extraction Success. Domains found:", object.domains.length);
        return { success: true, data: object.domains };
    } catch (error) {
        console.error("SERVER ACTION: AI Extraction Error:", error);
        return { success: false, error: "Failed to analyze vision." };
    }
}
