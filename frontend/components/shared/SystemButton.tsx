"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface SystemButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline" | "gradient-purple" | "gradient-orange";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const SystemButton = forwardRef<HTMLButtonElement, SystemButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "bg-background-tertiary border border-gray-200 text-foreground-secondary hover:bg-background-secondary hover:border-purple/30",
      primary: "bg-purple border-2 border-purple text-white hover:bg-purple-dark hover:glow-purple",
      outline: "bg-transparent border border-gray-200 text-foreground-secondary hover:text-foreground hover:border-purple/50",
      "gradient-purple": "btn-gradient-purple text-white border-0",
      "gradient-orange": "btn-gradient-orange text-white border-0",
    };

    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "font-mono font-medium rounded transition-all",
          variantClasses[variant],
          sizeClasses[size],
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        disabled={disabled || isLoading}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            LOADING...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

SystemButton.displayName = "SystemButton";
