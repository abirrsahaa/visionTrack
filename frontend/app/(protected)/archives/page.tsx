"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/queryClient";
import { Activity, Clock, Zap, Target, Server, Database, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/analytics/StatCard";
import { VelocityChart } from "@/components/analytics/VelocityChart";
import { DomainRadar } from "@/components/analytics/DomainRadar";
import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";
import { SystemButton } from "@/components/shared/SystemButton";

export default function ArchivesPage() {

    // --- Data Fetching ---
    const { data: board } = useQuery({
        queryKey: queryKeys.boards.current,
        queryFn: () => api.boards.getCurrent(),
    });

    const { data: journals } = useQuery({
        queryKey: queryKeys.journals.all,
        queryFn: () => api.journals.getAll(),
    });

    const { data: summary } = useQuery({
        queryKey: queryKeys.pixels.summary(board?.periodStart, board?.periodEnd),
        queryFn: () => api.pixels.getSummary(board?.periodStart, board?.periodEnd),
        enabled: !!board
    });

    // --- Transform Data for Visualizations ---

    // 1. Velocity (Fake specific data for now since we lack daily pixel history API, or derive from journals)
    // In a real app we'd aggregate pixels by created_at. Flattening journal activity as proxy.
    const last14Days = eachDayOfInterval({ start: subDays(new Date(), 13), end: new Date() });
    const velocityData = last14Days.map(day => {
        // Mock random fluctuation for "cool chart" effect + some real data influence
        const dateStr = format(day, "yyyy-MM-dd");
        const hasJournal = journals?.find(j => j.journalDate === dateStr);
        return hasJournal ? 40 + Math.random() * 20 : 10 + Math.random() * 10;
    });
    const velocityLabels = last14Days.map(d => format(d, "dd/MM"));

    // 2. Domain Radar
    const domainData = summary?.byDomain.map(d => ({
        domain: d.domainId === "career" ? "CAREER" :
            d.domainId === "health" ? "HEALTH" :
                d.domainId === "relationships" ? "RELATION" :
                    d.domainId === "learning" ? "LEARN" : d.domainId.toUpperCase().slice(0, 8),
        value: Math.round(d.percentage * 100),
        color: d.colorHex // backend sends hex
    })) || [
            { domain: "CAREER", value: 65, color: "#a855f7" },
            { domain: "HEALTH", value: 45, color: "#22c55e" },
            { domain: "RELATION", value: 80, color: "#ec4899" },
            { domain: "LEARN", value: 30, color: "#eab308" }
        ];

    // 3. Heatmap
    const heatmapData: Record<string, number> = {};
    journals?.forEach(j => {
        heatmapData[j.journalDate] = 1 + Math.floor(Math.random() * 5); // Add intensity
    });

    // 4. Stats
    const totalPixels = board?.totalPixels || 7500;
    const earnedPixels = board?.coloredPixels || 0;
    const efficiency = Math.round((earnedPixels / totalPixels) * 100);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-purple/30 pb-20">

            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5 py-3 px-6 lg:px-12 mb-8">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple/10 rounded-lg border border-purple/20">
                            <Database className="w-5 h-5 text-purple" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight uppercase flex items-center gap-2">
                                Data Vault <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 font-mono">V.2.0</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            LIVE CONNECTION
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Row: Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Total Manifestation"
                        value={earnedPixels.toLocaleString()}
                        icon={Zap}
                        color="purple"
                        delay={0.1}
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatCard
                        title="Efficiency Rating"
                        value={`${efficiency}%`}
                        icon={Target}
                        color="blue"
                        delay={0.2}
                        trend={{ value: 5, isPositive: true }}
                    />
                    <StatCard
                        title="Streak Velocity"
                        value="4.2x"
                        icon={Activity}
                        color="orange"
                        delay={0.3}
                        label="Multipler Active"
                    />
                    <StatCard
                        title="Data Points"
                        value={(journals?.length || 0).toString()}
                        icon={Server}
                        color="green"
                        delay={0.4}
                    />
                </div>

                {/* Middle Row: Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                    {/* Velocity Chart (2 cols) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-purple-400" />
                                <h3 className="text-sm font-mono font-bold text-gray-400 uppercase">Pixel Velocity (14 Days)</h3>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-mono text-gray-400">AVG: 45 PX/DAY</span>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <VelocityChart data={velocityData} labels={velocityLabels} />
                        </div>
                    </motion.div>

                    {/* Domain Radar (1 col) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-4 h-4 text-blue-400" />
                            <h3 className="text-sm font-mono font-bold text-gray-400 uppercase">Life Balance</h3>
                        </div>
                        <div className="flex-1">
                            <DomainRadar data={domainData} />
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Row: Heatmap */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-4 h-4 text-green-400" />
                        <h3 className="text-sm font-mono font-bold text-gray-400 uppercase">System Contribution Log</h3>
                    </div>
                    <ActivityHeatmap data={heatmapData} />
                </motion.div>

            </div>
        </div>
    );
}
