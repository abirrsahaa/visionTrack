"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface VelocityChartProps {
    data: number[]; // Array of pixel counts per day/week
    labels: string[]; // Corresponding labels
    color?: string; // Hex color
}

export function VelocityChart({ data, labels, color = "#a855f7" }: VelocityChartProps) {
    // Normalize data for SVG
    const max = Math.max(...data, 1);
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (val / max) * 80; // keep some padding at bottom
        return `${x},${y}`;
    }).join(" ");

    // Create area path
    const areaPath = `M0,100 ${points.split(" ").map((p, i) => `L${p}`).join(" ")} L100,100 Z`;
    const linePath = `M${points.split(" ").join(" L")}`;

    return (
        <div className="w-full h-full min-h-[200px] relative font-mono text-xs">
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
            >
                {/* Grid Lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                    <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="100"
                        y2={y}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}

                {/* Area Fill */}
                <motion.path
                    d={areaPath}
                    fill={color}
                    fillOpacity="0.1"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />

                {/* Line */}
                <motion.path
                    d={linePath}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Data Points */}
                {data.map((val, i) => (
                    <motion.circle
                        key={i}
                        cx={(i / (data.length - 1)) * 100}
                        cy={100 - (val / max) * 80}
                        r="1.5"
                        fill="#000"
                        stroke={color}
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 + (i * 0.1) }}
                    />
                ))}
            </svg>

            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-gray-500 translate-y-4">
                {labels.filter((_, i) => i % Math.ceil(labels.length / 5) === 0).map((label, i) => (
                    <span key={i}>{label}</span>
                ))}
            </div>
        </div>
    );
}
