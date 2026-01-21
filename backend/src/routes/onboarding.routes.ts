import { Router } from 'express';
import * as onboardingController from '../controllers/onboarding.controller';

const router = Router();

router.post('/vision', onboardingController.analyzeVision);
router.post('/domains', onboardingController.saveDomains);
router.post('/goals/decompose', onboardingController.decomposeGoal);
router.post('/goals/save', onboardingController.saveGoalPlan);

export default router;
