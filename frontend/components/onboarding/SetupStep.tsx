"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Bell, Sparkles, Calendar } from "lucide-react";
import { SystemButton } from "@/components/shared/SystemButton";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";

interface SetupStepProps {
  bedtimeReminder: string;
  morningReminder: string;
  onRemindersChange: (bedtime: string, morning: string) => void;
}

export function SetupStep({
  bedtimeReminder,
  morningReminder,
  onRemindersChange,
}: SetupStepProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6"
        >
          <Calendar className="w-10 h-10" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Almost There! Final Setup
        </h2>
        <p className="text-gray-600">
          Configure your reminders and preview your first vision board.
        </p>
      </div>

      {/* Pixel Budget Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Pixel Budget Allocation
        </h3>
        <div className="space-y-4">
          {[
            { domain: "Career", pixels: 100, color: "#3B82F6" },
            { domain: "Health", pixels: 80, color: "#10B981" },
            { domain: "Learning", pixels: 70, color: "#F59E0B" },
            { domain: "Relationships", pixels: 50, color: "#EC4899" },
          ].map((item, index) => (
            <div key={item.domain}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">{item.domain}</span>
                <span className="text-sm text-gray-600">{item.pixels} pixels/week</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.pixels / 100) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                />
              </div>
            </div>
          ))}
          <p className="text-sm text-gray-500 mt-4">
            Total: 300 pixels per week (distributed based on your domain goals)
          </p>
        </div>
      </motion.div>

      {/* Week 1 Board Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Week 1 Vision Board Preview
        </h3>
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />
          </div>
          <div className="text-center z-10">
            <div className="text-4xl mb-2">🎨</div>
            <p className="text-gray-600 font-medium">Grayscale Board Ready</p>
            <p className="text-sm text-gray-500 mt-1">
              Start journaling to colorize your vision!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Reminder Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Reminder Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Bedtime Reminder
            </label>
            <input
              type="time"
              value={bedtimeReminder}
              onChange={(e) => onRemindersChange(e.target.value, morningReminder)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">When to remind you to journal</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Morning Reminder
            </label>
            <input
              type="time"
              value={morningReminder}
              onChange={(e) => onRemindersChange(bedtimeReminder, e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">When to remind you to validate tasks</p>
          </div>
        </div>
      </motion.div>

      {/* Completion Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center pt-4"
      >
        <SystemButton
          onClick={handleComplete}
          size="lg"
          className="px-10 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Complete Setup & Launch Dashboard
        </SystemButton>
        <p className="text-sm text-gray-500 mt-3">
          You're all set! Your vision board is ready to transform with your daily effort.
        </p>
      </motion.div>
    </div>
  );
}
