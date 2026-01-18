"use client";

import { motion } from "framer-motion";
import { PenTool, CheckSquare, Palette, ArrowRight } from "lucide-react";
import Link from "next/link";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  pending?: boolean;
}

interface QuickActionsProps {
  hasPendingJournal?: boolean;
}

export function QuickActions({ hasPendingJournal = false }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "journal",
      label: "Write Journal",
      icon: PenTool,
      href: "/journal",
      color: "blue",
      pending: hasPendingJournal,
    },
    {
      id: "tasks",
      label: "Review Tasks",
      icon: CheckSquare,
      href: "/tasks/validate",
      color: "green",
    },
    {
      id: "vision",
      label: "Update Vision",
      icon: Palette,
      href: "/boards/main",
      color: "purple",
    },
  ];

  const getColorClasses = (color: string, isPending?: boolean) => {
    const colors: Record<string, { bg: string; hover: string; text: string; glow: string }> = {
      blue: {
        bg: "bg-blue-50",
        hover: "hover:bg-blue-100",
        text: "text-blue-700",
        glow: "shadow-blue-200",
      },
      green: {
        bg: "bg-green-50",
        hover: "hover:bg-green-100",
        text: "text-green-700",
        glow: "shadow-green-200",
      },
      purple: {
        bg: "bg-purple-50",
        hover: "hover:bg-purple-100",
        text: "text-purple-700",
        glow: "shadow-purple-200",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
    >
      <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>

      <div className="space-y-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const colors = getColorClasses(action.color, action.pending);

          return (
            <Link key={action.id} href={action.href}>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg ${colors.bg} ${colors.hover} ${colors.text} font-medium text-sm transition-all ${
                  action.pending ? `shadow-lg ${colors.glow}` : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{action.label}</span>
                  {action.pending && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-2 h-2 bg-current rounded-full"
                    />
                  )}
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </motion.button>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
