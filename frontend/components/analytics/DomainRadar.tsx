"use client";

import { motion } from "framer-motion";

interface DomainRadarProps {
    data: Array<{
        domain: string;
        value: number; // 0-100
        color: string;
    }>;
}

export function DomainRadar({ data }: DomainRadarProps) {
    return (
        <div className="w-full h-full min-h-[250px] flex items-end justify-between gap-2 px-4 py-8">
            {data.map((item, index) => (
                <div key={item.domain} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                    {/* Value Label (Hidden by default, shown on hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute mb-[100%] bottom-0 font-mono text-xs font-bold text-white bg-black/80 px-2 py-1 rounded border border-white/10 pointer-events-none z-20">
                        {item.value}%
                    </div>

                    {/* Bar container */}
                    <div className="w-full max-w-[40px] h-full flex flex-col justify-end gap-1 relative">
                        {/* Background track */}
                        <div className="absolute inset-0 bg-white/5 rounded-t-lg" />

                        {/* Animated Bar Segment */}
                        <motion.div
                            className="w-full rounded-t-lg relative"
                            style={{ backgroundColor: `${item.color}20` }} // Low opacity fit
                            initial={{ height: 0 }}
                            animate={{ height: `${item.value}%` }}
                            transition={{ duration: 1.5, delay: index * 0.1, type: "spring" }}
                        >
                            {/* Solid Core */}
                            <div className="absolute bottom-0 left-0 right-0 top-0 opacity-40" style={{ backgroundColor: item.color }} />

                            {/* Top Cap Glow */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </motion.div>
                    </div>

                    {/* Domain Label */}
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider rotate-0 md:rotate-0 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                        {item.domain}
                    </span>
                </div>
            ))}
        </div>
    );
}
