"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Clock } from "lucide-react";
import { formatDistance } from "date-fns";

interface BonusHourBannerProps {
  bonusMultiplier: number;
  startTime: Date; // e.g., 22:00 (10 PM)
  endTime: Date; // e.g., 23:00 (11 PM)
}

export function BonusHourBanner({
  bonusMultiplier,
  startTime,
  endTime,
}: BonusHourBannerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = startTime.getHours();
      const endHour = endTime.getHours();

      // Check if current time is within bonus window
      const active = currentHour >= startHour && currentHour < endHour;
      setIsActive(active);

      if (active) {
        // Calculate time until end
        const endDateTime = new Date(now);
        endDateTime.setHours(endHour, 0, 0, 0);
        
        const diff = endDateTime.getTime() - now.getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      } else if (currentHour < startHour) {
        // Calculate time until start
        const startDateTime = new Date(now);
        startDateTime.setHours(startHour, 0, 0, 0);
        
        const diff = startDateTime.getTime() - now.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        
        setTimeRemaining(`Starts in ${hours}h ${minutes}m`);
      } else {
        setTimeRemaining("Ended");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  if (!isActive && timeRemaining === "Ended") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative overflow-hidden rounded-2xl p-4 shadow-xl border-2 ${
        isActive
          ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 border-yellow-300"
          : "bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300"
      }`}
    >
      {/* Animated Background Pattern */}
      {isActive && (
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      )}

      {/* Shimmer Effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={isActive ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles
              className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-600"}`}
            />
          </motion.div>
          <div>
            <h4
              className={`font-bold text-lg ${
                isActive ? "text-white" : "text-gray-700"
              }`}
            >
              {isActive ? "✨ BONUS HOUR ACTIVE!" : "Bonus Hour Coming"}
            </h4>
            <p
              className={`text-sm font-medium ${
                isActive ? "text-white/90" : "text-gray-600"
              }`}
            >
              {isActive
                ? `Earn ${bonusMultiplier}x pixels!`
                : `Earn ${bonusMultiplier}x pixels during bonus window`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock
            className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`}
          />
          <motion.span
            key={timeRemaining}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-mono font-bold text-lg ${
              isActive ? "text-white" : "text-gray-700"
            }`}
          >
            {timeRemaining}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
