// /src/components/Analytics/StatsCard.tsx (Slightly Upgraded)

import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import Card from "../UI/Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactElement;
  unit?: string;
  comparisonValue?: number;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  unit,
  comparisonValue,
  className,
}) => {
  const ComparisonIndicator = () => {
    if (comparisonValue === undefined || comparisonValue === null) return null;

    const isPositive = comparisonValue >= 0;
    const isZero = comparisonValue === 0;

    if (isZero) {
      return (
        <span className="text-xs font-medium text-brand-text-muted">
          No change
        </span>
      );
    }

    return (
      <div
        className={`flex items-center text-xs font-medium ${
          isPositive ? "text-success" : "text-error"
        }`}
      >
        {isPositive ? (
          <ArrowUpIcon className="h-3 w-3 mr-1" />
        ) : (
          <ArrowDownIcon className="h-3 w-3 mr-1" />
        )}
        <span>{Math.abs(comparisonValue)}%</span>
      </div>
    );
  };

  return (
    <motion.div
      className="rounded-lg bg-brand-card/30 p-4 border border-brand-border/10 backdrop-blur-sm flex flex-col justify-between"
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-medium text-brand-text-muted">{title}</h3>
        <div className="text-brand-primary">{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-bold text-brand-text">
          {value}
          {unit && (
            <span className="text-base ml-1 font-medium text-brand-text-muted">
              {unit}
            </span>
          )}
        </p>
        <ComparisonIndicator />
      </div>
    </motion.div>
  );
};

export default StatsCard;
