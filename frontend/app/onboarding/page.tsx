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
import { extractDomainsFromVision } from "@/app/functions/extraction";

const TOTAL_STEPS = 6;

// Enhanced Domain Type from AI
interface ExtractedDomain {
  name: string;
  description: string;
  suggestedGoal: string;
  colorHex: string;
  imageKeywords: string[];
}

interface Goal {
  domain: string;
  milestones: string[];
  todos: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [visionText, setVisionText] = useState("");

  // State for AI Results
  const [extractedDomains, setExtractedDomains] = useState<ExtractedDomain[]>([]);
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
    const savedDomains = localStorage.getItem("onboarding-domains");
    const savedImages = localStorage.getItem("onboarding-images");
    const savedGoals = localStorage.getItem("onboarding-goals");

    if (savedStep) {
      const step = parseInt(savedStep, 10);
      // Safety Check: If trying to access steps 2+ without domains, force back to vision step
      if (step >= 2 && (!savedDomains || JSON.parse(savedDomains).length === 0)) {
        setCurrentStep(1);
      } else {
        setCurrentStep(step);
      }
    }
    if (savedVision) setVisionText(savedVision);
    if (savedDomains) setExtractedDomains(JSON.parse(savedDomains));
    if (savedImages) setDomainImages(JSON.parse(savedImages));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  // Save state on changes
  useEffect(() => {
    if (extractedDomains.length > 0) {
      localStorage.setItem("onboarding-domains", JSON.stringify(extractedDomains));
    }
  }, [extractedDomains]);

  useEffect(() => {
    localStorage.setItem("onboarding-images", JSON.stringify(domainImages));
  }, [domainImages]);

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("onboarding-goals", JSON.stringify(goals));
    }
  }, [goals]);

  // Initialize goals when domains are extracted (only if no saved goals)
  useEffect(() => {
    if (extractedDomains.length > 0 && goals.length === 0) {
      const initialGoals: Goal[] = extractedDomains.map((domain) => ({
        domain: domain.name,
        milestones: [
          `Q1: Foundation - ${domain.suggestedGoal.split(" ").slice(0, 4).join(" ")}...`,
          "Q2: Build Consistency & Systems",
          "Q3: Achieve Breakthrough Results",
          "Q4: Mastery & Review",
        ],
        todos: [
          `Week 1: Assess current state of ${domain.name}`,
          "Week 2: Define specific success metrics",
          "Week 3: Execute first major action item",
          "Week 4: Review progress and adjust plan",
        ],
      }));
      setGoals(initialGoals);
    }
  }, [extractedDomains, goals.length]);



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
      const result = await extractDomainsFromVision(visionText);

      if (result.success && result.data) {
        setExtractedDomains(result.data);
      } else {
        // Fallback or Error Toast here
        console.error("Failed to extract domains");
      }
    } catch (error) {
      console.error("Analysis failed", error);
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
        return extractedDomains.some((d) => (domainImages[d.name]?.length || 0) > 0);
      case 3:
        return selectedDesign !== null;
      case 4:
        return goals.length > 0;
      case 5:
        return true;
      default:
        return true;
    }
  })();

  const handleOnboardingComplete = () => {
    // Persist data
    const userData = {
      vision: visionText,
      domains: extractedDomains,
      domainImages,
      // Pass the design name/id 
      design: selectedDesign,
      goals,
      reminders: {
        bedtime: bedtimeReminder,
        morning: morningReminder
      },
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("vision-board-data", JSON.stringify(userData));

    // Clear drafts
    localStorage.removeItem("onboarding-current-step");
    localStorage.removeItem("onboarding-vision-draft");

    router.push("/dashboard");
  };

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS - 1) {
      handleOnboardingComplete();
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      localStorage.setItem("onboarding-current-step", nextStep.toString());
    }
  };

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
          // Pass just the names to VisionStep for compatibility, or update VisionStep to accept objects
          extractedDomains={extractedDomains.map(d => d.name)}
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
          images={Object.values(domainImages).flat()}
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
          onComplete={handleOnboardingComplete}
          domainImages={domainImages}
        />
      )}
    </OnboardingStepWrapper>
  );
}

