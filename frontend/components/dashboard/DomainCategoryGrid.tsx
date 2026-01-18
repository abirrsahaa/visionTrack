"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { Domain } from "@/lib/types";

interface DomainCategoryGridProps {
  domains: Domain[];
  onDomainClick?: (domain: Domain) => void;
  className?: string;
}

export function DomainCategoryGrid({
  domains,
  onDomainClick,
  className,
}: DomainCategoryGridProps) {
  // Get icon component based on domain name (simplified)
  const getDomainIcon = (domainName: string) => {
    // Simple mapping - in real app you'd use lucide-react icons
    return domainName.charAt(0).toUpperCase();
  };

  // Alternate colors: purple, orange
  const getColorForIndex = (index: number) => {
    return index % 2 === 0 ? "purple" : "orange";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">
        Choose Category
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {domains.map((domain, index) => {
          const colorType = getColorForIndex(index);
          const isPurple = colorType === "purple";
          
          return (
            <motion.button
              key={domain.id}
              onClick={() => onDomainClick?.(domain)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative overflow-hidden rounded-xl p-4 transition-all duration-200",
                isPurple
                  ? "bg-purple/20 border-2 border-purple/30 hover:bg-purple/30 hover:border-purple hover:glow-purple"
                  : "bg-orange/20 border-2 border-orange/30 hover:bg-orange/30 hover:border-orange hover:glow-orange"
              )}
            >
              {/* Background Gradient */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 hover:opacity-10 transition-opacity",
                  isPurple ? "gradient-purple" : "gradient-orange"
                )}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                {/* Icon Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors",
                    isPurple
                      ? "bg-purple/30 text-purple"
                      : "bg-orange/30 text-orange"
                  )}
                >
                  {getDomainIcon(domain.name)}
                </div>

                {/* Label */}
                <span className="text-xs font-medium text-foreground-secondary uppercase text-center">
                  {domain.name}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
