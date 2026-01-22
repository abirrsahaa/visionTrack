"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Sparkles, Cpu } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden selection:bg-purple/30">

            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-purple/5 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[8000ms]" />
                <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[6000ms]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            </div>

            <div className="relative z-10 flex flex-col items-center">

                {/* Logo / Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                        <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">Initialize Identity</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter text-white flex items-center gap-2 justify-center">
                        <Cpu className="w-8 h-8 text-purple-400" />
                        JOIN THE NETWORK
                    </h1>
                    <p className="text-gray-500 text-sm mt-2 font-mono">BEGIN YOUR ARCHITECTURAL JOURNEY</p>
                </motion.div>

                {/* Clerk Component Wrapper */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="relative"
                >
                    {/* Decorative Corners */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-white/30" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-white/30" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-white/30" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-white/30" />

                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-[#0a0a0a] border border-white/10 shadow-2xl backdrop-blur-xl p-8 rounded-xl w-full max-w-md",
                                headerTitle: "text-white font-bold text-xl",
                                headerSubtitle: "text-gray-400 text-sm",
                                socialButtonsBlockButton: "bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-colors",
                                socialButtonsBlockButtonText: "text-white",
                                dividerLine: "bg-white/10",
                                dividerText: "text-gray-500",
                                formFieldLabel: "text-gray-400 text-xs uppercase tracking-wide",
                                formFieldInput: "bg-black/50 border border-white/10 text-white rounded-lg focus:border-purple focus:ring-1 focus:ring-purple transition-all",
                                footerActionLink: "text-purple-400 hover:text-purple-300",
                                formButtonPrimary: "bg-purple hover:bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform hover:scale-[1.02]",
                            },
                            variables: {
                                colorPrimary: "#a855f7",
                                colorBackground: "#0a0a0a",
                                colorText: "white",
                                colorInputBackground: "#000000",
                                colorInputText: "white",
                            }
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-[10px] text-gray-600 font-mono">
                        ESTABLISHING NEURAL LINK...
                    </p>
                </motion.div>

            </div>
        </div>
    );
}
