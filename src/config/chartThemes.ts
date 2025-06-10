import { ApexOptions } from "apexcharts";

// Define color palettes for both light and dark themes
const chartColorPalettes = {
  light: {
    primary: "rgb(10, 10, 10)",
    text: "rgb(10, 10, 10)",
    textMuted: "rgb(82, 82, 82)",
    border: "rgb(229, 229, 229)",
    // A vibrant and accessible color palette for light mode
    series: ["#0a0a0a", "#2563eb", "#d946ef", "#f59e0b", "#10b981"],
  },
  dark: {
    primary: "rgb(250, 250, 250)",
    text: "rgb(250, 250, 250)",
    textMuted: "rgb(163, 163, 163)",
    border: "rgb(38, 38, 38)",
    // A vibrant and accessible color palette for dark mode
    series: ["#fafafa", "#3b82f6", "#f0abfc", "#facc15", "#34d399"],
  },
};

export const getChartColors = (theme: "light" | "dark") => {
  return chartColorPalettes[theme].series;
};

// Base options for all charts to ensure consistency
const getBaseChartOptions = (theme: "light" | "dark"): ApexOptions => {
  const colors = chartColorPalettes[theme];

  return {
    chart: {
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "Poppins, sans-serif",
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    grid: {
      borderColor: colors.border,
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 10, right: 10 },
    },
    xaxis: {
      tickAmount: 6,
      labels: {
        style: {
          colors: colors.textMuted,
          fontWeight: 400,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: colors.textMuted,
          fontWeight: 400,
        },
        formatter: (val: number) => {
          if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
          return val.toFixed(0);
        },
      },
    },
    tooltip: {
      theme: theme,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
      labels: {
        colors: colors.text,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
  };
};

export { getBaseChartOptions, chartColorPalettes };
