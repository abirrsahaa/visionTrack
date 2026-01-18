"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { SystemPanel } from "@/components/shared/SystemPanel";
import { WeeklyBoardDisplay } from "@/components/dashboard/WeeklyBoardDisplay";
import { Loader2 } from "lucide-react";

export default function BoardTypePage() {
  const params = useParams();
  const type = params.type as string;

  const { data: board, isLoading: boardLoading } = useQuery({
    queryKey: [...queryKeys.boards.current, type],
    queryFn: async () => {
      if (type === "monthly") {
        return api.boards.getMonthly(0);
      } else if (type === "quarterly") {
        return api.boards.getAnnual();
      }
      return api.boards.getCurrent();
    },
  });

  const { data: domains, isLoading: domainsLoading } = useQuery({
    queryKey: queryKeys.domains.all,
    queryFn: api.domains.getAll,
  });

  if (boardLoading || domainsLoading) {
    return (
      <div className="min-h-screen bg-arch-dark-bg-primary flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-16 h-16 text-arch-dark-text-primary" />
          </motion.div>
          <p className="font-mono text-xs text-arch-dark-text-secondary">LOADING BOARD...</p>
        </div>
      </div>
    );
  }

  const boardTypeMap: Record<string, "weekly" | "monthly" | "quarterly"> = {
    weekly: "weekly",
    monthly: "monthly",
    quarterly: "quarterly",
  };

  const boardType = boardTypeMap[type] || "weekly";

  return (
    <div className="min-h-screen bg-arch-dark-bg-primary space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="font-mono text-2xl font-bold text-arch-dark-text-primary mb-2 uppercase tracking-wider">
            {type.toUpperCase()} BOARD
          </h1>
          <p className="font-mono text-xs text-arch-dark-text-tertiary">
            Your {type} vision progression
          </p>
        </div>
      </motion.div>

      {/* Board Display */}
      <SystemPanel className="p-0 overflow-hidden">
        <div className="p-4">
          <WeeklyBoardDisplay
            board={board || null}
            domains={domains || []}
            boardType={boardType}
            isLoading={boardLoading || domainsLoading}
          />
        </div>
      </SystemPanel>
    </div>
  );
}
