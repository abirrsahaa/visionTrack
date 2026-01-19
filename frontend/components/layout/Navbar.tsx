"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid, Map, Database, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/stores";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/shared/Logo";
import { useScrollDirection } from "@/lib/hooks/useScrollDirection";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const scrollDirection = useScrollDirection();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/timeline", label: "Timeline", icon: Map },
    { href: "/archives", label: "Archives", icon: Database },
    { href: "/settings", label: "System", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Floating HUD Container */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: scrollDirection === "down" ? -150 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <div className="max-w-5xl w-full flex items-center gap-4 pointer-events-auto">

          {/* Branding Module */}
          <div className="hidden md:flex backdrop-blur-xl bg-[#050505]/80 border border-white/10 rounded-2xl px-5 py-3 shadow-2xl shadow-black/50">
            <Link href="/dashboard">
              <Logo />
            </Link>
          </div>

          {/* Navigation Dock */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-1 backdrop-blur-xl bg-[#050505]/80 border border-white/10 rounded-2xl px-2 py-2 shadow-2xl shadow-black/50">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={cn(
                        "relative px-4 py-2.5 rounded-xl font-medium transition-all group flex items-center gap-2 text-sm font-mono tracking-wide",
                        active
                          ? "text-white bg-white/10 shadow-[inner_0_0_10px_rgba(255,255,255,0.05)] border border-white/5"
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={cn("w-4 h-4", active ? "text-purple-400" : "group-hover:text-purple-300")} />
                      <span className="hidden sm:inline-block">{item.label}</span>

                      {/* Active Indicator Light */}
                      {active && (
                        <motion.span
                          layoutId="navIndicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Control Module */}
          <div className="hidden md:flex items-center gap-2 backdrop-blur-xl bg-[#050505]/80 border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50">
            {/* Status Indicator */}
            <div className="px-3 py-2 flex flex-col items-end border-r border-white/5 pr-3">
              <span className="text-[10px] text-gray-400 font-mono uppercase leading-none">Status</span>
              <span className="text-[10px] text-green-400 font-bold font-mono tracking-wider leading-none mt-1">ONLINE</span>
            </div>

            {/* Profile / Logout */}
            <motion.button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors"
              title="Disconnect"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>

        </div>
      </motion.nav>

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-28" />
    </>
  );
}
