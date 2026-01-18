"use client";

import { motion } from "framer-motion";
import { DomainCard } from "./DomainCard";
import type { Domain } from "@/lib/types";

interface DomainListProps {
  domains: Domain[];
  onEdit?: (domain: Domain) => void;
  onDelete?: (id: string) => void;
}

export function DomainList({ domains, onEdit, onDelete }: DomainListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {domains.map((domain, index) => (
        <motion.div
          key={domain.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <DomainCard
            domain={domain}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </div>
  );
}
