// src/components/Profile/MuscularSystemAnalysis.tsx

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { UIGroup } from "./AnatomicalGraph";
import { AnatomicalFigureHyper } from "./AnatomicalFigureHyper";
import ExercisedMusclesList from "./ExercisedMusclesList";

// Note: Removed TimelineSlider and related imports/logic as per instructions.

interface MuscularSystemAnalysisProps {
  // Assuming workoutLogs data will be passed in to determine muscle activity.
  // This can be expanded with more detailed log types.
  workoutLogs: any[];
}

// --- TYPE DEFINITIONS ---
export interface WorkoutHistoryEntry {
  muscleGroups: UIGroup[];
  date: string;
  intensity: number;
}

// --- DATA PROCESSING ---
const processWorkoutData = (logs: any[]): Map<UIGroup, number> => {
  const activity = new Map<UIGroup, number>();
  // Simplified logic placeholder
  return activity;
};

// --- MAIN COMPONENT ---
const MuscularSystemAnalysis: React.FC<MuscularSystemAnalysisProps> = ({
  workoutLogs,
}) => {
  const [view, setView] = useState<"front" | "back">("front");
  const [focusedGroup, setFocusedGroup] = useState<UIGroup | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<UIGroup | null>(null);

  // Note: The logic for calculating active muscle groups, which was tied
  // to the now-removed slider, has been simplified or can be reworked
  // based on a new "recent activity" model if needed. For now, we
  // can use a simpler aggregation.
  const activeMuscleGroups = useMemo(
    () => processWorkoutData(workoutLogs),
    [workoutLogs]
  );

  return (
    <div className="bg-brand-card rounded-2xl shadow-lg p-4 sm:p-6 holo-panel">
      <div className="holo-panel-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wider">
            Muscular Analysis
          </h2>
          <div className="flex space-x-2 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setView("front")}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === "front"
                  ? "bg-brand-primary text-white shadow"
                  : "text-brand-text-muted hover:bg-white/10"
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setView("back")}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                view === "back"
                  ? "bg-brand-primary text-white shadow"
                  : "text-brand-text-muted hover:bg-white/10"
              }`}
            >
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-1 h-96 sm:h-[500px]"
          >
            <AnatomicalFigureHyper
              view={view}
              activeMuscleGroups={activeMuscleGroups}
              focusedUiGroup={focusedGroup}
              hoveredUiGroup={hoveredGroup}
              onHover={setHoveredGroup}
              onFocus={setFocusedGroup}
            />
          </motion.div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={"exercised-list"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ExercisedMusclesList />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuscularSystemAnalysis;
