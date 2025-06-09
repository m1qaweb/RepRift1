// /src/components/Workout/Timer.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TimerProps {
  durationSeconds: number;
  onComplete: () => void;
  size?: number;
  strokeWidth?: number;
}

const Timer: React.FC<TimerProps> = ({
  durationSeconds,
  onComplete,
  size = 140,
  strokeWidth = 10,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const controls = useAnimation();

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      // Add a little shake animation on complete
      controls.start({
        x: [0, -5, 5, -5, 5, 0],
        transition: { type: "spring", stiffness: 700, damping: 10 },
      });
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete, controls]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (durationSeconds - timeLeft) / durationSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.5}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={controls}
        exit={{ opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } }}
        transition={{ type: "spring", damping: 20, stiffness: 250 }}
        className="fixed bottom-8 right-8 z-50 bg-brand-card/70 backdrop-blur-xl p-4 rounded-full shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }} // Necessary for pan gestures on touch devices
      >
        <div className="flex items-center space-x-4">
          <div className="relative" style={{ width: size, height: size }}>
            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 rounded-full bg-brand-primary/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <svg
              className="absolute inset-0 -rotate-90"
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                className="stroke-brand-background/50"
                fill="transparent"
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                className="stroke-brand-primary"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-brand-text tabular-nums">
                {timeLeft}
              </span>
              <span className="text-xs text-brand-text-muted uppercase tracking-widest mt-1">
                REST
              </span>
            </div>
          </div>
          <button
            onClick={onComplete}
            className="pr-4 text-brand-text-muted hover:text-white transition-colors flex flex-col items-center group"
            aria-label="Skip timer"
          >
            <XMarkIcon className="h-6 w-6" />
            <span className="text-xs uppercase tracking-widest group-hover:text-brand-primary transition-colors">
              Skip
            </span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Timer;
