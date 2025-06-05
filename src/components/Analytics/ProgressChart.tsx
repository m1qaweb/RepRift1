// /src/components/Analytics/ProgressChart.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface TransformedChartData {
  date: string;
  value: number | undefined | null;
}

interface ProgressChartProps<
  TData extends { date: string; [key: string]: any }
> {
  data: TData[];
  dataKey: keyof TData & string;
  title?: string;
  yAxisLabel?: string;
  lineColorVar?: string;
}

const ProgressChart = <TData extends { date: string; [key: string]: any }>({
  data,
  dataKey,
  title,
  yAxisLabel,
  lineColorVar = "--color-primary",
}: ProgressChartProps<TData>) => {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 text-center text-brand-text-muted"
      >
        No data available for {title || "chart"}.
      </motion.div>
    );
  }

  const transformedChartData: TransformedChartData[] = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value:
      typeof item[dataKey] === "number" ? (item[dataKey] as number) : undefined,
  }));

  const lineName = dataKey
    .toString()
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  const axisStrokeColor = "currentColor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 bg-brand-card rounded-lg shadow-lg"
    >
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-brand-text">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={transformedChartData}
          margin={{ top: 5, right: 20, left: yAxisLabel ? 0 : -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis
            dataKey="date"
            stroke={axisStrokeColor}
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "rgb(var(--color-border-rgb) / 0.7)" }}
          />
          <YAxis
            stroke={axisStrokeColor}
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "rgb(var(--color-border-rgb) / 0.7)" }}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    dy: 70,
                    offset: -5,
                    style: {
                      textAnchor: "middle",
                      fill: "rgb(var(--color-text-muted-rgb))",
                      fontSize: "12px",
                      fontWeight: 500,
                    },
                  }
                : undefined
            }
          />
          <Tooltip
            cursor={{
              stroke: "rgb(var(--color-primary-rgb) / 0.3)",
              strokeWidth: 1,
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
          <motion.g
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          >
            <Line
              type="monotone"
              dataKey="value"
              name={lineName}
              stroke={`var(${lineColorVar})`}
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: `var(${lineColorVar})`,
                stroke: "rgb(var(--color-card-rgb))",
                strokeWidth: 1.5,
              }}
              activeDot={{
                r: 6,
                fill: `var(${lineColorVar})`,
                stroke: "rgb(var(--color-card-rgb))",
                strokeWidth: 2,
              }}
            />
          </motion.g>
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ProgressChart;
