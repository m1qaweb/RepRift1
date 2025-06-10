import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../contexts/ThemeContext";
import { getBaseChartOptions, getChartColors } from "../../config/chartThemes";

interface ExerciseProgressChartProps {
  series: { name: string; data: number[] }[];
  categories: string[];
  title: string;
  onExerciseChange: (exerciseName: string) => void;
  exerciseOptions: string[];
  selectedExercise: string;
}

const ExerciseProgressChart: React.FC<ExerciseProgressChartProps> = ({
  series,
  categories,
  title,
  onExerciseChange,
  exerciseOptions,
  selectedExercise,
}) => {
  const { theme } = useTheme();
  const currentTheme = theme || "dark";
  const baseOptions = getBaseChartOptions(currentTheme);
  const chartColors = getChartColors(currentTheme);

  const options: ApexOptions = {
    ...baseOptions,
    colors: [chartColors[1], chartColors[2], chartColors[3]],
    chart: {
      ...baseOptions.chart,
      height: 350,
      type: "line",
      zoom: { enabled: false },
    },
    stroke: {
      ...baseOptions.stroke,
      width: [3, 2, 2],
      dashArray: [0, 4, 8],
    },
    markers: {
      size: [5, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      ...baseOptions.xaxis,
      type: "category",
      categories: categories,
    },
    tooltip: {
      ...baseOptions.tooltip,
      y: {
        formatter: (val, { seriesIndex }) => {
          const unit =
            seriesIndex === 0 ? "kg (e1RM)" : seriesIndex === 1 ? "kg" : "reps";
          return `${val.toFixed(1)} ${unit}`;
        },
      },
    },
  };

  return (
    <div className="rounded-2xl bg-brand-card/30 p-4 border border-brand-border/10 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-brand-text">{title}</h3>
        <select
          value={selectedExercise}
          onChange={(e) => onExerciseChange(e.target.value)}
          className="bg-brand-background/80 border border-brand-border/20 text-brand-text text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-48 p-2"
        >
          {exerciseOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default ExerciseProgressChart;
