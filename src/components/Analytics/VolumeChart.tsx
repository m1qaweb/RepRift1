import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../contexts/ThemeContext";
import { getBaseChartOptions, getChartColors } from "../../config/chartThemes";

interface VolumeChartProps {
  series: {
    name: string;
    data: { x: string; y: number }[];
  }[];
  height?: number;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ series, height = 350 }) => {
  const { theme } = useTheme();
  const currentTheme = theme || "dark";
  const baseOptions = getBaseChartOptions(currentTheme);
  const chartColors = getChartColors(currentTheme);

  const options: ApexOptions = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: "area",
      height: height,
      zoom: {
        enabled: false,
      },
    },
    colors: [chartColors[0]],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    stroke: {
      ...baseOptions.stroke,
      width: 3,
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      ...baseOptions.xaxis,
      type: "datetime",
    },
    yaxis: {
      ...baseOptions.yaxis,
      title: {
        text: "Volume (kg)",
        style: {
          ...(baseOptions.yaxis as any)?.title?.style,
        },
      },
    },
    tooltip: {
      ...baseOptions.tooltip,
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (val) => `${val.toLocaleString()} kg`,
      },
    },
  };

  return (
    <div className="rounded-2xl bg-brand-card/30 p-4 border border-brand-border/10 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-brand-text mb-2">
        Workout Volume
      </h3>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={height}
      />
    </div>
  );
};

export default VolumeChart;
