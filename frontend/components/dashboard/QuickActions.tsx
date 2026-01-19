"use client";

import { motion } from "framer-motion";
import { PenTool, CheckSquare, Palette, ArrowUpRight, Zap, Target } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface QuickAction {
  id: string;
  label: string;
  subLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  pending?: boolean;
  shortcut?: string;
}

interface QuickActionsProps {
  hasPendingJournal?: boolean;
}

export function QuickActions({ hasPendingJournal = false }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "journal",
      label: "Journal",
      subLabel: "Reflect",
      icon: PenTool,
      href: "/journal",
      color: "purple",
      pending: hasPendingJournal,
      shortcut: "J",
    },
    {
      id: "tasks",
      label: "Tasks",
      subLabel: "Protocol",
      icon: CheckSquare,
      href: "/tasks/validate",
      color: "green",
      shortcut: "T",
    },
    {
      id: "vision",
      label: "Vision",
      subLabel: "Update",
      icon: Palette,
      href: "/boards/main",
      color: "orange",
      shortcut: "V",
    },
    {
      id: "focus",
      label: "Focus",
      subLabel: "Timer",
      icon: Target,
      href: "/focus",
      color: "blue",
      shortcut: "F",
    }
  ];

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 bg-yellow-500/10 rounded-md border border-yellow-500/20">
          <Zap className="w-3.5 h-3.5 text-yellow-500" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-foreground-secondary uppercase tracking-widest leading-none">Quick Ops</h3>
          <span className="text-[10px] text-foreground-tertiary font-mono">EXECUTE ACTIONS</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isPending = action.pending;

          return (
            <Link key={action.id} href={action.href} className="block group relative">
              {isPending && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
              )}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all h-28 text-center overflow-hidden",
                  "hover:bg-white/5",
                  isPending
                    ? "bg-purple/10 border-purple/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                    : "bg-white/[0.02] border-white/5 hover:border-white/20"
                )}
              >
                {/* Hover visual */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className={cn(
                  "mb-3 p-2.5 rounded-lg transition-colors group-hover:scale-110 duration-300",
                  action.color === "purple" && "bg-purple/10 text-purple-400 group-hover:bg-purple/20 group-hover:text-purple",
                  action.color === "green" && "bg-green-500/10 text-green-400 group-hover:bg-green-500/20 group-hover:text-green-500",
                  action.color === "orange" && "bg-orange/10 text-orange-400 group-hover:bg-orange/20 group-hover:text-orange-500",
                  action.color === "blue" && "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-500",
                )}>
                  <Icon className="w-5 h-5" />
                </div>

                <span className="text-sm font-bold text-white mb-0.5">{action.label}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{action.subLabel}</span>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-3 h-3 text-white/30" />
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className="absolute bottom-2 right-2 text-[8px] font-mono text-white/20 border border-white/10 px-1 rounded opacity-50 group-hover:opacity-100">
                  {action.shortcut}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
