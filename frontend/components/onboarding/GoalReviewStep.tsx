"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Edit2, MessageSquare, CheckCircle, Sparkles, Loader2, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { SystemButton } from "@/components/shared/SystemButton";
import { decomposeGoal } from "@/app/functions/decomposition";
import { cn } from "@/lib/utils";

interface DomainGoal {
  domain: string;
  milestones: string[];
  todos: string[];
  isAIEnriched?: boolean;
}

interface GoalReviewStepProps {
  goals: DomainGoal[];
  onGoalsChange: (goals: DomainGoal[]) => void;
}

export function GoalReviewStep({ goals, onGoalsChange }: GoalReviewStepProps) {
  const [enrichingDomain, setEnrichingDomain] = useState<string | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  // Chat state
  const [chatMessage, setChatMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEnrichGoal = async (domain: string, currentGoal: string) => {
    setEnrichingDomain(domain);
    setErrorMessage(null); // Clear previous errors
    try {
      // Call Server Action for Deep Decomposition
      const result = await decomposeGoal(domain, currentGoal);

      if (result.success && result.data) {
        // Update the specific goal in the list
        const updatedGoals = goals.map(g => {
          if (g.domain === domain) {
            return {
              ...g,
              milestones: result.data.milestones,
              // Convert the structured Todo objects to strings for now (or update type later)
              todos: result.data.monthOneTodos.map(t =>
                `Week ${t.week}: ${t.task} (${t.effort} Effort)`
              ),
              isAIEnriched: true
            };
          }
          return g;
        });

        onGoalsChange(updatedGoals);
        setExpandedDomain(domain); // Auto-expand the enriched goal
      } else {
        setErrorMessage("AI is currently overloaded. Please try again in a few seconds.");
      }
    } catch (error) {
      console.error("Enrichment failed", error);
      setErrorMessage("Connection failed. Please check your network.");
    } finally {
      setEnrichingDomain(null);
    }
  };


  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const updateGoal = (domain: string, field: 'milestones' | 'todos', index: number, value: string) => {
    const updatedGoals = goals.map(g => {
      if (g.domain === domain) {
        const newArray = [...g[field]];
        newArray[index] = value;
        return { ...g, [field]: newArray };
      }
      return g;
    });
    onGoalsChange(updatedGoals);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20 rounded-full">
          PHASE 4: STRATEGY
        </span>
        <h2 className="text-3xl font-bold text-white mb-2">
          Your Strategic Plan
        </h2>
        <p className="text-gray-400">
          Review the initial roadmap. Use AI to deepen the strategy for your most important domains.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Goals List */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {goals.map((goal, index) => {
              const isEnriching = enrichingDomain === goal.domain;
              const isExpanded = expandedDomain === goal.domain;
              const isEditing = editingGoalId === goal.domain;
              const isEnriched = goal.isAIEnriched;

              return (
                <motion.div
                  key={goal.domain}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "rounded-2xl border transition-all duration-300 overflow-hidden",
                    isEnriched
                      ? "bg-black/60 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                      : "bg-black/40 border-white/10 hover:border-white/20",
                    isExpanded && "ring-1 ring-white/20"
                  )}
                >
                  {/* Card Header */}
                  <div className="p-6 flex items-start justify-between cursor-pointer" onClick={() => setExpandedDomain(isExpanded ? null : goal.domain)}>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{goal.domain}</h3>
                        {isEnriched && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 border border-purple-500/30">
                            <Sparkles className="w-3 h-3" /> AI Plan
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-1 font-medium">
                        {goal.milestones[0]}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingGoalId(isEditing ? null : goal.domain);
                          if (!isExpanded) setExpandedDomain(goal.domain);
                        }}
                        className={cn(
                          "p-2 rounded-full transition-colors",
                          isEditing ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/10 text-gray-500 hover:text-white"
                        )}
                        title="Manual Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {!isEnriched && (
                        <SystemButton
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrichGoal(goal.domain, goal.milestones[0]);
                          }}
                          disabled={isEnriching}
                          className="bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20 hover:text-white"
                        >
                          {isEnriching ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-1.5" />
                              Deepen Plan
                            </>
                          )}
                        </SystemButton>
                      )}

                      <button
                        className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-black/20 border-t border-white/5"
                      >
                        <div className="p-6 pt-2 space-y-8">

                          {/* Quarterly Milestones */}
                          <div>
                            <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 mt-2">
                              <Calendar className="w-3 h-3" /> Quarterly Milestones
                            </h4>
                            <div className="grid gap-3">
                              {goal.milestones.map((milestone, mIndex) => (
                                <div key={mIndex} className="flex gap-4 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 text-gray-300 flex items-center justify-center text-xs font-bold border border-white/10">
                                    Q{mIndex + 1}
                                  </div>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={milestone}
                                      onChange={(e) => updateGoal(goal.domain, 'milestones', mIndex, e.target.value)}
                                      className="flex-1 bg-black/40 border border-white/20 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                    />
                                  ) : (
                                    <span className="text-sm text-gray-300 font-medium leading-tight">{milestone}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Month 1 Actions */}
                          <div>
                            <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                              <CheckCircle className="w-3 h-3" /> Immediate Action Plan (Month 1)
                            </h4>
                            <div className="space-y-3 bg-purple-900/10 p-4 rounded-xl border border-purple-500/10">
                              {goal.todos.map((todo, tIndex) => (
                                <motion.div
                                  key={tIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: tIndex * 0.05 }}
                                  className="flex items-start gap-3"
                                >
                                  <div className="flex-shrink-0 mt-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_rgba(192,132,252,0.8)]" />
                                  </div>
                                  {isEditing ? (
                                    <textarea
                                      value={todo}
                                      onChange={(e) => updateGoal(goal.domain, 'todos', tIndex, e.target.value)}
                                      className="flex-1 bg-black/40 border border-white/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 min-h-[60px]"
                                    />
                                  ) : (
                                    <span className="text-sm text-gray-300 leading-relaxed font-mono">{todo}</span>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Coach / sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="bg-black/60 rounded-2xl p-6 text-white shadow-2xl border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold tracking-tight">AI Coach</h3>
                  <p className="text-xs text-blue-400 font-mono">● ONLINE</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/5">
                <p className="text-sm leading-relaxed text-gray-300">
                  "I've drafted a structure based on your vision. Click <span className="text-purple-300 font-semibold">'Deepen Plan'</span> on your top priority domain to get a detailed weekly breakdown."
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask to adjust a goal..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-4 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <button className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl border border-white/5 p-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tactical Advice</h4>
              <ul className="space-y-3">
                <li className="text-xs text-gray-400 flex gap-3">
                  <span className="text-blue-500 mt-0.5">●</span>
                  Focus on 1-2 core domains first to build momentum.
                </li>
                <li className="text-xs text-gray-400 flex gap-3">
                  <span className="text-blue-500 mt-0.5">●</span>
                  Ensure Q1 milestones are realistic and tangible.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Global Error Toast (Simple) */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md z-50 flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-medium text-sm">{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="ml-2 hover:bg-white/20 rounded-full p-1">
              <Check className="w-4 h-4 rotate-45" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
