"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Share2, Crown, Calendar } from "lucide-react";
import { PixelatedBoard } from "@/components/boards/PixelatedBoard";
import type { VisionBoard, Domain } from "@/lib/types";

interface VisionBoardWidgetProps {
    board: VisionBoard | null;
    domains: Domain[];
    currentView: "weekly" | "monthly" | "annual";
    onViewChange: (view: "weekly" | "monthly" | "annual") => void;
    isLoading?: boolean;
}

export const VisionBoardWidget = memo(function VisionBoardWidget({
    board,
    domains,
    currentView,
    onViewChange,
    isLoading = false,
}: VisionBoardWidgetProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Transition variants for "Zoom" effect
    const variants = {
        enter: (direction: number) => ({
            scale: direction > 0 ? 0.9 : 1.1,
            opacity: 0,
        }),
        center: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" },
        },
        exit: (direction: number) => ({
            scale: direction > 0 ? 1.1 : 0.9,
            opacity: 0,
            transition: { duration: 0.3, ease: "easeIn" },
        }),
    };

    // Determine direction for animation based on view hierarchy
    // weekly (0) -> monthly (1) -> annual (2)
    const viewOrder = { weekly: 0, monthly: 1, annual: 2 };
    const [direction, setDirection] = useState(0);

    const handleViewChange = (newView: "weekly" | "monthly" | "annual") => {
        const diff = viewOrder[newView] - viewOrder[currentView];
        setDirection(diff);
        onViewChange(newView);
    };

    return (
        <div className={`relative flex flex-col h-full transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-4' : ''}`}>

            {/* Main Board Window */}
            <div className="relative flex-1 w-full h-full overflow-hidden rounded-2xl border border-white/10 bg-[#050505] shadow-2xl group">

                {/* Header / Controls */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-30 pointer-events-none">
                    {/* Title */}
                    <div className="flex flex-col">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-white/50 font-mono">
                            {currentView === "annual" ? "MACRO VISION" : currentView === "monthly" ? "TACTICAL VIEW" : "ACTIVE SPRINT"}
                        </h3>
                        {currentView === "annual" && (
                            <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-mono mt-0.5 animate-pulse">
                                <Crown className="w-3 h-3" /> PRIMARY OBJECTIVE
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2 pointer-events-auto">
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Board Display Area */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-2 border-purple/30 border-t-purple rounded-full animate-spin" />
                            <p className="text-[10px] text-purple font-mono animate-pulse">RENDERING PIXELS...</p>
                        </div>
                    ) : board && domains.length > 0 ? (
                        <AnimatePresence custom={direction} mode="popLayout">
                            <motion.div
                                key={currentView} // Key change triggers animation
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="w-full h-full"
                            >
                                <PixelatedBoard
                                    board={board}
                                    domains={domains}
                                    pixelSize={isFullscreen ? 8 : (currentView === "annual" ? 6 : 12)}
                                />
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <p className="text-gray-500 font-mono text-xs">NO VISION DATA</p>
                    )}
                </div>

                {/* Bottom Time-Scale Slider */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-black/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl transition-transform hover:scale-105">
                    {(["weekly", "monthly", "annual"] as const).map((view) => {
                        const isActive = currentView === view;
                        return (
                            <button
                                key={view}
                                onClick={() => handleViewChange(view)}
                                className={`
                        relative px-5 py-1.5 text-[11px] font-mono rounded-full uppercase tracking-wider transition-all
                        ${isActive ? "text-white" : "text-gray-500 hover:text-gray-300"}
                     `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeViewTab"
                                        className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{view}</span>
                            </button>
                        )
                    })}
                </div>

            </div>
        </div>
    );
});
