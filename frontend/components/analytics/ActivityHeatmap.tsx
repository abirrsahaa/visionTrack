"use client";

import { motion } from "framer-motion";
import { Tooltip } from "@/components/shared/Tooltip"; // Assuming this exists, or use simple title
import { format, subDays, eachDayOfInterval } from "date-fns";

interface ActivityHeatmapProps {
    data: Record<string, number>; // date "YYYY-MM-DD": count
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
    // Generate last 365 days (or similar)
    const today = new Date();
    const days = eachDayOfInterval({
        start: subDays(today, 120), // Last ~4 months for compact view
        end: today,
    });

    const getColor = (count: number) => {
        if (count === 0) return "bg-[#1a1a1a]";
        if (count < 3) return "bg-purple-900/40";
        if (count < 6) return "bg-purple-700/60";
        if (count < 10) return "bg-purple-500";
        return "bg-purple-300 shadow-[0_0_10px_#d8b4fe]";
    };

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-max">
                {/* We can group by weeks if needed, but simple grid is fine for "cyberpunk" look */}
                <div className="grid grid-rows-7 gap-1 grid-flow-col">
                    {days.map((day, i) => {
                        const dateKey = format(day, "yyyy-MM-dd");
                        const count = data[dateKey] || 0;

                        return (
                            <motion.div
                                key={dateKey}
                                className={`w-3 h-3 rounded-sm ${getColor(count)} border border-white/5`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.005 }}
                                title={`${dateKey}: ${count} actions`}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-600 font-mono">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[#1a1a1a]" />
                    <div className="w-3 h-3 rounded-sm bg-purple-900/40" />
                    <div className="w-3 h-3 rounded-sm bg-purple-500" />
                    <div className="w-3 h-3 rounded-sm bg-purple-300" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
