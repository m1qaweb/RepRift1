// /src/components/Profile/SvgDefs.tsx

import React, { memo } from "react";
import { MUSCLE_DATA, ALL_MUSCLE_GROUPS_UI } from "./AnatomicalData_Hyper";

// This is a new, more advanced lighting system for the anatomical figure.
// It uses a three-layer gradient approach to create a more realistic 3D effect.
const ADVANCED_LIGHTING_DEFS = {
  // A bright, focused light source to create a "hotspot" effect.
  hotspot: (
    <radialGradient id="hotspot-light" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
      <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
    </radialGradient>
  ),
  // A softer, more diffuse light source that provides base color and contouring.
  fill: (
    <linearGradient id="fill-light" gradientTransform="rotate(45)">
      <stop offset="0%" stopColor="rgba(220, 220, 255, 0.1)" />
      <stop offset="100%" stopColor="rgba(200, 200, 255, 0.3)" />
    </linearGradient>
  ),
  // A cool, ambient light that simulates light from the surrounding environment.
  ambient: (
    <radialGradient id="ambient-light" cx="50%" cy="50%" r="70%">
      <stop offset="40%" stopColor="rgba(180, 180, 220, 0)" />
      <stop offset="100%" stopColor="rgba(180, 180, 220, 0.2)" />
    </radialGradient>
  ),
  // Simulates light catching the edges of the muscles, enhancing the 3D effect.
  rim: (
    <filter id="rim-light-filter">
      <feMorphology
        operator="dilate"
        radius="1"
        in="SourceAlpha"
        result="dilated"
      />
      <feGaussianBlur in="dilated" stdDeviation="1" result="blurred" />
      <feFlood floodColor="rgba(200, 220, 255, 0.4)" result="flood" />
      <feComposite in="flood" in2="blurred" operator="in" result="rim" />
      <feComposite in="rim" in2="SourceGraphic" operator="over" />
    </filter>
  ),
};

const SvgDefs = memo(() => (
  <defs>
    {/* ADVANCED LIGHTING */}
    {Object.values(ADVANCED_LIGHTING_DEFS).map((def, i) => (
      <React.Fragment key={i}>{def}</React.Fragment>
    ))}

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

    {/* NEW: Filter and gradient for exercised muscles */}
    <filter id="exercised-glow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
      <feFlood floodColor="#ff0000" result="flood" />
      <feComposite in="flood" in2="blur" operator="in" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <radialGradient id="exercised-pump">
      <stop offset="0%" stopColor="rgba(255, 50, 50, 0.7)" />
      <stop offset="100%" stopColor="rgba(200, 0, 0, 0)" />
    </radialGradient>

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
        gradientTransform="rotate(50)"
      >
        <stop
          offset="0%"
          stopColor={`var(${MUSCLE_DATA[group].colorVar})`}
          stopOpacity="0.8"
        />
        <stop
          offset="80%"
          stopColor={`var(${MUSCLE_DATA[group].colorVar})`}
          stopOpacity="1.0"
        />
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
