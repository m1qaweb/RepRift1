// /src/components/Profile/SvgDefs.tsx

import React, { memo } from "react";
import { MUSCLE_DATA, ALL_MUSCLE_GROUPS_UI } from "./AnatomicalData_Hyper";

const SvgDefs = memo(() => (
  <defs>
    {/* CREATIVE ENHANCEMENT: Glow filter for hover/focus */}
    <filter
      id="outline-glow-filter"
      x="-50%"
      y="-50%"
      width="200%"
      height="200%"
    >
      <feDropShadow
        dx="0"
        dy="0"
        stdDeviation="1.5"
        floodColor="rgb(var(--color-primary-rgb))"
      />
    </filter>

    <linearGradient id="vascular-pulse-gradient">
      <stop
        offset="0%"
        stopColor="rgb(var(--color-primary-rgb))"
        stopOpacity="0"
      />
      <stop
        offset="50%"
        stopColor="rgb(var(--color-primary-rgb))"
        stopOpacity="1"
      />
      <stop
        offset="100%"
        stopColor="rgb(var(--color-primary-rgb))"
        stopOpacity="0"
      />
    </linearGradient>

    {/* TEXTURE DEFINITIONS (from original code) */}
    <filter id="vertical-fiber-filter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.015 0.2"
        numOctaves="2"
        result="noise"
      />
      <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
        <feDistantLight azimuth="90" elevation="60" />
      </feDiffuseLighting>
    </filter>
    <pattern
      id="vertical-fiber"
      patternUnits="userSpaceOnUse"
      width="400"
      height="700"
    >
      <rect
        width="400"
        height="700"
        fill="#888"
        filter="url(#vertical-fiber-filter)"
      />
    </pattern>
    <filter id="angled-fiber-filter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.2 0.2"
        numOctaves="2"
        result="noise"
      />
      <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
        <feDistantLight azimuth="90" elevation="60" />
      </feDiffuseLighting>
    </filter>
    <pattern
      id="angled-fiber"
      patternUnits="userSpaceOnUse"
      width="400"
      height="700"
    >
      <rect
        width="400"
        height="700"
        fill="#888"
        filter="url(#angled-fiber-filter)"
      />
    </pattern>
    <filter id="fanned-fiber-filter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.1 0.02"
        numOctaves="2"
        result="noise"
      />
      <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
        <feDistantLight azimuth="90" elevation="60" />
      </feDiffuseLighting>
    </filter>
    <pattern
      id="fanned-fiber"
      patternUnits="userSpaceOnUse"
      width="400"
      height="700"
    >
      <rect
        width="400"
        height="700"
        fill="#888"
        filter="url(#fanned-fiber-filter)"
      />
    </pattern>

    {/* COLOR GRADIENTS */}
    {ALL_MUSCLE_GROUPS_UI.map((group) => (
      <linearGradient
        id={`${group}-color`}
        key={group}
        gradientTransform="rotate(45)"
      >
        <stop
          offset="0%"
          stopColor={`var(${MUSCLE_DATA[group].colorVar})`}
          stopOpacity="0.7"
        />
        <stop offset="100%" stopColor={`var(${MUSCLE_DATA[group].colorVar})`} />
      </linearGradient>
    ))}

    {/* ATMOSPHERE */}
    <radialGradient id="vignette-bg" cx="50%" cy="50%" r="60%">
      <stop offset="20%" stopColor="#242833" />
      <stop offset="100%" stopColor="#0a0b0f" />
    </radialGradient>
  </defs>
));

SvgDefs.displayName = "SvgDefs";
export default SvgDefs;
