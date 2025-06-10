import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../contexts/ThemeContext";
import {
  getBaseChartOptions,
  getChartColors,
  chartColorPalettes,
} from "../../config/chartThemes";

interface MuscleGroupDistributionChartProps {
  series: number[];
  labels: string[];
}

const MuscleGroupDistributionChart: React.FC<
  MuscleGroupDistributionChartProps
> = ({ series, labels }) => {
  const { theme } = useTheme();
  const currentTheme = theme || "dark";
  const baseOptions = getBaseChartOptions(currentTheme);
  const chartColors = getChartColors(currentTheme);

  const totalVolume = series.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: "donut",
    },
    colors: chartColors,
    labels: labels,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Volume",
              color: chartColorPalettes[currentTheme].textMuted,
              formatter: () => {
                if (totalVolume >= 1000)
                  return `${(totalVolume / 1000).toFixed(1)}k kg`;
                return `${totalVolume.toLocaleString()} kg`;
              },
            },
            value: {
              color: chartColorPalettes[currentTheme].text,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    tooltip: {
      ...baseOptions.tooltip,
      y: {
        formatter: (val, { seriesIndex }) => {
          const percentage =
            totalVolume > 0 ? (series[seriesIndex] / totalVolume) * 100 : 0;
          return `${percentage.toFixed(1)}% (${val.toLocaleString()} kg)`;
        },
      },
    },
  };

  return (
    <div className="rounded-2xl bg-brand-card/30 p-4 border border-brand-border/10 backdrop-blur-sm h-full flex flex-col">
      <h3 className="text-xl font-semibold text-brand-text mb-2">
        Volume by Muscle Group
      </h3>
      <div className="flex-grow flex items-center justify-center">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          width="100%"
        />
      </div>
    </div>
  );
};

export default MuscleGroupDistributionChart;
