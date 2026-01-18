"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface DesignSelectorStepProps {
  selectedDesign: string | null;
  onDesignSelect: (designId: string) => void;
}

const designs = [
  { id: "grid", name: "Grid", description: "Balanced, structured layout" },
  { id: "collage", name: "Collage", description: "Organic, overlapping arrangement" },
  { id: "cinematic", name: "Cinematic", description: "Wide aspect, dramatic focus" },
  { id: "minimalist", name: "Minimalist", description: "Clean lines, lots of space" },
  { id: "symmetric", name: "Symmetric", description: "Mirror-perfect balance" },
];

export function DesignSelectorStep({
  selectedDesign,
  onDesignSelect,
}: DesignSelectorStepProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Choose Your Board Design
        </h2>
        <p className="text-gray-600">
          Select a design style that resonates with you. You can change this later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design, index) => {
          const isSelected = selectedDesign === design.id;
          return (
            <motion.button
              key={design.id}
              onClick={() => onDesignSelect(design.id)}
              className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                isSelected
                  ? "border-blue-600 ring-4 ring-blue-200 shadow-2xl"
                  : "border-gray-300 hover:border-blue-400 shadow-lg"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Mock Preview */}
              <div
                className={`w-full h-full ${
                  design.id === "grid"
                    ? "bg-gradient-to-br from-blue-400 to-purple-500"
                    : design.id === "collage"
                    ? "bg-gradient-to-tr from-pink-400 to-orange-500"
                    : design.id === "cinematic"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                    : design.id === "minimalist"
                    ? "bg-gradient-to-br from-gray-200 to-gray-400"
                    : "bg-gradient-to-bl from-yellow-400 to-pink-500"
                }`}
              >
                {/* Pattern overlay based on design type */}
                {design.id === "grid" && (
                  <div
                    className="w-full h-full opacity-30"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: "20px 20px",
                    }}
                  />
                )}
                {design.id === "collage" && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/30 rounded-full transform rotate-45" />
                    <div className="w-16 h-16 bg-white/20 rounded-lg absolute top-4 left-4" />
                    <div className="w-20 h-20 bg-white/25 rounded-full absolute bottom-4 right-4" />
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-3 right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              )}

              {/* Design Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                <h3 className="font-bold text-lg mb-1">{design.name}</h3>
                <p className="text-sm text-white/90">{design.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedDesign && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <p className="text-sm text-blue-700">
            Selected: <span className="font-semibold">{designs.find((d) => d.id === selectedDesign)?.name}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
