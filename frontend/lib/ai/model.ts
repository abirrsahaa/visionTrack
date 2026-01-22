import { google } from "@ai-sdk/google";

/**
 * The Central Brain of Visual Life.
 * 
 * Configured for: Google Gemini
 * Model: gemini-1.5-pro-latest (High Reasoning)
 */
export const getModel = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("MISSING_API_KEY: GEMINI_API_KEY is not set in .env.local");
    }

    // Vercel AI SDK Google provider defaults to checking GOOGLE_GENERATIVE_AI_API_KEY
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
    }

    // We use the 'pro' model for reasoning tasks (Architecture, Planning)
    // Note: Safety settings use defaults as custom config requires specific provider factory
    return google("gemini-2.5-pro");
};

/**
 * "Flash" model for quick UI interactions (like autocomplete or simple extraction)
 */
export const getFastModel = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("MISSING_API_KEY: GEMINI_API_KEY is not set in .env.local");
    }

    // Polyfill for Vercel AI SDK
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
    }

    return google("gemini-2.5-flash");
}
