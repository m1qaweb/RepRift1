import React from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../contexts/ThemeContext";
import { getChartColors } from "../../config/chartThemes";
import { useChartReady } from "../../hooks/useChartReady";

interface VolumeChartProps {
  data: { x: string; y: number }[];
  dateRange: string;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ data, dateRange }) => {
  const [containerRef, isReady] = useChartReady<HTMLDivElement>();
  const { theme } = useTheme();
  
  const chartColors = getChartColors(theme || "dark");

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 250,
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 0,
        blur: 4,
        color: chartColors[0],
        opacity: 0.3,
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 4 },
    colors: [chartColors[0]],
    fill: {
      type: "gradient",
      gradient: {
        shade: theme,
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 0.6,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: chartColors[5],
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: theme,
      x: { format: "dd MMM, yyyy" },
      y: {
        formatter: (val) => `${val.toLocaleString()} kg`,
        title: {
          formatter: () => `Volume`,
        },
      },
    },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: chartColors[6], fontFamily: 'inherit' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: chartColors[6], fontFamily: 'inherit' },
        formatter: (val) => `${Math.round(val / 1000)}k`,
      },
      min: 0,
    },
    states: {
      hover: {
        filter: { type: 'lighten', value: 0.05 },
      },
    },
  };

  const series = [{ name: "Volume", data }];

  return (
    <motion.div
      ref={containerRef}
      className="h-full w-full p-2"
      initial={{ opacity: 0, y: 20 }}
      animate={isReady ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {isReady ? (
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={250}
        />
      ) : (
        <div className="flex justify-center items-center h-full text-brand-text-muted">Loading chart...</div>
      )}
    </motion.div>
  );
};

export default React.memo(VolumeChart);
