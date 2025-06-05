// /src/components/Analytics/StatsCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import Card from "../UI/Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  onVisibleAnimate?: boolean;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  unit,
  trend,
  trendValue,
  onVisibleAnimate = true,
  className,
}) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
      },
    },
  };

  const trendColorClasses = {
    up: "text-success",
    down: "text-error",
    neutral: "text-brand-text-muted",
  };

  return (
    <motion.div
      variants={cardVariants}
      initial={onVisibleAnimate ? "hidden" : false}
      whileInView={onVisibleAnimate ? "visible" : undefined}
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      <Card
        className="p-5 flex flex-col items-start justify-between min-h-[130px] shadow-brand"
        hoverEffect={true}
      >
        <div className="flex items-center justify-between w-full mb-1">
          <h4 className="text-sm font-medium text-brand-text-muted uppercase tracking-wider">
            {title}
          </h4>
          {icon && (
            <span className="text-brand-primary text-opacity-80">{icon}</span>
          )}
        </div>

        <div className="mt-1">
          <p className="text-3xl font-bold text-brand-text">
            {value}
            {unit && (
              <span className="text-base font-medium text-brand-text-muted ml-1.5">
                {unit}
              </span>
            )}
          </p>
        </div>

        {trend && trendValue && (
          <div
            className={`mt-2 text-xs flex items-center font-medium ${
              trendColorClasses[trend] || "text-brand-text-muted"
            }`}
          >
            {trend === "up" && <ArrowUpIcon className="h-3.5 w-3.5 mr-0.5" />}
            {trend === "down" && (
              <ArrowDownIcon className="h-3.5 w-3.5 mr-0.5" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default StatsCard;
