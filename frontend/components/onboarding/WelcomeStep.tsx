"use client";

import { motion } from "framer-motion";
import { Sparkles, Target, Heart, Zap } from "lucide-react";

export function WelcomeStep() {
  return (
    <div className="text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Your Effort Becomes Art
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Welcome to your visual life execution system. Transform your goals into
          a beautiful, progressive vision board that evolves with every action you take.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {[
          { icon: Target, title: "Daily Commitment", desc: "Journal daily, no guilt if you skip" },
          { icon: Heart, title: "Progress Stays", desc: "Your pixels never disappear" },
          { icon: Zap, title: "Adaptive System", desc: "We adapt to your energy and pace" },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <item.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
      >
        <p className="text-gray-700 italic">
          "Every pixel earned is a moment of progress. Every journal entry is a step forward.
          Your vision board will transform from grayscale to vibrant color as you live your journey."
        </p>
      </motion.div>
    </div>
  );
}
