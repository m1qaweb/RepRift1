// /src/components/UI/Spinner.tsx - A loading spinner animated with Framer Motion.
import React from "react";
import { motion } from "framer-motion";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  colorClass?: string; // e.g., "text-light-primary dark:text-dark-primary"
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", colorClass }) => {
  const sizeMap = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <motion.div
      className={`inline-block ${sizeMap[size]} ${
        colorClass || "text-light-primary dark:text-dark-primary"
      }`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </motion.div>
  );
};

export default Spinner;
