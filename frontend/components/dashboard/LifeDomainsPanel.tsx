"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Plus, BarChart3 } from "lucide-react";
import type { Domain } from "@/lib/types";

interface LifeDomainsPanelProps {
  domains: Domain[];
  domainProgress?: Map<string, number>;
  onAddDomain?: () => void;
  onDomainClick?: (domain: Domain) => void;
}

const DomainSegmentedBar = memo(({ percentage, colorHex }: { percentage: number; colorHex: string }) => {
  const totalSegments = 20;
  const activeSegments = Math.round((percentage / 100) * totalSegments);

  return (
    <div className="flex gap-[2px] h-2">
      {[...Array(totalSegments)].map((_, i) => {
        const isActive = i < activeSegments;
        return (
          <div
            key={i}
            className={`flex-1 rounded-[1px] transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-10 bg-white/5'}`}
            style={{
              backgroundColor: isActive ? colorHex : undefined,
              boxShadow: isActive ? `0 0 5px ${colorHex}40` : 'none'
            }}
          />
        );
      })}
    </div>
  );
});

DomainSegmentedBar.displayName = "DomainSegmentedBar";

export const LifeDomainsPanel = memo(function LifeDomainsPanel({
  domains,
  domainProgress = new Map(),
  onAddDomain,
  onDomainClick,
}: LifeDomainsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-foreground-tertiary" />
          <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
            Life Domains
          </h3>
        </div>

        {onAddDomain && (
          <motion.button
            onClick={onAddDomain}
            className="p-1 text-foreground-tertiary hover:text-foreground transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      <div className="space-y-5">
        {domains.map((domain, index) => {
          const percentage = domainProgress.get(domain.id) || 0;
          const domainNumber = String(index + 1).padStart(2, "0");

          return (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => onDomainClick?.(domain)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-mono text-foreground-tertiary opacity-50">{domainNumber}</span>
                  <span className="text-xs font-bold text-foreground-secondary group-hover:text-foreground transition-colors uppercase tracking-wide">
                    {domain.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold" style={{ color: domain.colorHex }}>
                  {percentage}%
                </span>
              </div>

              {/* Segmented Progress Bar */}
              <DomainSegmentedBar percentage={percentage} colorHex={domain.colorHex} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
