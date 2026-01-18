"use client";

import { motion } from "framer-motion";

interface AINarrativePanelProps {
  narrative?: string;
  recommendations?: string[];
  isLoading?: boolean;
}

export function AINarrativePanel({
  narrative,
  recommendations = [],
  isLoading = false,
}: AINarrativePanelProps) {
  const defaultNarrative =
    "Your pattern this week suggests a high cognitive load in the Career domain, yet you've maintained a 90% completion rate in Learning. The board is cooling in Health; consider a lower-intensity physical anchor tomorrow.";

  const defaultRecommendations = [
    'Shift "Sprint Planning" to Tuesday',
    "Add 20m Meditation",
  ];

  const displayNarrative = narrative || defaultNarrative;
  const displayRecommendations = recommendations.length > 0 ? recommendations : defaultRecommendations;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-blue-500"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <h3 className="font-mono text-xs font-semibold text-arch-dark-text-primary uppercase tracking-wider">
          AI NARRATIVE
        </h3>
      </div>

      {/* Narrative Text */}
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-4 bg-arch-dark-bg-tertiary rounded animate-pulse" />
          <div className="h-4 bg-arch-dark-bg-tertiary rounded animate-pulse w-5/6" />
          <div className="h-4 bg-arch-dark-bg-tertiary rounded animate-pulse w-4/6" />
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sans text-sm text-arch-dark-text-secondary leading-relaxed"
        >
          {displayNarrative}
        </motion.p>
      )}

      {/* Recommendations */}
      {displayRecommendations.length > 0 && (
        <div className="pt-4 border-t border-arch-dark-border-primary">
          <p className="font-mono text-xs font-semibold text-arch-dark-text-primary mb-3 uppercase tracking-wider">
            RECOMMENDED ADJUST:
          </p>
          <ul className="space-y-2">
            {displayRecommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 font-sans text-sm text-arch-dark-text-secondary"
              >
                <span className="text-arch-dark-text-tertiary mt-1">•</span>
                <span>{rec}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
