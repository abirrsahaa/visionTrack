"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface SystemPanelProps extends HTMLMotionProps<"div"> {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function SystemPanel({ title, children, className, ...props }: SystemPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className={cn(
        "dark-card p-4 transition-all duration-200 hover:card-shadow-lg hover:border-purple/30",
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="text-sm font-semibold text-foreground-secondary mb-4 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
}
