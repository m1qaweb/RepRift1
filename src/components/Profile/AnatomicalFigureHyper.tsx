// src/components/Profile/AnatomicalFigureHyper.tsx
import React, { FC, useMemo } from "react"; // <-- Added useMemo
import { motion } from "framer-motion";

// Corrected and completed imports
import {
  ANATOMICAL_PATHS_HYPER,
  MuscleRenderData,
  UI_GROUP_TO_ANATOMY_MAP,
} from "./AnatomicalData_Hyper";
import SvgDefs from "./SvgDefs";
import { type UIGroup, ANATOMICAL_GRAPH } from "./AnatomicalGraph";

interface AnatomicalFigureHyperProps {
  view: "front" | "back";
  activeMuscleGroups: Map<UIGroup, number>;
  focusedUiGroup: UIGroup | null;
  hoveredUiGroup: UIGroup | null;
  onHover: (group: UIGroup | null) => void;
  onFocus: (group: UIGroup | null) => void;
}

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

  let state: "dormant" | "active" | "hover" | "focus" = "dormant";
  if (isFocused) state = "focus";
  else if (isHovered) state = "hover";
  else if (activation > 0) state = "active";

  return (
    <motion.g
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
  parts.forEach((part) => {
    anatomyToUiGroupMap.set(part, uiGroup as UIGroup);
  });
});

export const AnatomicalFigureHyper: FC<AnatomicalFigureHyperProps> = ({
  view,
  activeMuscleGroups,
  focusedUiGroup,
  hoveredUiGroup,
  onHover,
  onFocus,
}) => {
  const viewPaths = ANATOMICAL_PATHS_HYPER[view];

  // THE FIX: Use a Set for safe and efficient membership checking.
  // We memoize it so it's only recalculated when the view changes.
  const visibleGroupSet = useMemo(
    () => new Set(ANATOMICAL_GRAPH.views[view]),
    [view]
  );

  const handleFocus = (group: UIGroup) => {
    onFocus(focusedUiGroup === group ? null : group);
  };

  return (
    <svg
      viewBox="90 120 220 550"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <SvgDefs />

      {Object.entries(viewPaths).map(([partName, pathData]) => {
        const uiGroup = anatomyToUiGroupMap.get(partName);

        // THE FIX: Use the Set's .has() method instead of Array.includes()
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
            onClick={() => handleFocus(uiGroup)}
          />
        );
      })}
    </svg>
  );
};

export default AnatomicalFigureHyper;
