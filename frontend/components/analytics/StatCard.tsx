import { motion } from "framer-motion";
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
    title: string;
    value: string | number;
    label?: string;
    trend?: {
        value: number; // percentage
        isPositive: boolean;
    };
    icon?: LucideIcon;
    color?: "blue" | "purple" | "orange" | "green";
    className?: string;
    delay?: number;
}

export function StatCard({
    title,
    value,
    label,
    trend,
    icon: Icon,
    color = "purple",
    className,
    delay = 0,
}: StatCardProps) {
    const colors = {
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
        purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
        orange: "text-orange-400 border-orange-500/20 bg-orange-500/5",
        green: "text-green-400 border-green-500/20 bg-green-500/5",
    };

    const trendColor = trend
        ? trend.isPositive
            ? "text-green-400"
            : "text-red-400"
        : "text-gray-400";

    const TrendIcon = trend
        ? trend.isPositive
            ? TrendingUp
            : TrendingDown
        : Minus;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "relative overflow-hidden rounded-xl border p-5 backdrop-blur-sm",
                "bg-[#0a0a0a] border-white/5 hover:border-white/10 transition-colors",
                className
            )}
        >
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${colors[color].split(" ")[0]}`}>
                {Icon && <Icon className="w-16 h-16 transform rotate-12 translate-x-4 -translate-y-4" />}
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">
                            {title}
                        </h3>
                        <div className="text-3xl font-bold text-white font-mono tracking-tighter">
                            {value}
                        </div>
                    </div>
                    {Icon && (
                        <div className={cn("p-2 rounded-lg border", colors[color])}>
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {(trend || label) && (
                    <div className="flex items-center gap-3 text-xs font-mono">
                        {trend && (
                            <div className={cn("flex items-center gap-1", trendColor)}>
                                <TrendIcon className="w-3 h-3" />
                                <span>{Math.abs(trend.value)}%</span>
                            </div>
                        )}
                        {label && <span className="text-gray-500">{label}</span>}
                    </div>
                )}
            </div>

            {/* Scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[1px] w-full animate-scan-slow opacity-20 pointer-events-none" />
        </motion.div>
    );
}
