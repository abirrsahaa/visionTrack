"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Layers, Calendar, Archive, Zap, Moon, Sun, Home } from "lucide-react";
import { useAuthStore } from "@/lib/stores";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/timeline", label: "Timeline", icon: Calendar },
    { href: "/boards/checkpoints", label: "Archives", icon: Archive },
    { href: "/settings", label: "Settings", icon: Zap },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-background border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard">
            <motion.div
              className="flex items-center gap-2 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center shadow-lg">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Visual Life</span>
            </motion.div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      "relative px-4 py-2 rounded-lg font-medium transition-colors group",
                      active
                        ? "text-purple bg-purple/20 glow-purple"
                        : "text-foreground-secondary hover:text-foreground hover:bg-background-secondary"
                    )}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 text-foreground-tertiary hover:text-foreground rounded-lg hover:bg-background-secondary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* User Profile */}
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-foreground-secondary hover:text-foreground rounded-lg hover:bg-background-secondary transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{user?.name || "User"}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
