// /src/components/Workout/Timer.tsx – Countdown timer for rest periods.
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface TimerProps {
  durationSeconds: number; // Duration of the timer in seconds
  onComplete: () => void; // Callback when timer finishes
  size?: number; // Diameter of the circle
  strokeWidth?: number; // Width of the circle's stroke
}

const Timer: React.FC<TimerProps> = ({
  durationSeconds,
  onComplete,
  size = 100,
  strokeWidth = 8,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const controls = useAnimation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Reset timer if duration changes
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      onComplete();
      return;
    }

    // Update circle animation
    controls.start({
      strokeDashoffset:
        circumference - (timeLeft / durationSeconds) * circumference,
      transition: { duration: 1, ease: "linear" }, // Smooth transition for each second
    });

    // Change stroke color when time is nearly up (e.g., last 10 seconds)
    if (timeLeft <= 10 && timeLeft > 0) {
      controls.start({
        stroke: "var(--color-warning, #F59E0B)", // Use CSS var for warning (e.g., amber-500)
        transition: { duration: 0.5 },
      });
    } else if (timeLeft > 10) {
      controls.start({
        stroke: "var(--color-primary, #3B82F6)", // Back to primary color
        transition: { duration: 0.5 },
      });
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft, durationSeconds, onComplete, controls, circumference]);

  // Format time for display MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-700 opacity-50"
          fill="transparent"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="var(--color-primary, #3B82F6)" // Initial color (CSS variable from theme or default)
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={controls}
          initial={{ strokeDashoffset: circumference }} // Starts empty
        />
      </svg>
      <motion.div
        key={timeLeft} // Re-animate on timeLeft change for subtle pulse
        initial={{ scale: timeLeft === durationSeconds ? 1 : 1.05 }} // No pulse on initial render
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute text-xl font-semibold text-light-text dark:text-dark-text"
      >
        {`${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`}
      </motion.div>
      <button
        onClick={() => {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onComplete();
        }}
        className="absolute -bottom-8 text-xs text-light-primary dark:text-dark-primary hover:underline"
      >
        Skip Rest
      </button>
    </div>
  );
};
// Add CSS Variables for colors:
// :root { --color-primary: #3B82F6; --color-warning: #F59E0B; }
// .dark { --color-primary: #60A5FA; --color-warning: #FBBF24; }

export default Timer;
