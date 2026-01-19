"use client";

import { motion } from "framer-motion";

export function Logo() {
    return (
        <div className="flex items-center gap-3 select-none">
            {/* Icon Container */}
            <div className="relative w-8 h-8 flex items-center justify-center">
                {/* Rotating Outer Hexagon */}
                <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full text-purple-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <path
                        d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-20"
                    />
                </motion.svg>

                {/* Pulse Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border border-purple-400/30"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Inner Core */}
                <motion.div
                    className="w-3 h-3 bg-purple-500 rounded-sm rotate-45 shadow-[0_0_10px_#a855f7]"
                    animate={{ rotate: [45, 225, 45] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Glitch Effect Bars */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 overflow-hidden">
                    <motion.div
                        className="w-full h-full bg-white/50"
                        animate={{ x: [-20, 100] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                </div>
            </div>

            {/* Text Logo */}
            <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-tight text-white leading-none font-mono">
                    VISION <span className="text-purple-500">::</span> OS
                </h1>
                <div className="flex items-center gap-1.5 opacity-50">
                    <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-white">
                        Architect
                    </span>
                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
