import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";

// We will import functions here as we create them
import { generateWeeklyPlan } from "@/app/functions/inngest/weekly-planning";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        generateWeeklyPlan
    ],
});
