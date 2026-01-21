import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import prisma from '../utils/prisma';

// 2.1 Onboarding Flow: Life Vision Definition
export const analyzeVision = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vision } = req.body;
    if (!vision) {
      res.status(400).json({ error: 'Vision text is required' });
      return;
    }

    const domains = await aiService.suggestDomains(vision);
    res.json({ domains });
  } catch (error) {
    console.error('Error analyzing vision:', error);
    res.status(500).json({ error: 'Failed to analyze vision' });
  }
};

// 2.1 Onboarding Flow: Step 3 & 4 - Save Domains and (Mock) Generate Board
export const saveDomains = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, domains } = req.body; // Expecting { name, description, color }[]
    // Note: Authentication middleware should provide userId in req.user, using body for now for simplicity if no auth header yet.

    // In a real app, use transaction
    const savedDomains = [];
    for (const d of domains) {
      const domain = await prisma.domain.create({
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
  } catch (error) {
    console.error('Error saving domains:', error);
    res.status(500).json({ error: 'Failed to save domains' });
  }
};

// 2.1 Onboarding Flow: Step 5 - Goal Decomposition
export const decomposeGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { goalTitle, domainName, domainId, userId } = req.body;

    const decomposition = await aiService.decomposeGoal(goalTitle, domainName);

    // Optionally save the goal tentatively or just return the plan for approval
    res.json({ decomposition });
  } catch (error) {
    console.error('Error decomposing goal:', error);
    res.status(500).json({ error: 'Failed to decompose goal' });
  }
};

// Confirm/Save Goal and Plan (Transactional)
export const saveGoalPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, domainId, goalTitle, milestones, todos } = req.body;

    // Use transaction to ensure data integrity
    const result = await prisma.$transaction(async (tx) => {
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
              data: milestones.map((m: any) => ({
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
              data: todos.map((t: any) => ({
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
  } catch (error) {
    console.error('Error saving goal plan:', error);
    res.status(500).json({ error: 'Failed to save goal plan' });
  }
};
