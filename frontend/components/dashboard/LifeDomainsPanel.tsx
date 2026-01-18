"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { DomainProgressItem } from "@/components/shared/DomainProgressItem";
import type { Domain } from "@/lib/types";

interface LifeDomainsPanelProps {
  domains: Domain[];
  domainProgress?: Map<string, number>;
  onAddDomain?: () => void;
  onDomainClick?: (domain: Domain) => void;
}

export function LifeDomainsPanel({
  domains,
  domainProgress = new Map(),
  onAddDomain,
  onDomainClick,
}: LifeDomainsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
          LIFE DOMAINS
        </h3>
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

      <div className="space-y-4">
        {domains.map((domain, index) => {
          const percentage = domainProgress.get(domain.id) || 0;
          const domainNumber = String(index + 1).padStart(2, "0");

          return (
            <DomainProgressItem
              key={domain.id}
              number={domainNumber}
              domainName={domain.name}
              percentage={Math.round(percentage)}
              color={domain.colorHex}
              onClick={() => onDomainClick?.(domain)}
            />
          );
        })}
      </div>
    </div>
  );
}
