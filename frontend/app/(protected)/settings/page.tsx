"use client";

import { motion } from "framer-motion";
import { SystemPanel } from "@/components/shared/SystemPanel";
import { SystemButton } from "@/components/shared/SystemButton";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="font-mono text-2xl font-bold text-foreground mb-2 uppercase tracking-wider">
            SETTINGS
          </h1>
          <p className="font-mono text-xs text-foreground-tertiary">
            Configure your system preferences
          </p>
        </div>
      </motion.div>

      {/* Theme Settings */}
      <SystemPanel title="APPEARANCE">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-foreground mb-1">THEME</p>
            <p className="font-sans text-xs text-foreground-tertiary">
              Switch between dark and light mode
            </p>
          </div>
          <motion.button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-background-tertiary border border-gray-200 rounded hover:bg-background-secondary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === "dark" ? (
              <>
                <Moon className="w-4 h-4 text-foreground" />
                <span className="font-mono text-xs text-foreground">DARK</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-foreground" />
                <span className="font-mono text-xs text-foreground">LIGHT</span>
              </>
            )}
          </motion.button>
        </div>
      </SystemPanel>

      {/* Account Settings */}
      <SystemPanel title="ACCOUNT">
        <div className="space-y-4">
          <div>
            <p className="font-mono text-sm text-foreground mb-1">USER PROFILE</p>
            <p className="font-sans text-xs text-foreground-tertiary mb-3">
              Manage your account information
            </p>
            <SystemButton variant="outline">EDIT PROFILE</SystemButton>
          </div>
        </div>
      </SystemPanel>

      {/* System Info */}
      <SystemPanel title="SYSTEM INFORMATION">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs text-foreground-secondary">VERSION</span>
            <span className="font-mono text-xs text-foreground">4.02</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs text-foreground-secondary">MODE</span>
            <span className="font-mono text-xs text-foreground">ARCHITECT</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs text-foreground-secondary">STATUS</span>
            <span className="font-mono text-xs text-green-500">OPERATIONAL</span>
          </div>
        </div>
      </SystemPanel>
    </div>
  );
}
