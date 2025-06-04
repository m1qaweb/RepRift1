// /src/components/Analytics/ProgressChart.tsx – Displays progress with an animated chart.
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

// Define a generic data structure that the chart expects for internal processing
interface TransformedChartData {
  date: string; // Formatted date for X-axis
  value: number | undefined | null; // The value for Y-axis
}

// Generic Props for the ProgressChart component
// TData is the type of the original data items passed in.
// It must have a 'date' property (string) and the property specified by dataKey.
interface ProgressChartProps<
  TData extends { date: string; [key: string]: any }
> {
  data: TData[];
  dataKey: keyof TData & string; // Ensure dataKey is also a string for easy use in name generation
  title?: string;
  yAxisLabel?: string; // Optional label for the Y-axis
}

const ProgressChart = <TData extends { date: string; [key: string]: any }>({
  data,
  dataKey,
  title,
  yAxisLabel,
}: ProgressChartProps<TData>) => {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 text-center text-light-secondary dark:text-dark-secondary"
      >
        No data available for {title || "chart"}.
      </motion.div>
    );
  }

  // Transform original data to the structure Recharts LineChart will use internally ('date' and 'value')
  const transformedChartData: TransformedChartData[] = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      // Ensure item.date is a valid date string or timestamp
      month: "short",
      day: "numeric",
    }),
    value: item[dataKey] as number, // Assuming the value at dataKey is numeric
  }));

  // Generate a readable name for the Line based on the dataKey
  const lineName = dataKey
    .toString()
    .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-light-card dark:bg-dark-card rounded-lg shadow"
    >
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={transformedChartData} // Use the transformed data
          margin={{ top: 5, right: 30, left: yAxisLabel ? 5 : -15, bottom: 5 }} // Adjust left margin for yAxisLabel
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="date" stroke="currentColor" fontSize={12} />
          <YAxis
            stroke="currentColor"
            fontSize={12}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    dy: 70,
                    style: {
                      textAnchor: "middle",
                      fill: "currentColor",
                      fontSize: "10px",
                    },
                  }
                : undefined
            }
            // domain={['auto', 'auto']} // Recharts default is usually fine
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(31, 41, 55, 0.8)",
              borderColor: "rgba(75, 85, 99, 1)",
              borderRadius: "0.375rem",
            }}
            labelStyle={{
              color: "#f9fafb",
              marginBottom: "4px",
              fontWeight: "600",
            }}
            itemStyle={{ color: "#f9fafb" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <motion.g // Group for line animation
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Line
              type="monotone"
              dataKey="value" // The Line component now always uses the 'value' field from transformedChartData
              name={lineName}
              stroke="var(--color-primary, #3B82F6)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--color-primary, #3B82F6)" }}
              activeDot={{ r: 6, strokeWidth: 0 }} // Make activeDot simpler or style via className
            />
          </motion.g>
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ProgressChart;
