"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { VisionBoard } from "./VisionBoard";
import type { VisionBoard as VisionBoardType, Domain, TimelineSnapshot } from "@/lib/types";
import { Button } from "@/components/shared/Button";
import { Calendar, TrendingUp, Award } from "lucide-react";

interface MainBoardProgressProps {
  mainBoard: VisionBoardType;
  timeline: TimelineSnapshot[];
  domains: Domain[];
}

export function MainBoardProgress({ mainBoard, timeline, domains }: MainBoardProgressProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly">("weekly");

  // Group timeline by months
  const monthlyGroups = timeline.reduce((acc, snapshot) => {
    const monthKey = format(parseISO(snapshot.snapshotDate), "yyyy-MM");
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(snapshot);
    return acc;
  }, {} as Record<string, TimelineSnapshot[]>);

  const monthlyData = Object.entries(monthlyGroups).map(([month, snapshots]) => {
    const totalPixels = snapshots.reduce((sum, s) => sum + s.pixelsSummary.totalPixels, 0);
    const avgCompletion = snapshots.reduce((sum, s) => sum + s.pixelsSummary.completionRate, 0) / snapshots.length;
    return {
      month,
      date: snapshots[0].snapshotDate,
      snapshots,
      totalPixels,
      avgCompletion: Math.round(avgCompletion * 100),
    };
  }).sort((a, b) => b.date.localeCompare(a.date));

  // Calculate weekly contribution to main board
  const weeklyContributions = timeline.slice(-8).map((snapshot) => {
    const weekNum = parseInt(snapshot.id.split("_")[2]);
    return {
      week: weekNum,
      snapshot,
      contribution: snapshot.pixelsSummary.totalPixels,
      completion: snapshot.pixelsSummary.completionRate,
    };
  });

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === "weekly" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("weekly")}
            size="sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Weekly Progress
          </Button>
          <Button
            variant={selectedPeriod === "monthly" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("monthly")}
            size="sm"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Monthly Progress
          </Button>
        </div>
      </div>

      {/* Weekly Progress View */}
      {selectedPeriod === "weekly" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Weekly Contributions</h3>
          <p className="text-sm text-gray-600 mb-4">
            Each week's progress contributes to your main vision board
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyContributions.map((week) => (
              <div
                key={week.week}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Week {week.week}</span>
                  <Award className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {week.contribution.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mb-3">pixels earned</p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${Math.round(week.completion * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {Math.round(week.completion * 100)}% complete
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Progress View */}
      {selectedPeriod === "monthly" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Progress Summary</h3>
          <p className="text-sm text-gray-600 mb-4">
            Monthly boards contribute to your main vision board
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyData.map((month) => (
              <div
                key={month.month}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {format(parseISO(month.date), "MMMM yyyy")}
                  </span>
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {month.totalPixels.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mb-3">total pixels</p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all"
                    style={{ width: `${month.avgCompletion}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {month.avgCompletion}% avg completion • {month.snapshots.length} weeks
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Journey Timeline</h3>
        <div className="space-y-4">
          {timeline.slice(-12).reverse().map((snapshot, index) => {
            const weekNum = parseInt(snapshot.id.split("_")[2]);
            const progressToMain = (snapshot.pixelsSummary.totalPixels / mainBoard.totalPixels) * 100;
            
            return (
              <div
                key={snapshot.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-shrink-0 w-16 text-center">
                  <p className="text-xs text-gray-500">Week</p>
                  <p className="text-lg font-bold text-gray-900">{weekNum}</p>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {format(parseISO(snapshot.snapshotDate), "MMM d, yyyy")}
                    </span>
                    <span className="text-xs text-gray-600">
                      {snapshot.pixelsSummary.totalPixels} pixels
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${Math.round(snapshot.pixelsSummary.completionRate * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(progressToMain * 100)}% contribution to main board
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
