"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { VisionBoard, Domain, Goal as GoalType } from "@/lib/types";

// ... existing syncOnboardingData ...
// (I will assume syncOnboardingData uses 'prisma' variable which is now imported)

// To handle the 'syncOnboardingData' which is above the replacement chunk in the previous tool use
// I need to replace the top of the file.

// Wait, I cannot see the whole file in my mind perfectly to ensure I don't break syncOnboardingData.
// Logic:
// 1. Remove "import { PrismaClient } ..." and "const prisma = ..."
// 2. Add "import { prisma } from '@/lib/prisma';"
// 3. Fix getCurrentBoard return.
// 4. Fix map types.

// I'll do this in chunks. First the imports.


interface OnboardingData {
    vision: string;
    domains: Array<{
        name: string;
        description: string;
        colorHex: string;
        imageKeywords: string[];
    }>;
    domainImages: Record<string, string[]>;
    design: string | null;
    goals: Array<{
        domain: string;
        milestones: string[];
        todos: string[];
    }>;
    reminders: {
        bedtime: string;
        morning: string;
    };
}

export async function syncOnboardingData(data: OnboardingData) {
    try {
        // 1. Create or Update User
        // For now, we'll create a dummy user or use a fixed one since auth isn't fully set up with a provider yet.
        // In a real app, we'd get the user ID from the session.
        const clerkUser = await currentUser();
        if (!clerkUser?.emailAddresses[0]) return { success: false, error: "Unauthorized" };
        const userEmail = clerkUser.emailAddresses[0].emailAddress;

        const user = await prisma.user.upsert({
            where: { email: userEmail },
            update: {
                visionMotto: data.vision,
                bedtimeReminder: data.reminders.bedtime,
                morningReminder: data.reminders.morning,
            },
            create: {
                email: userEmail,
                name: "Architect",
                visionMotto: data.vision,
                bedtimeReminder: data.reminders.bedtime,
                morningReminder: data.reminders.morning,
                username: "architect", // Default
            },
        });

        // 2. Create Domains and Images
        for (const d of data.domains) {
            let domain = await prisma.domain.findFirst({
                where: {
                    userId: user.id,
                    name: d.name
                }
            });

            if (!domain) {
                domain = await prisma.domain.create({
                    data: {
                        userId: user.id,
                        name: d.name,
                        description: d.description,
                        colorHex: d.colorHex,
                        imageKeywords: d.imageKeywords,
                    },
                });
            } else {
                // Optional: Update exist domain if needed, but for now just skip creation
            }

            // Add Images
            const images = data.domainImages[d.name] || [];
            if (images.length > 0) {
                await prisma.domainImage.createMany({
                    data: images.map((url, index) => ({
                        domainId: domain.id,
                        url: url,
                        sortOrder: index,
                    })),
                });
            }

            // 3. Create Goals
            const goals = data.goals.filter((g) => g.domain === d.name);
            for (const g of goals) {
                await prisma.goal.create({
                    data: {
                        domainId: domain.id,
                        title: "Strategic Goal", // The frontend 'goals' object structure seems to lack a 'title', using generic or mapping differently?
                        // Wait, looking at OnboardingPage.tsx, 'goals' are 'Goal[]' where Goal has domain, milestones, todos.
                        // But no explicit title for the Goal itself? It seems the Domain's 'suggestedGoal' was the high level one.
                        // Let's assume the first milestone or the domain name implies the goal for now.
                        // Actually, let's just use "Q1 Objective" as a placeholder or map better if possible.
                        status: "ACTIVE",
                        milestones: {
                            create: g.milestones.map((m) => ({
                                title: m,
                                isCompleted: false,
                            })),
                        },
                    },
                });
            }
        }

        // 4. Create Initial Vision Board
        await prisma.visionBoard.create({
            data: {
                userId: user.id,
                type: "WEEKLY", // Default
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                designId: data.design,
                isPublic: true,
                totalPixels: 7500, // Default from setup
                coloredPixels: 0,
                pixelState: [], // Empty initially
            },
        });

        revalidatePath("/dashboard");
        return { success: true, userId: user.id };
    } catch (error) {
        console.error("Sync failed:", error);
        return { success: false, error: "Failed to persist onboarding data" };
    }
}
// ... existing code ...

import { currentUser } from "@clerk/nextjs/server";

// ... existing code ...

export async function getCurrentBoard(): Promise<VisionBoard | null> {
    const clerkUser = await currentUser();
    if (!clerkUser?.emailAddresses[0]) return null;

    const user = await prisma.user.findUnique({ where: { email: clerkUser.emailAddresses[0].emailAddress } });
    if (!user) return null;

    const board = await prisma.visionBoard.findFirst({
        where: {
            userId: user.id,
            endDate: { gte: new Date() }
        },
        orderBy: { startDate: 'desc' }
    });

    if (!board) return null;

    return {
        id: board.id,
        userId: board.userId,
        boardType: board.type as any,
        periodStart: board.startDate.toISOString(),
        periodEnd: board.endDate.toISOString(),
        designStyle: board.designId || "grid",
        layoutMetadata: board.layoutMetadata as any,
        baseImageUrl: board.baseImage || "",
        currentImageUrl: board.baseImage || "",
        totalPixels: board.totalPixels,
        coloredPixels: board.coloredPixels,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };
}

