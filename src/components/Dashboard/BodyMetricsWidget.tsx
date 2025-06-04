// /src/components/Dashboard/BodyMetricsWidget.tsx – Shows weight/BMI trends with a line chart.
import React, { useEffect, useState } from "react";
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
import Card from "../UI/Card";
import { fetchBodyMetrics } from "../../utils/fakeApi";
import { formatDate } from "../../utils/dateUtils";

interface BodyMetricsChartData {
  date: string;
  weight?: number;
  bmi?: number;
}

const BodyMetricsWidget: React.FC = () => {
  const [chartData, setChartData] = useState<BodyMetricsChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBodyMetrics()
      .then((metrics) => {
        const data = metrics.map((m) => ({
          date: formatDate(m.date, "MMM d"), // Format for X-axis
          weight: m.weightKg,
          bmi: m.bmi,
        }));
        setChartData(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card>
        <p className="p-4 text-center">Loading body metrics...</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold p-4 pb-2 text-light-text dark:text-dark-text">
        Body Metrics Trend (Weight)
      </h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="var(--color-primary, #3B82F6)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 2", "dataMax + 2"]} // Adjust domain for padding
            />
            {/* Add another YAxis if showing BMI simultaneously */}
            {/* <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" /> */}
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                borderColor: "rgba(75, 85, 99, 1)",
                borderRadius: "0.375rem",
              }}
              labelStyle={{
                color: "#f9fafb",
                marginBottom: "4px",
                fontWeight: "600",
              }}
              itemStyle={{ color: "#cbd5e1" }}
              cursor={{ stroke: "rgba(100, 116, 139, 0.2)", strokeWidth: 1 }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <motion.g>
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weight"
                name="Weight (kg)"
                stroke="var(--color-primary, #3B82F6)"
                strokeWidth={2}
                dot={(props) => {
                  // UPDATED: Only destructure what's used
                  const { cx, cy, stroke } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={stroke}
                      className="transition-all duration-150"
                    />
                  );
                }}
                activeDot={{
                  r: 7,
                  strokeWidth: 2,
                  className:
                    "transition-all duration-150 fill-current stroke-current scale-125",
                }}
              />
            </motion.g>
            {/* <Line yAxisId="right" type="monotone" dataKey="bmi" stroke="#82ca9d" /> */}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="p-4 pt-0 text-center text-light-secondary dark:text-dark-secondary">
          No body metrics data available.
        </p>
      )}
    </Card>
  );
};
// To make dots pulse or enlarge: use Recharts activeDot prop or build a custom Dot component.
// Framer Motion cannot easily target individual Recharts dots for hover.
// activeDot={{ r: 8, style: { stroke: 'var(--color-accent)', fill: 'var(--color-accent)', strokeWidth: 2, transition: 'r 0.3s ease' } }}

export default BodyMetricsWidget;
