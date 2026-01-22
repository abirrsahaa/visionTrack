import { inngest } from "@/lib/inngest/client";
import { getModel } from "@/lib/ai/model";
import { generateText } from "ai";

export const generateWeeklyPlan = inngest.createFunction(
    { id: "generate-weekly-plan" },
    [
        { cron: "0 9 * * 1" }, // Every Monday at 9:00 AM
        { event: "app/planning.requested" }, // Manual trigger
    ],
    async ({ step, event }) => {

        // Step 1: Fetch active users (Mock)
        const activeUsers = await step.run("fetch-active-users", async () => {
            // In a real app, db.users.find({ status: 'active' })
            return [
                { id: "user_1", name: "Abir", focusDomains: ["Career", "Health"] },
                { id: "user_2", name: "Demo User", focusDomains: ["Learning"] }
            ];
        });

        // Step 2: Generate Plans for each user
        const results = await step.run("generate-plans", async () => {
            const plans = [];

            for (const user of activeUsers) {
                // Simulate AI processing
                // const { text } = await generateText({
                //   model: getModel(),
                //   prompt: `Generate a weekly plan for ${user.name} focusing on ${user.focusDomains.join(", ")}`
                // });

                plans.push({
                    userId: user.id,
                    status: "generated",
                    // plan: text
                    plan: "Mock Plan Generated"
                });
            }
            return plans;
        });

        // Step 3: Send Notifications (Mock)
        await step.run("notify-users", async () => {
            console.log(`Notified ${results.length} users about their new weekly plans.`);
            return { sent: results.length };
        });

        return { success: true, processed: results.length };
    }
);
