"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { SystemButton } from "@/components/shared/SystemButton";

interface VisionStepProps {
  visionText: string;
  onVisionChange: (text: string) => void;
  extractedDomains?: string[];
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
}

export function VisionStep({
  visionText,
  onVisionChange,
  extractedDomains = [],
  onAnalyze,
  isAnalyzing = false,
}: VisionStepProps) {
  const wordCount = visionText.trim().split(/\s+/).filter(Boolean).length;

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("onboarding-vision-draft");
    if (saved && !visionText) {
      onVisionChange(saved);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visionText) {
        localStorage.setItem("onboarding-vision-draft", visionText);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [visionText]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Envision Your Future
        </h2>
        <p className="text-gray-600">
          Describe your ideal life 1 year from now. What have you achieved? How do you feel?
          Be as detailed as possible—our AI will handle the rest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <motion.textarea
              value={visionText}
              onChange={(e) => onVisionChange(e.target.value)}
              placeholder="I wake up in my sun-lit apartment overlooking the city. I've successfully launched my sustainable fashion brand, and I feel a deep sense of purpose. My mornings start with yoga and meditation, followed by meaningful work that aligns with my values..."
              rows={12}
              className="w-full bg-white border-2 border-gray-300 rounded-lg p-4 font-sans text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              whileFocus={{ scale: 1.01 }}
            />
            <div className="absolute bottom-4 right-4 font-mono text-xs text-gray-400">
              {wordCount} words
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>• Auto-saving...</span>
            <SystemButton
              onClick={onAnalyze}
              disabled={!visionText.trim() || isAnalyzing}
              isLoading={isAnalyzing}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Analyze & Continue
              <span className="text-xs">→</span>
            </SystemButton>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-24">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">
              Preview: Your Future Board
            </h3>

            {/* AI Domain Extraction Card */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold text-gray-900 text-sm">AI Domain Extraction</h4>
              </div>
              {extractedDomains.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {extractedDomains.map((domain, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200"
                    >
                      {domain}
                    </motion.span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Waiting for input...
                </p>
              )}
            </div>

            {/* Visual Collection Card */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 text-gray-400">🖼️</div>
                <h4 className="font-semibold text-gray-900 text-sm">Visual Collection</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center"
                    >
                      <span className="text-xs text-gray-400">+</span>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-400 italic mt-2 text-center">
                Waiting for input...
              </p>
            </div>

            {/* Board Layout Card */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 text-gray-400">⚏</div>
                <h4 className="font-semibold text-gray-900 text-sm">Board Layout</h4>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚏</div>
                  <p className="text-xs text-gray-400">Generated Layout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
