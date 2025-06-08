// src/components/Profile/MuscularSystemAnalysis.tsx

import React, { useState, useMemo, FC } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Card from "../UI/Card";

import { ANATOMICAL_GRAPH } from "./AnatomicalGraph";
import SvgDefs from "./SvgDefs";
import {
  UI_GROUP_TO_ANATOMY_MAP,
  MUSCLE_DATA,
  ANATOMICAL_PATHS_HYPER,
  MuscleRenderData,
} from "./AnatomicalData_Hyper";

// --- TYPE DEFINITIONS ---
type AnatomicalGraphType = typeof ANATOMICAL_GRAPH;
type NodeId = keyof AnatomicalGraphType["nodes"];
export type UIGroup = keyof typeof ANATOMICAL_GRAPH.groups;

export interface WorkoutHistoryEntry {
  muscleGroups: UIGroup[];
  date: string;
  intensity: number;
}

const formatDaysAgo = (date: Date): string => {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

// --- SUB-COMPONENTS ---
const Edge: FC<{ path: string; active: boolean; fast?: boolean }> = ({
  path,
  active,
  fast,
}) => {
  const shouldReduceMotion = useReducedMotion();
  if (!active) return null;
  return (
    <motion.path
      d={path}
      stroke="url(#edge-gradient)"
      strokeWidth={0.75}
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      exit={{ pathLength: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {!shouldReduceMotion && (
        <motion.path
          d={path}
          stroke="white"
          strokeWidth={1.5}
          fill="none"
          strokeDasharray="1 10"
          initial={{ strokeDashoffset: 11 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: fast ? 0.75 : 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </motion.path>
  );
};

const distance = (p1: readonly [number, number], p2: [number, number]) =>
  Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

const Node: FC<{
  id: string;
  state: "dormant" | "active" | "hover" | "focus";
  rippleOrigin?: [number, number];
  pos: readonly [number, number];
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}> = ({ id, state, pos, rippleOrigin, onHoverStart, onHoverEnd, onClick }) => {
  const variants = {
    dormant: { r: 1.5, fill: "rgba(100, 116, 139, 0.4)" },
    active: { r: 2.5, fill: "rgba(132, 106, 237, 0.8)" },
    hover: { r: 4, fill: "rgba(190, 173, 255, 1)" },
    focus: { r: 4, fill: "rgba(255, 255, 255, 1)" },
  };
  const dist = rippleOrigin ? distance(pos, rippleOrigin) : Infinity;
  return (
    <motion.circle
      key={id}
      cx={pos[0]}
      cy={pos[1]}
      variants={variants}
      initial="dormant"
      animate={state}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      transition={{ duration: 0.3 }}
      style={{ cursor: "pointer" }}
    >
      {rippleOrigin && (
        <motion.circle
          cx={pos[0]}
          cy={pos[1]}
          r={0}
          fill="none"
          stroke="white"
          strokeWidth={2}
          animate={{ r: 40, opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut", delay: dist / 400 }}
        />
      )}
    </motion.circle>
  );
};

const AnatomicalFigure: FC<{
  view: "front" | "back";
  highlightedUiGroups: Set<UIGroup>;
  hoveredUiGroup: UIGroup | null;
  focusedUiGroup: UIGroup | null;
  onHover: (group: UIGroup | null) => void;
  onFocus: (group: UIGroup | null) => void;
}> = ({
  view,
  highlightedUiGroups,
  hoveredUiGroup,
  focusedUiGroup,
  onHover,
  onFocus,
}) => {
  const [rippleOrigin, setRippleOrigin] = useState<
    [number, number] | undefined
  >();
  const activeNodeIds = useMemo(() => {
    const visibleGroups = ANATOMICAL_GRAPH.views[view];
    const nodeIds = new Set<NodeId>();
    visibleGroups.forEach((group: UIGroup) => {
      if (
        highlightedUiGroups.has(group) ||
        hoveredUiGroup === group ||
        focusedUiGroup === group
      ) {
        ANATOMICAL_GRAPH.groups[group].forEach((nodeId: NodeId) =>
          nodeIds.add(nodeId)
        );
      }
    });
    return nodeIds;
  }, [view, highlightedUiGroups, hoveredUiGroup, focusedUiGroup]);

  const handleFocus = (group: UIGroup) => {
    // THE FIX IS HERE: Explicitly type `nodeIds` to widen it from a union of specific tuples to a general array.
    const nodeIds: readonly NodeId[] = ANATOMICAL_GRAPH.groups[group];

    const avgX =
      nodeIds.reduce(
        (sum: number, id: NodeId) => sum + ANATOMICAL_GRAPH.nodes[id][0],
        0
      ) / nodeIds.length;

    const avgY =
      nodeIds.reduce(
        (sum: number, id: NodeId) => sum + ANATOMICAL_GRAPH.nodes[id][1],
        0
      ) / nodeIds.length;

    setRippleOrigin([avgX, avgY]);
    onFocus(focusedUiGroup === group ? null : group);
  };

  const allNodes = Object.entries(ANATOMICAL_GRAPH.nodes) as [
    NodeId,
    readonly [number, number]
  ][];
  const allEdges = ANATOMICAL_GRAPH.edges;
  return (
    <svg
      viewBox="90 120 220 550"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-60"
    >
      <defs>
        <linearGradient id="edge-gradient" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="rgba(107, 70, 193, 0.1)" />
          <stop offset="50%" stopColor="rgba(107, 70, 193, 0.8)" />
          <stop offset="100%" stopColor="rgba(107, 70, 193, 0.1)" />
        </linearGradient>
      </defs>
      <AnimatePresence>
        {allEdges.map(([n1, n2]) => {
          const isActive = activeNodeIds.has(n1) && activeNodeIds.has(n2);
          const path = `M${ANATOMICAL_GRAPH.nodes[n1][0]},${ANATOMICAL_GRAPH.nodes[n1][1]} L${ANATOMICAL_GRAPH.nodes[n2][0]},${ANATOMICAL_GRAPH.nodes[n2][1]}`;
          return (
            <Edge
              key={`${n1}-${n2}`}
              path={path}
              active={isActive}
              fast={!!(focusedUiGroup || hoveredUiGroup)}
            />
          );
        })}
      </AnimatePresence>
      <g>
        {allNodes.map(([id, pos]) => {
          const parentGroupEntry = (
            Object.entries(ANATOMICAL_GRAPH.groups) as [
              UIGroup,
              readonly NodeId[]
            ][]
          ).find(([groupName, nodeIds]) => nodeIds.includes(id));
          const parentGroup = parentGroupEntry ? parentGroupEntry[0] : null;
          let state: "dormant" | "active" | "hover" | "focus" = "dormant";
          if (parentGroup) {
            if (focusedUiGroup === parentGroup) state = "focus";
            else if (hoveredUiGroup === parentGroup) state = "hover";
            else if (highlightedUiGroups.has(parentGroup)) state = "active";
          }
          return (
            <Node
              key={id}
              id={id}
              pos={pos}
              state={state}
              rippleOrigin={rippleOrigin}
              onHoverStart={() => onHover(parentGroup)}
              onHoverEnd={() => onHover(null)}
              onClick={() => parentGroup && handleFocus(parentGroup)}
            />
          );
        })}
      </g>
    </svg>
  );
};

interface MusclePartProps {
  data: MuscleRenderData;
  groupName: UIGroup;
  isFocused: boolean;
  isHovered: boolean;
  activation: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}
const MusclePart: FC<MusclePartProps> = ({
  data,
  groupName,
  isFocused,
  isHovered,
  activation,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const fillUrl = `url(#${groupName}-color)`;
  const textureUrl = `url(#${data.textureId})`;
  const variants = {
    dormant: { opacity: 0.15, scale: 1 },
    active: { opacity: 0.3 + activation * 0.7, scale: 1 },
    hover: { opacity: 1, scale: 1.03 },
    focus: { opacity: 1, scale: 1.05 },
  };
  let state: "dormant" | "active" | "hover" | "focus" = "dormant";
  if (isFocused) state = "focus";
  else if (isHovered) state = "hover";
  else if (activation > 0) state = "active";
  return (
    <motion.g
      variants={variants}
      animate={state}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        cursor: "pointer",
        filter: isFocused ? "url(#outline-glow-filter)" : "none",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <path
        d={data.outline}
        fill={fillUrl}
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={0.25}
      />
      <path
        d={data.outline}
        fill={textureUrl}
        style={{ mixBlendMode: "overlay" }}
        opacity={0.1 + activation * 0.25}
      />
    </motion.g>
  );
};

const anatomyToUiGroupMap = new Map<string, UIGroup>();
Object.entries(UI_GROUP_TO_ANATOMY_MAP).forEach(([uiGroup, parts]) => {
  parts.forEach((part) => anatomyToUiGroupMap.set(part, uiGroup as UIGroup));
});
interface AnatomicalFigureHyperProps {
  view: "front" | "back";
  activeMuscleGroups: Map<UIGroup, number>;
  focusedUiGroup: UIGroup | null;
  hoveredUiGroup: UIGroup | null;
  onHover: (group: UIGroup | null) => void;
  onFocus: (group: UIGroup | null) => void;
}
const AnatomicalFigureHyper: FC<AnatomicalFigureHyperProps> = ({
  view,
  activeMuscleGroups,
  focusedUiGroup,
  hoveredUiGroup,
  onHover,
  onFocus,
}) => {
  const viewPaths = ANATOMICAL_PATHS_HYPER[view];
  const visibleGroupSet = useMemo(
    () => new Set(ANATOMICAL_GRAPH.views[view]),
    [view]
  );
  return (
    <svg
      viewBox="90 120 220 550"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <SvgDefs />
      {Object.entries(viewPaths).map(([partName, pathData]) => {
        const uiGroup = anatomyToUiGroupMap.get(partName);
        if (!uiGroup || !visibleGroupSet.has(uiGroup)) {
          return null;
        }
        return (
          <MusclePart
            key={`${view}-${partName}`}
            data={pathData}
            groupName={uiGroup}
            activation={activeMuscleGroups.get(uiGroup) || 0}
            isFocused={focusedUiGroup === uiGroup}
            isHovered={hoveredUiGroup === uiGroup}
            onMouseEnter={() => onHover(uiGroup)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onFocus(focusedUiGroup === uiGroup ? null : uiGroup)}
          />
        );
      })}
    </svg>
  );
};

const MuscularSystemAnalysis: React.FC<{
  workoutHistory: WorkoutHistoryEntry[];
}> = ({ workoutHistory }) => {
  const [view, setView] = useState<"front" | "back">("front");
  const [hoveredUiGroup, setHoveredUiGroup] = useState<UIGroup | null>(null);
  const [focusedUiGroup, setFocusedUiGroup] = useState<UIGroup | null>(null);
  const activeMuscleMap = useMemo(() => {
    const map = new Map<UIGroup, number>();
    const now = Date.now();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    workoutHistory.forEach((entry) => {
      const entryDate = new Date(entry.date).getTime();
      const daysAgoFactor = Math.max(0, 1 - (now - entryDate) / SEVEN_DAYS_MS);
      const activationScore = entry.intensity * daysAgoFactor;
      if (activationScore > 0) {
        entry.muscleGroups.forEach((group) => {
          if (activationScore > (map.get(group) || 0)) {
            map.set(group, activationScore);
          }
        });
      }
    });
    return map;
  }, [workoutHistory]);
  const highlightedUiGroups = useMemo(
    () => new Set(activeMuscleMap.keys()),
    [activeMuscleMap]
  );
  const focusedWorkoutData = useMemo(() => {
    if (!focusedUiGroup) return null;
    return workoutHistory
      .filter((entry) => entry.muscleGroups.includes(focusedUiGroup))
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
  }, [focusedUiGroup, workoutHistory]);
  return (
    <Card className="p-0 sm:p-0 shadow-2xl overflow-hidden relative bg-[#010409] border border-gray-800">
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <h3 className="text-xl font-bold text-gray-100">
              Muscular System Analysis
            </h3>
            <p className="text-sm text-gray-400">
              Active Muscle Groups:{" "}
              <strong className="text-purple-400 font-bold">
                {highlightedUiGroups.size}
              </strong>
            </p>
          </div>
        </div>
        <div className="min-h-[500px] sm:min-h-[600px] w-full h-full flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <AnatomicalFigure
                view={view}
                highlightedUiGroups={highlightedUiGroups}
                hoveredUiGroup={hoveredUiGroup}
                focusedUiGroup={focusedUiGroup}
                onHover={setHoveredUiGroup}
                onFocus={setFocusedUiGroup}
              />
              <div className="absolute inset-0">
                <AnatomicalFigureHyper
                  view={view}
                  activeMuscleGroups={activeMuscleMap}
                  focusedUiGroup={focusedUiGroup}
                  hoveredUiGroup={hoveredUiGroup}
                  onHover={setHoveredUiGroup}
                  onFocus={setFocusedUiGroup}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {focusedUiGroup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-24 right-4 sm:right-6 bg-gray-900/80 backdrop-blur-sm border border-gray-700 p-4 rounded-lg shadow-2xl z-20 w-56 pointer-events-auto"
            >
              <h4 className="font-bold text-lg text-purple-300">
                {MUSCLE_DATA[focusedUiGroup]?.name}
              </h4>
              <p
                className={`text-sm mt-1 font-semibold ${
                  highlightedUiGroups.has(focusedUiGroup)
                    ? "text-green-400"
                    : "text-amber-400"
                }`}
              >
                System Status:{" "}
                {highlightedUiGroups.has(focusedUiGroup)
                  ? "Activated"
                  : "Dormant"}
              </p>
              {focusedWorkoutData && (
                <div className="mt-2 text-xs text-gray-400">
                  <p>
                    Last Trained:{" "}
                    <strong className="text-gray-200">
                      {formatDaysAgo(new Date(focusedWorkoutData.date))}
                    </strong>
                  </p>
                  <p>
                    Peak Intensity:{" "}
                    <strong className="text-gray-200">
                      {(focusedWorkoutData.intensity * 100).toFixed(0)}%
                    </strong>
                  </p>
                </div>
              )}
              <div className="w-full h-px bg-gray-700 my-3" />
              <p className="text-xs text-gray-400">Core Anatomy:</p>
              <ul className="text-xs text-gray-300 list-disc list-inside mt-2 space-y-1">
                {(UI_GROUP_TO_ANATOMY_MAP[focusedUiGroup] || []).map((part) => (
                  <li key={part}>{part}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm p-1 rounded-full shadow-lg">
          <button
            onClick={() => setView("front")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
              view === "front"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setView("back")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
              view === "back"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Back
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MuscularSystemAnalysis;
