import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users. Checking for duplicate domains...`);

    for (const user of users) {
        const domains = await prisma.domain.findMany({
            where: { userId: user.id }
        });

        const seenNames = new Set();
        const duplicates = [];

        for (const domain of domains) {
            if (seenNames.has(domain.name)) {
                duplicates.push(domain.id);
            } else {
                seenNames.add(domain.name);
            }
        }

        if (duplicates.length > 0) {
            console.log(`Deleting ${duplicates.length} duplicate domains for user ${user.email}...`);

            // 1. Delete dependent DomainImages
            await prisma.domainImage.deleteMany({
                where: { domainId: { in: duplicates } }
            });

            // 2. Delete dependent Goals and Milestones
            // First find goal IDs to delete milestones
            const goals = await prisma.goal.findMany({
                where: { domainId: { in: duplicates } },
                select: { id: true }
            });
            const goalIds = goals.map(g => g.id);

            if (goalIds.length > 0) {
                await prisma.milestone.deleteMany({
                    where: { goalId: { in: goalIds } }
                });
                await prisma.goal.deleteMany({
                    where: { id: { in: goalIds } }
                });
            }

            // 3. Finally delete the Domains
            await prisma.domain.deleteMany({
                where: { id: { in: duplicates } }
            });
        } else {
            console.log(`No duplicates for ${user.email}.`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
