"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SystemButton } from "@/components/shared/SystemButton";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-transparent flex flex-col relative z-10">
      {/* Progress Bar (Glass Header) */}
      {showProgress && (
        <div className="sticky top-0 z-50 glass-panel-subtle border-b border-white/5 backdrop-blur-md">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              {stepLabels.map((label, index) => (
                <div
                  key={index}
                  className={`flex-1 text-center transition-all duration-300 relative ${index < currentStep
                    ? "text-neon-cyan/70"
                    : index === currentStep
                      ? "text-neon-cyan font-bold scale-110"
                      : "text-gray-600"
                    }`}
                >
                  <div className={cn(
                    "font-mono text-xs uppercase tracking-widest",
                    index === currentStep && "glow-text-cyan"
                  )}>{label}</div>

                  {/* Active Indicator Dot */}
                  {index === currentStep && (
                    <motion.div
                      layoutId="activeStep"
                      className="absolute -bottom-6 left-0 right-0 h-1 bg-neon-cyan shadow-[0_0_10px_#06b6d4] mx-auto w-12 rounded-full"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* HUD Style Progress Line */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-6 relative">
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              <motion.div
                className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan relative"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Glowing Head */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#fff]" />
              </motion.div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                SYS_STATUS: ONLINE
              </div>
              <div className="font-mono text-xs text-neon-cyan">
                STEP_0{currentStep + 1} // 0{totalSteps}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-12 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Navigation - Floating Dock */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-40">
          <div className="max-w-[1600px] mx-auto flex justify-between items-center pointer-events-auto">
            <SystemButton
              variant="outline"
              onClick={onPrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 border-white/10 hover:bg-white/5 text-gray-400 hover:text-white ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </SystemButton>

            <SystemButton
              onClick={onNext}
              disabled={!canProceed}
              variant="gradient-purple"
              className="flex items-center gap-2 px-8 py-3 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all"
            >
              {nextLabel}
              <ChevronRight className="w-4 h-4" />
            </SystemButton>
          </div>
        </div>
      </div>
    </div>
  );
}
