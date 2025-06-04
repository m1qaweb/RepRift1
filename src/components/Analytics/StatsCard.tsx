// /src/components/Analytics/StatsCard.tsx – Displays a single statistic with an icon and label.
import React from "react";
import { motion } from "framer-motion";
import Card from "../UI/Card"; // Use the shared Card component

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode; // e.g., an SVG icon
  unit?: string;
  trend?: "up" | "down" | "neutral"; // Optional trend indicator
  trendValue?: string;
  onVisibleAnimate?: boolean; // Control if animation runs when scrolled into view
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  unit,
  trend,
  trendValue,
  onVisibleAnimate = true,
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -30 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      // Animate when this component scrolls into view
      initial={onVisibleAnimate ? "hidden" : false} // If false, use parent's control or static
      whileInView={onVisibleAnimate ? "visible" : undefined}
      viewport={{ once: true, amount: 0.3 }} // amount: 0.3 means 30% of card visible triggers animation
    >
      <Card className="p-4 flex flex-col items-start justify-between min-h-[120px] text-light-text dark:text-dark-text">
        <div className="flex items-center justify-between w-full">
          <h4 className="text-sm font-medium text-light-secondary dark:text-dark-secondary">
            {title}
          </h4>
          {icon && (
            <span className="text-light-primary dark:text-dark-primary">
              {icon}
            </span>
          )}
        </div>
        <div className="mt-1">
          <p className="text-3xl font-bold">
            {value}
            {unit && <span className="text-base font-normal ml-1">{unit}</span>}
          </p>
        </div>
        {trend && trendValue && (
          <div
            className={`mt-1 text-xs flex items-center ${
              trend === "up"
                ? "text-green-500"
                : trend === "down"
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {/* Basic arrow icons - replace with better ones if needed */}
            {trend === "up" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            )}
            {trend === "down" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default StatsCard;
