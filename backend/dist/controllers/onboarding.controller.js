"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveGoalPlan = exports.decomposeGoal = exports.saveDomains = exports.analyzeVision = void 0;
const ai_service_1 = require("../services/ai.service");
const prisma_1 = __importDefault(require("../utils/prisma"));
// 2.1 Onboarding Flow: Life Vision Definition
const analyzeVision = async (req, res) => {
    try {
        const { vision } = req.body;
        if (!vision) {
            res.status(400).json({ error: 'Vision text is required' });
            return;
        }
        const domains = await ai_service_1.aiService.suggestDomains(vision);
        res.json({ domains });
    }
    catch (error) {
        console.error('Error analyzing vision:', error);
        res.status(500).json({ error: 'Failed to analyze vision' });
    }
};
exports.analyzeVision = analyzeVision;
// 2.1 Onboarding Flow: Step 3 & 4 - Save Domains and (Mock) Generate Board
const saveDomains = async (req, res) => {
    try {
        const { userId, domains } = req.body; // Expecting { name, description, color }[]
        // Note: Authentication middleware should provide userId in req.user, using body for now for simplicity if no auth header yet.
        // In a real app, use transaction
        const savedDomains = [];
        for (const d of domains) {
            const domain = await prisma_1.default.domain.create({
                data: {
                    userId,
                    name: d.name,
                    description: d.description,
                    colorHex: d.color,
                    sortOrder: d.sortOrder || 0,
                }
            });
            savedDomains.push(domain);
        }
        res.json({ message: 'Domains saved', domains: savedDomains });
    }
    catch (error) {
        console.error('Error saving domains:', error);
        res.status(500).json({ error: 'Failed to save domains' });
    }
};
exports.saveDomains = saveDomains;
// 2.1 Onboarding Flow: Step 5 - Goal Decomposition
const decomposeGoal = async (req, res) => {
    try {
        const { goalTitle, domainName, domainId, userId } = req.body;
        const decomposition = await ai_service_1.aiService.decomposeGoal(goalTitle, domainName);
        // Optionally save the goal tentatively or just return the plan for approval
        res.json({ decomposition });
    }
    catch (error) {
        console.error('Error decomposing goal:', error);
        res.status(500).json({ error: 'Failed to decompose goal' });
    }
};
exports.decomposeGoal = decomposeGoal;
// Confirm/Save Goal and Plan (Transactional)
const saveGoalPlan = async (req, res) => {
    try {
        const { userId, domainId, goalTitle, milestones, todos } = req.body;
        // Use transaction to ensure data integrity
        const result = await prisma_1.default.$transaction(async (tx) => {
            // 1. Create Goal
            const goal = await tx.goal.create({
                data: {
                    domainId,
                    title: goalTitle,
                    startDate: new Date(),
                    status: 'active'
                }
            });
            // 2. Create Milestones (using createMany for efficiency if supported by DB,
            // but Postgres with Prisma supports createMany)
            if (milestones && milestones.length > 0) {
                await tx.milestone.createMany({
                    data: milestones.map((m) => ({
                        goalId: goal.id,
                        title: m.title,
                        sortOrder: m.sortOrder,
                    }))
                });
            }
            // 3. Create Todos
            // We need to attach todos to goal.
            // If we needed to attach to specific milestones, we'd need to fetch created milestones first.
            // For this simplified flow, we attach to goal/domain.
            if (todos && todos.length > 0) {
                await tx.todo.createMany({
                    data: todos.map((t) => ({
                        goalId: goal.id,
                        domainId,
                        title: t.title,
                        description: t.description,
                        status: 'pending'
                    }))
                });
            }
            return goal;
        });
        res.json({ message: 'Goal plan saved', goalId: result.id });
    }
    catch (error) {
        console.error('Error saving goal plan:', error);
        res.status(500).json({ error: 'Failed to save goal plan' });
    }
};
exports.saveGoalPlan = saveGoalPlan;
