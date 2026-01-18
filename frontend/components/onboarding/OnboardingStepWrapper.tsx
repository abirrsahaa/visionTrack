"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SystemButton } from "@/components/shared/SystemButton";

interface OnboardingStepWrapperProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  children: ReactNode;
  canProceed?: boolean;
  nextLabel?: string;
  showProgress?: boolean;
}

const stepLabels = ["VISION", "DOMAINS", "IMAGES", "DESIGN", "GOALS", "SETUP"];

export function OnboardingStepWrapper({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  children,
  canProceed = true,
  nextLabel = "Continue",
  showProgress = true,
}: OnboardingStepWrapperProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Progress Bar */}
      {showProgress && (
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              {stepLabels.map((label, index) => (
                <div
                  key={index}
                  className={`flex-1 text-center ${
                    index < currentStep
                      ? "text-blue-600"
                      : index === currentStep
                      ? "text-blue-700 font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  <div className="font-mono text-xs uppercase">{label}</div>
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="text-center mt-2 font-mono text-xs text-gray-500">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <SystemButton
            variant="outline"
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </SystemButton>

          <SystemButton
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            {nextLabel}
            <ChevronRight className="w-4 h-4" />
          </SystemButton>
        </div>
      </div>
    </div>
  );
}
