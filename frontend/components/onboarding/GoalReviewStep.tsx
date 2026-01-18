"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Edit2, MessageSquare, CheckCircle } from "lucide-react";
import { SystemButton } from "@/components/shared/SystemButton";

interface Goal {
  domain: string;
  milestones: string[];
  todos: string[];
}

interface GoalReviewStepProps {
  goals: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
}

export function GoalReviewStep({ goals, onGoalsChange }: GoalReviewStepProps) {
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  const handleEditGoal = (domain: string) => {
    setEditingGoal(domain);
  };

  const handleChatSubmit = () => {
    // Mock AI response - in real app would call API
    if (chatMessage.trim()) {
      console.log("Chat message:", chatMessage);
      setChatMessage("");
      // In real app, would update goals based on AI response
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Review Your Goals & Plan
        </h2>
        <p className="text-gray-600">
          AI has broken down your vision into actionable milestones and tasks. Review and adjust as needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {goals.map((goal, index) => (
              <motion.div
                key={goal.domain}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{goal.domain}</h3>
                    <p className="text-sm text-gray-500">Reviewing {goal.domain} goals ({index + 1} of {goals.length})</p>
                  </div>
                  <SystemButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditGoal(goal.domain)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </SystemButton>
                </div>

                {/* Milestones */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Milestones (Quarterly)
                  </h4>
                  <ul className="space-y-2">
                    {goal.milestones.map((milestone, mIndex) => (
                      <motion.li
                        key={mIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: mIndex * 0.05 }}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{milestone}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* TODOs */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    First Month TODOs
                  </h4>
                  <ul className="space-y-1.5">
                    {goal.todos.map((todo, tIndex) => (
                      <motion.li
                        key={tIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: tIndex * 0.03 }}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <Check className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{todo}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* AI Chat Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Discuss & Adjust</h4>
            </div>

            <div className="space-y-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                <p className="font-medium mb-1">AI Coach:</p>
                <p>How would you like to adjust your goals? I can help refine milestones, adjust timelines, or add more specific tasks.</p>
              </div>
            </div>

            <div className="space-y-2">
              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about your goals..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) {
                    handleChatSubmit();
                  }
                }}
              />
              <SystemButton
                onClick={handleChatSubmit}
                disabled={!chatMessage.trim()}
                className="w-full"
                size="sm"
              >
                Send Message
              </SystemButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
