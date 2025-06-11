// /src/components/Analytics/StatsCard.tsx (Slightly Upgraded)

import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../contexts/ThemeContext";
import { getChartColors } from "../../config/chartThemes";
import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { useChartReady } from "../../hooks/useChartReady";

interface StatsCardProps {
  title: string;
  value: number;
  unit?: string;
  sparklineData: number[];
  comparisonValue: number;
}

const AnimatedNumber: React.FC<{ value: number; unit?: string }> = ({ value, unit }) => {
  const motionValue = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const rounded = useTransform(motionValue, (latest) => {
    if (unit === "k kg") return latest.toFixed(1);
    return Math.round(latest);
  });

  React.useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return <motion.span>{rounded}</motion.span>;
};

const Sparkline: React.FC<{ data: number[]; positive: boolean }> = ({ data, positive }) => {
  const [containerRef, isReady] = useChartReady<HTMLDivElement>();
  const { theme } = useTheme();
  const chartColors = getChartColors(theme || "dark");
  const color = positive ? chartColors[2] : chartColors[3];

  const options: ApexOptions = {
    chart: { type: "line", height: 60, sparkline: { enabled: true } },
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark", type: "vertical", shadeIntensity: 0.5,
        gradientToColors: undefined, inverseColors: true,
        opacityFrom: 0.3, opacityTo: 0, stops: [0, 90, 100],
      },
    },
    colors: [color],
    tooltip: { enabled: false },
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[60px]">
        {isReady && (
          <ReactApexChart
            options={options}
            series={[{ name: "value", data }]}
            type="line"
            height={60}
          />
        )}
    </div>
  );
};

const ComparisonIndicator: React.FC<{ value: number }> = ({ value }) => {
    if (isNaN(value) || !isFinite(value)) return null;

    const isPositive = value >= 0;
    const colorClass = isPositive ? "text-success bg-success/10" : "text-error bg-error/10";
    const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;

    return (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
            <Icon className="h-3 w-3" />
            <span>{Math.abs(value).toFixed(0)}%</span>
        </div>
    );
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, sparklineData, comparisonValue }) => {
  const isPositive = comparisonValue >= 0;
  
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 40px -12px rgba(0,0,0,0.35)' }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-lg p-5 group"
    >
      {/* Accent gradient layer */}
      <div className="pointer-events-none absolute -inset-px rounded-[inherit] bg-gradient-to-br from-brand-primary/40 via-brand-primary/0 to-brand-primary/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Neon ring */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-0 ring-brand-primary/40 transition-all duration-300 group-hover:ring-2" />
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-brand-text-muted">{title}</h3>
        <ComparisonIndicator value={comparisonValue} />
      </div>
      <div className="flex items-end justify-between mt-2">
        <p className="text-3xl font-bold text-brand-text-light">
          <AnimatedNumber value={Number(value)} unit={unit} />
          {unit && <span className="text-xl ml-1 font-medium text-brand-text-muted">{unit}</span>}
        </p>
        <div className="w-28 h-16 -mr-4 -mb-2">
          <Sparkline data={sparklineData} positive={isPositive} />
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(StatsCard);
