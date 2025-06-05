// /src/components/UI/Spinner.tsx
import React from "react";
import { motion } from "framer-motion";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  colorClass?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  colorClass,
  className,
}) => {
  const sizeMap = {
    xs: "h-4 w-4",
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const resolvedColorClass = colorClass || "text-brand-primary";

  return (
    <div
      className={`inline-flex items-center justify-center ${className || ""}`}
    >
      <motion.div
        className={`${sizeMap[size]} ${resolvedColorClass}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </motion.div>
    </div>
  );
};

export default Spinner;
