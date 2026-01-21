"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingStepWrapper } from "@/components/onboarding/OnboardingStepWrapper";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { VisionStep } from "@/components/onboarding/VisionStep";
import { DomainImageStep } from "@/components/onboarding/DomainImageStep";
import { DesignSelectorStep } from "@/components/onboarding/DesignSelectorStep";
import { GoalReviewStep } from "@/components/onboarding/GoalReviewStep";
import { SetupStep } from "@/components/onboarding/SetupStep";
import * as api from "@/lib/api";

const TOTAL_STEPS = 6;

interface Goal {
  domain: string;
  milestones: string[];
  todos: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [visionText, setVisionText] = useState("");
  const [extractedDomains, setExtractedDomains] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [domainImages, setDomainImages] = useState<Record<string, string[]>>({});
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bedtimeReminder, setBedtimeReminder] = useState("22:00");
  const [morningReminder, setMorningReminder] = useState("07:00");

  // Load saved progress
  useEffect(() => {
    const savedStep = localStorage.getItem("onboarding-current-step");
    const savedVision = localStorage.getItem("onboarding-vision-draft");
    
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
    if (savedVision) {
      setVisionText(savedVision);
    }
  }, []);

  // Initialize goals when domains are extracted
  useEffect(() => {
    const fetchGoals = async () => {
      if (extractedDomains.length > 0 && goals.length === 0) {
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
          const initialGoals: Goal[] = extractedDomains.map((domain) => ({
            domain,
            milestones: [
              `Q1: Establish foundation for ${domain}`,
              `Q2: Build momentum in ${domain}`,
              `Q3: Achieve key milestones in ${domain}`,
              `Q4: Reflect and plan next year for ${domain}`,
            ],
            todos: [
              `Week 1: Research and plan ${domain} strategy`,
              `Week 2: Take first action steps`,
              `Week 3: Measure progress and adjust`,
              `Week 4: Review and set next month goals`,
            ],
          }));
          setGoals(initialGoals);
        } else {
          // Fetch from backend
          const promises = extractedDomains.map(async (domain) => {
            try {
              const res = await api.decomposeGoal(`Achieve success in ${domain}`, domain);
              const decomp = res.decomposition;
              return {
                domain,
                milestones: decomp.milestones.map((m: any) => m.title),
                todos: decomp.todos.map((t: any) => t.title),
              };
            } catch (e) {
              console.error(`Failed to decompose goal for ${domain}`, e);
              // Fallback
              return {
                domain,
                milestones: [`Start ${domain}`],
                todos: [`Research ${domain}`],
              };
            }
          });

          const results = await Promise.all(promises);
          setGoals(results);
        }
      }
    };

    fetchGoals();
  }, [extractedDomains, goals.length]);

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      localStorage.setItem("onboarding-current-step", nextStep.toString());
    } else if (currentStep === TOTAL_STEPS - 1) {
      // Final step completion
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'true') {
        try {
          // 1. Save domains first to get IDs (Simplified: API returns saved domains with IDs)
          // Ideally api.saveDomains should return the created domains with IDs.
          // For now, assuming we get them back in order or logic is slightly different.
          const domainRes = await api.saveDomains(extractedDomains.map(d => ({ name: d, description: '', color: '#000000' })));

          const savedDomains = domainRes.domains;

          // 2. Save goals for each domain
          // We need to match goals to saved domains.
          // Assuming order is preserved or we map by name.

          const savePromises = goals.map(async (goal) => {
              const matchedDomain = savedDomains.find((d: any) => d.name === goal.domain);
              if (matchedDomain) {
                  await api.saveGoalPlan(
                      matchedDomain.id,
                      `Achieve success in ${goal.domain}`, // Title
                      goal.milestones.map((m, i) => ({ title: m, sort_order: i + 1 })),
                      goal.todos.map((t) => ({ title: t, description: '' }))
                  );
              }
          });

          await Promise.all(savePromises);
          console.log("Onboarding data saved successfully.");
        } catch (error) {
          console.error("Error saving onboarding data", error);
          // Don't block navigation on error for prototype, but log it
        }
      }

      // Navigate to dashboard
      router.push('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      localStorage.setItem("onboarding-current-step", prevStep.toString());
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        // Simulate AI extraction
        setTimeout(() => {
          const mockDomains = ["Career & Growth", "Health", "Mindfulness", "Financial Freedom"];
          setExtractedDomains(mockDomains);
          setIsAnalyzing(false);
        }, 2000);
      } else {
        const result = await api.analyzeVision(visionText);
        setExtractedDomains(result.domains.map((d: any) => d.name));
      }
    } catch (error) {
      console.error("Failed to analyze vision", error);
      // Fallback
      setExtractedDomains(["Health", "Career", "Relationships"]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDomainImagesChange = (domain: string, images: string[]) => {
    setDomainImages((prev) => ({ ...prev, [domain]: images }));
  };

  const handleGoalsChange = (newGoals: Goal[]) => {
    setGoals(newGoals);
  };

  const handleRemindersChange = (bedtime: string, morning: string) => {
    setBedtimeReminder(bedtime);
    setMorningReminder(morning);
  };

  // Determine if user can proceed
  const canProceed = (() => {
    switch (currentStep) {
      case 1:
        return visionText.trim().length > 0;
      case 2:
        // Check if at least one domain has images
        return extractedDomains.some((domain) => (domainImages[domain]?.length || 0) > 0);
      case 3:
        return selectedDesign !== null;
      case 4:
        return goals.length > 0;
      case 5:
        return true; // Setup step always allowed
      default:
        return true;
    }
  })();

  return (
    <OnboardingStepWrapper
      currentStep={currentStep}
      totalSteps={TOTAL_STEPS}
      onNext={handleNext}
      onPrevious={handlePrevious}
      canProceed={canProceed}
      nextLabel={currentStep === TOTAL_STEPS - 1 ? "Complete Setup" : "Continue"}
    >
      {currentStep === 0 && <WelcomeStep />}
      {currentStep === 1 && (
        <VisionStep
          visionText={visionText}
          onVisionChange={setVisionText}
          extractedDomains={extractedDomains}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />
      )}
      {currentStep === 2 && (
        <DomainImageStep
          domains={extractedDomains}
          domainImages={domainImages}
          onDomainImagesChange={handleDomainImagesChange}
          currentDomainIndex={currentDomainIndex}
          onDomainChange={setCurrentDomainIndex}
        />
      )}
      {currentStep === 3 && (
        <DesignSelectorStep
          selectedDesign={selectedDesign}
          onDesignSelect={setSelectedDesign}
        />
      )}
      {currentStep === 4 && (
        <GoalReviewStep
          goals={goals}
          onGoalsChange={handleGoalsChange}
        />
      )}
      {currentStep === 5 && (
        <SetupStep
          bedtimeReminder={bedtimeReminder}
          morningReminder={morningReminder}
          onRemindersChange={handleRemindersChange}
        />
      )}
    </OnboardingStepWrapper>
  );
}
