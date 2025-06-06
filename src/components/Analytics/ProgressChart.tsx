// /src/components/Analytics/ProgressChart.tsx (Upgraded Version)
import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface ChartDataPoint {
  [key: string]: any;
}

interface DataKeyConfig {
  key: string;
  name: string;
  color: string;
  yAxisId: "left" | "right";
  type?: "line" | "area";
}

interface ProgressChartProps {
  data: ChartDataPoint[];
  dataKeys: DataKeyConfig[];
  xAxisDataKey: string;
  title: string;
  height?: number;
  goal?: { value: number; label: string; yAxisId: "left" | "right" };
}

// Professional Custom Tooltip
const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-brand-card/90 backdrop-blur-sm shadow-xl rounded-lg border border-brand-border/30 text-xs min-w-[150px]">
        <p className="font-semibold text-brand-text mb-2">{label}</p>
        {payload.map((entry) => (
          <div
            key={`item-${entry.name}`}
            style={{ color: entry.color }}
            className="font-medium flex justify-between items-center"
          >
            <span>{entry.name}:</span>
            <span className="ml-3 tabular-nums font-bold">
              {Number(entry.value).toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  dataKeys,
  xAxisDataKey,
  title,
  height = 350,
  goal,
}) => {
  if (!data || data.length < 2) {
    return (
      <div
        style={{ height: `${height}px` }}
        className="flex flex-col justify-center items-center text-center p-4"
      >
        <h3 className="text-lg font-semibold text-brand-text mb-2">{title}</h3>
        <p className="text-brand-text-muted text-sm">
          Not enough data to display a trend. Log more entries to see your
          progress!
        </p>
      </div>
    );
  }

  const yAxisLeftData = dataKeys.find((dk) => dk.yAxisId === "left");
  const yAxisRightData = dataKeys.find((dk) => dk.yAxisId === "right");
  const ChartComponent = dataKeys.some((dk) => dk.type === "area")
    ? AreaChart
    : LineChart;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <h3 className="text-lg font-semibold mb-4 text-brand-text pl-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
        >
          <defs>
            {dataKeys.map((dk) => (
              <linearGradient
                key={`gradient-${dk.key}`}
                id={`gradient-${dk.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={dk.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={dk.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgb(var(--color-border-rgb) / 0.15)"
          />
          <XAxis
            dataKey={xAxisDataKey}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />

          {yAxisLeftData && (
            <YAxis
              yAxisId="left"
              stroke={yAxisLeftData.color}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
          )}
          {yAxisRightData && (
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={yAxisRightData.color}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
          )}

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "rgb(var(--color-primary-rgb) / 0.2)",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
          />
          <Legend
            iconSize={10}
            wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
          />

          {goal && (
            <ReferenceLine
              y={goal.value}
              yAxisId={goal.yAxisId}
              label={{
                value: goal.label,
                position: "insideTopRight",
                fill: "var(--color-success)",
                fontSize: 10,
              }}
              stroke="var(--color-success)"
              strokeDasharray="4 4"
            />
          )}

          {dataKeys.map((dk) => {
            if (dk.type === "area") {
              return (
                <Area
                  key={dk.key}
                  yAxisId={dk.yAxisId}
                  type="monotone"
                  dataKey={dk.key}
                  name={dk.name}
                  stroke={dk.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#gradient-${dk.key})`}
                />
              );
            }
            return (
              <Line
                key={dk.key}
                yAxisId={dk.yAxisId}
                type="monotone"
                dataKey={dk.key}
                name={dk.name}
                stroke={dk.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "var(--color-card)",
                  strokeWidth: 2,
                }}
              />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ProgressChart;
