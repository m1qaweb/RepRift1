import React from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../contexts/ThemeContext";
import { getChartColors } from "../../config/chartThemes";
import { useChartReady } from "../../hooks/useChartReady";

interface ExerciseProgressChartProps {
  series: { name: string; data: { x: any; y: any }[] }[];
  exercise: string;
  onExerciseChange: (exercise: string) => void;
  exerciseOptions: { value: string; label: string }[];
}

const ExerciseProgressChart: React.FC<ExerciseProgressChartProps> = ({
  series,
  exercise,
  onExerciseChange,
  exerciseOptions,
}) => {
  const [containerRef, isReady] = useChartReady<HTMLDivElement>();
  const { theme } = useTheme();
  const chartColors = getChartColors(theme || 'dark');

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 300,
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 0,
        blur: 4,
        color: chartColors[1],
        opacity: 0.25,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 4 },
    colors: [chartColors[1], chartColors[2], chartColors[4]],
    grid: {
      borderColor: chartColors[5],
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontFamily: 'inherit',
      labels: { colors: chartColors[6] },
    },
    tooltip: {
      theme: theme,
      x: { format: "dd MMM, yyyy" },
    },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: chartColors[6], fontFamily: 'inherit' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: chartColors[6], fontFamily: 'inherit' },
        formatter: (val) => `${val} kg`,
      },
    },
    markers: {
      size: 0,
      hover: { size: 6 },
      strokeWidth: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
  };

  const Dropdown = (
    <select
      value={exercise}
      onChange={(e) => onExerciseChange(e.target.value)}
      className="bg-white/10 backdrop-blur-md rounded-md px-3 py-1.5 text-sm text-brand-text-light focus:ring-2 focus:ring-brand-primary/60 border border-white/20"
    >
      {exerciseOptions.map(option => (
        <option key={option.value} value={option.value} className="bg-brand-surface text-brand-text-light">
          {option.label}
        </option>
      ))}
    </select>
  );

  const hasData = series.length > 0 && series.some((s) => s.data.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-text-light">Exercise Progress</h3>
        {Dropdown}
      </div>
      <motion.div
        ref={containerRef}
        className="w-full h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={isReady ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {isReady && hasData ? (
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={300}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-brand-text-muted">
             {hasData ? "Loading chart..." : "Select an exercise to see progress."}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(ExerciseProgressChart);
