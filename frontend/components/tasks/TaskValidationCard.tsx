"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Edit3, Clock, Zap } from "lucide-react";
import type { Todo } from "@/lib/types";
import { format, parseISO } from "date-fns";

interface TaskValidationCardProps {
  task: Todo;
  status: "pending" | "accepted" | "skipped";
  onAccept: () => void;
  onSkip: () => void;
  onAdjust: () => void;
  domainColor?: string;
  domainName?: string;
}

export function TaskValidationCard({
  task,
  status,
  onAccept,
  onSkip,
  onAdjust,
  domainColor = "#3B82F6",
  domainName = "General",
}: TaskValidationCardProps) {
  const getEffortColor = (weight: number) => {
    if (weight <= 1.0) return "text-green-600 bg-green-50";
    if (weight <= 1.5) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getEffortLabel = (weight: number) => {
    if (weight <= 1.0) return "Light";
    if (weight <= 1.5) return "Medium";
    return "Heavy";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        borderColor:
          status === "accepted"
            ? "#10B981"
            : status === "skipped"
            ? "#6B7280"
            : "#E5E7EB",
      }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative bg-white rounded-xl shadow-md border-2 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Status Indicator with Animation */}
      <motion.div
        className="absolute top-4 right-4 z-10"
        animate={{
          scale: status === "pending" ? [1, 1.2, 1] : 1,
          rotate: status === "accepted" ? [0, 10, -10, 0] : 0,
        }}
        transition={{
          scale: { repeat: status === "pending" ? Infinity : 0, duration: 2 },
          rotate: status === "accepted" ? { duration: 0.5 } : {},
        }}
      >
        <div
          className={`w-4 h-4 rounded-full shadow-lg ${
            status === "accepted"
              ? "bg-green-500"
              : status === "skipped"
              ? "bg-gray-400"
              : "bg-yellow-400"
          }`}
        />
      </motion.div>
      
      {/* Background Glow Effect on Accept */}
      {status === "accepted" && (
        <motion.div
          className="absolute inset-0 bg-green-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Domain Indicator */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ backgroundColor: `${domainColor}20` }}
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div
            className="w-6 h-6 rounded-full shadow-sm border-2 border-white"
            style={{ backgroundColor: domainColor }}
          />
        </motion.div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          {domainName}
        </span>
      </div>
      
      {/* Task Title with Entrance Animation */}
      <motion.h3
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg font-bold text-gray-900 mb-2 line-clamp-2"
      >
        {task.title}
      </motion.h3>
      
      {/* Task Description */}
      {task.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-gray-600 mb-4 line-clamp-2"
        >
          {task.description}
        </motion.p>
      )}
      
      {/* Task Metadata */}
      <div className="flex items-center gap-4 mb-6 text-xs text-gray-500">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-semibold ${getEffortColor(task.effortWeight)}`}
        >
          <Zap className="w-3.5 h-3.5" />
          {getEffortLabel(task.effortWeight)}
        </motion.div>
        
        {task.scheduledDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-1.5 text-gray-500"
          >
            <Clock className="w-3.5 h-3.5" />
            {format(parseISO(task.scheduledDate), "MMM d")}
          </motion.div>
        )}
      </div>
      
      {/* Action Buttons with Enhanced Interactions */}
      <div className="flex gap-2">
        <motion.button
          onClick={onAccept}
          disabled={status !== "pending"}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            status === "accepted"
              ? "bg-green-600 text-white shadow-lg"
              : status === "pending"
              ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-xl"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          whileHover={
            status === "pending"
              ? {
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)",
                }
              : {}
          }
          whileTap={status === "pending" ? { scale: 0.95 } : {}}
          animate={{
            backgroundColor:
              status === "accepted"
                ? "#10B981"
                : status === "pending"
                ? "#059669"
                : "#E5E7EB",
          }}
        >
          <motion.div
            animate={
              status === "accepted"
                ? { scale: [1, 1.3, 1], rotate: [0, 360] }
                : { scale: 1 }
            }
            transition={{ duration: 0.5 }}
          >
            <CheckCircle2 className="w-5 h-5" />
          </motion.div>
          Accept
        </motion.button>
        
        <motion.button
          onClick={onSkip}
          disabled={status !== "pending"}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            status === "skipped"
              ? "bg-gray-600 text-white"
              : status === "pending"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          whileHover={status === "pending" ? { scale: 1.05 } : {}}
          whileTap={status === "pending" ? { scale: 0.95 } : {}}
        >
          <XCircle className="w-5 h-5" />
          Skip
        </motion.button>
        
        <motion.button
          onClick={onAdjust}
          disabled={status !== "pending"}
          className={`px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
            status === "pending"
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          whileHover={status === "pending" ? { scale: 1.05 } : {}}
          whileTap={status === "pending" ? { scale: 0.95 } : {}}
        >
          <Edit3 className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Success Checkmark Overlay */}
      {status === "accepted" && (
        <motion.div
          className="absolute inset-0 bg-green-500/10 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-2xl"
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
