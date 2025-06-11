import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useTheme } from "../../contexts/ThemeContext";
import { getChartColors } from "../../config/chartThemes";
import { useChartReady } from "../../hooks/useChartReady";

interface MuscleGroupDistributionChartProps {
  data: { label: string; value: number }[];
}

const MuscleGroupDistributionChart: React.FC<MuscleGroupDistributionChartProps> = ({ data }) => {
  const [containerRef, isReady] = useChartReady<HTMLDivElement>();
  const { theme } = useTheme();
  const chartColors = getChartColors(theme || 'dark');

  const series = data.map(d => d.value);
  const labels = data.map(d => d.label);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      height: 250,
      background: 'transparent',
      dropShadow: {
        enabled: true,
        top: 2,
        left: 0,
        blur: 3,
        color: chartColors[2],
        opacity: 0.2,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Sets',
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return total.toString();
              },
              color: chartColors[6],
            },
          },
        },
      },
    },
    labels: labels,
    colors: [chartColors[2], chartColors[0], chartColors[1], chartColors[3], chartColors[4], chartColors[5]],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    legend: {
      position: 'bottom',
      fontFamily: 'inherit',
      labels: { colors: chartColors[6] },
    },
    tooltip: {
      theme: theme,
      y: { formatter: (val) => `${val} sets` },
    },
    stroke: { width: 0 },
  };

  const hasData = data.length > 0 && data.some(d => d.value > 0);

  return (
    <div ref={containerRef} className="w-full h-full">
      {isReady && hasData ? (
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={250}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-brand-text-muted">
          {hasData ? "Loading chart..." : "No workout data for this period."}
        </div>
      )}
    </div>
  );
};

export default React.memo(MuscleGroupDistributionChart);
