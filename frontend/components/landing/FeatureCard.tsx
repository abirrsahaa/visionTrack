"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative dark-card p-8 transition-shadow border border-gray-800 hover:glow-purple"
    >
      <motion.div
        className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4"
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-foreground mb-3 font-mono">{title}</h3>
      <p className="text-foreground-secondary leading-relaxed font-sans">{description}</p>
    </motion.div>
  );
}
