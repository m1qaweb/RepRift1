import React from "react";
import { motion } from "framer-motion";

const GoalProgress: React.FC = () => {
  const goal = 5;
  const completed = 3;
  const percentage = (completed / goal) * 100;

  const circumference = 2 * Math.PI * 54; // 2 * pi * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-brand-card rounded-2xl shadow-lg p-6 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-brand-text">Weekly Goal</h3>
        <p className="text-brand-text-muted text-sm">
          You're on the right track!
        </p>
      </div>
      <div className="relative mx-auto" style={{ width: 140, height: 140 }}>
        <svg
          className="absolute inset-0"
          width="140"
          height="140"
          viewBox="0 0 120 120"
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="12"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="12"
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-brand-text">
            {completed}/{goal}
          </span>
          <span className="text-sm text-brand-text-muted">Workouts</span>
        </div>
      </div>
    </div>
  );
};

export default GoalProgress;
