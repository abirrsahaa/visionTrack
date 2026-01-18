"use client";

import { motion } from "framer-motion";
import { ArchitectProgressBar } from "./ArchitectProgressBar";

interface DomainProgressItemProps {
  number: string;
  domainName: string;
  percentage: number;
  color: string;
  onClick?: () => void;
}

export function DomainProgressItem({
  number,
  domainName,
  percentage,
  color,
  onClick,
}: DomainProgressItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className={onClick ? "cursor-pointer" : ""}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-foreground-secondary">
          {number} / {domainName.toUpperCase()}
        </span>
        <span className="text-xs font-bold text-purple">
          {percentage}%
        </span>
      </div>
      <ArchitectProgressBar
        percentage={percentage}
        color={color}
        height="md"
        showLabel={false}
      />
    </motion.div>
  );
}
