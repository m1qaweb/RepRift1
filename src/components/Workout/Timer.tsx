// /src/components/Workout/Timer.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Button from "../UI/Button";

interface TimerProps {
  durationSeconds: number;
  onComplete: () => void;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  durationSeconds,
  onComplete,
  size = 90,
  strokeWidth = 7,
  className,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const controls = useAnimation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const warningColorVar = "var(--color-warning)";
  const primaryColorVar = "var(--color-primary)";

  useEffect(() => {
    setTimeLeft(durationSeconds);
    controls.start({
      stroke: primaryColorVar,
      strokeDashoffset: circumference,
      transition: { duration: 0.1 },
    });
  }, [durationSeconds, controls, circumference, primaryColorVar]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      onComplete();
      return;
    }

    controls.start({
      strokeDashoffset:
        circumference - (timeLeft / durationSeconds) * circumference,
      transition: { duration: 1, ease: "linear" },
    });

    if (timeLeft <= 10 && timeLeft > 0) {
      controls.start({
        stroke: warningColorVar,
        transition: { duration: 0.5 },
      });
    } else if (timeLeft > 10) {
      controls.start({
        stroke: primaryColorVar,
        transition: { duration: 0.5 },
      });
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    timeLeft,
    durationSeconds,
    onComplete,
    controls,
    circumference,
    primaryColorVar,
    warningColorVar,
  ]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className={`relative flex flex-col items-center justify-center ${
        className || ""
      }`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgb(var(--color-border-rgb) / 0.3)"
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={primaryColorVar}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={controls}
          initial={{ strokeDashoffset: circumference }}
        />
      </svg>
      <motion.div
        key={timeLeft}
        initial={{ scale: timeLeft === durationSeconds ? 1 : 1.05 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute text-xl font-semibold text-brand-text"
      >
        {`${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`}
      </motion.div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onComplete();
        }}
        className="absolute -bottom-10 text-xs"
      >
        Skip Rest
      </Button>
    </div>
  );
};

export default Timer;