export async function getDomains(): Promise<Domain[]> {
    const clerkUser = await currentUser();
    if (!clerkUser?.emailAddresses[0]) return [];

    const user = await prisma.user.findUnique({ where: { email: clerkUser.emailAddresses[0].emailAddress } });
    if (!user) return [];

    const domains = await prisma.domain.findMany({
        where: { userId: user.id },
        include: { images: { orderBy: { sortOrder: 'asc' } } }
    });

    return domains.map((d: any) => ({
        id: d.id,
        name: d.name,
        description: d.description || "",
        colorHex: d.colorHex,
        sortOrder: 0,
        createdAt: new Date().toISOString(),
        images: d.images.map((img: any) => ({
            id: img.id,
            imageUrl: img.url,
            sortOrder: img.sortOrder,
            uploadedAt: new Date().toISOString()
        }))
    }));
}

export async function getGoals(): Promise<GoalType[]> {
    const clerkUser = await currentUser();
    if (!clerkUser?.emailAddresses[0]) return [];

    const user = await prisma.user.findUnique({ where: { email: clerkUser.emailAddresses[0].emailAddress } });
    if (!user) return [];

    const goals = await prisma.goal.findMany({
        where: {
            domain: { userId: user.id },
            status: "ACTIVE"
        },
        include: { milestones: true }
    });

    return goals.map((g: any) => ({
        id: g.id,
        domainId: g.domainId,
        title: g.title,
        description: "",
        status: g.status.toLowerCase() as any,
        startDate: g.createdAt.toISOString(),
        targetDate: null,
        createdAt: g.createdAt.toISOString(),
        milestones: g.milestones.map((m: any) => ({
            id: m.id,
            title: m.title,
            targetDate: null,
            completedAt: m.isCompleted ? new Date().toISOString() : null,
            sortOrder: 0
        }))
    }));
}
// ... existing code ...

export async function submitJournal(text: string): Promise<{ success: boolean; pixelsEarned: number }> {
    const clerkUser = await currentUser();
    if (!clerkUser?.emailAddresses[0]) return { success: false, pixelsEarned: 0 };

    const user = await prisma.user.findUnique({ where: { email: clerkUser.emailAddresses[0].emailAddress } });
    if (!user) return { success: false, pixelsEarned: 0 };

    const today = new Date();

    // 1. Create Journal Entry
    await prisma.dailyJournal.create({
        data: {
            userId: user.id,
            date: today,
            text: text,
            sentiment: "neutral", // analyze with AI later
            effortScore: 5
        }
    });

    // 2. Reward Pixels
    const PIXEL_REWARD = 50;

    // Update Board
    const board = await prisma.visionBoard.findFirst({
        where: { userId: user.id, endDate: { gte: today } },
        orderBy: { startDate: 'desc' }
    });

    if (board) {
        await prisma.visionBoard.update({
            where: { id: board.id },
            data: {
                coloredPixels: { increment: PIXEL_REWARD },
                // complex: update pixelState here? For MVP, just update count. 
                // PixelatedBoard renders based on count random fill locally if state is missing.
            }
        });
    }

    revalidatePath("/dashboard");
    return { success: true, pixelsEarned: PIXEL_REWARD };
}
// ... existing code ...

export async function getJournals() {
    const clerkUser = await currentUser();
    if (!clerkUser?.emailAddresses[0]) return [];

    const user = await prisma.user.findUnique({ where: { email: clerkUser.emailAddresses[0].emailAddress } });
    if (!user) return [];

    const journals = await prisma.dailyJournal.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 365
    });

    return journals.map((j: any) => ({
        id: j.id,
        userId: j.userId,
        journalDate: j.date.toISOString().split('T')[0], // format YYYY-MM-DD
        entryText: j.text,
        emotionalState: j.sentiment,
        energyLevel: j.effortScore,
        aiReflection: null,
        submittedAt: j.date.toISOString(),
        completedTasks: [] // handle task completion JSON parsing if needed
    }));
}

export async function getTimelineWeeks(count: number = 26) {
    const clerkUser = await currentUser();
    if (!clerkUser?.emailAddresses[0]) return [];

    const user = await prisma.user.findUnique({ where: { email: clerkUser.emailAddresses[0].emailAddress } });
    if (!user) return [];

    const snapshots = await prisma.timelineSnapshot.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: count
    });

    // Map to frontend TimelineSnapshot type
    return snapshots.map((s) => ({
        id: s.id,
        snapshotDate: s.date.toISOString(),
        weekNumber: Math.ceil((s.date.getDate() - 1) / 7), // Approximate or store explicit week
        pixelsSummary: {
            totalPixels: s.pixelCount,
            completionRate: s.completionRate,
            domainBreakdown: [] // Need to store this in snapshot if we want it
        },
        narrativeText: s.narrative || "",
        highlightImage: s.imageUrl || "/placeholder-board.png",
        topDomains: []
    }));
}
