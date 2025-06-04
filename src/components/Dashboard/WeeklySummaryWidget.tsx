// /src/components/Dashboard/WeeklySummaryWidget.tsx – Displays weekly workout minutes chart.
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // UPDATED: Removed Legend from this import
} from "recharts";
import Card from "../UI/Card";
// UPDATED: Removed WorkoutLog from this import
import { fetchWorkoutLogs } from "../../utils/fakeApi";
import { getWeekDates, formatDate } from "../../utils/dateUtils";

interface WeeklySummaryData {
  name: string; // Day name e.g., "Mon"
  minutes: number;
}

const WeeklySummaryWidget: React.FC = () => {
  const [chartData, setChartData] = useState<WeeklySummaryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const weekDates = getWeekDates(new Date(), 1); // Monday as start of week

    // Prepare initial data structure for the week
    const initialData: WeeklySummaryData[] = weekDates.map((date) => ({
      name: formatDate(date, "E"), // 'Mon', 'Tue', etc.
      minutes: 0,
    }));

    fetchWorkoutLogs() // Fetch all logs, then filter (or ideally, API supports date range)
      .then((logs) => {
        // logs type is inferred here from fetchWorkoutLogs
        const processedData = initialData.map((dayData, index) => {
          const currentDate = weekDates[index];
          const logsForDay = logs.filter(
            (log) =>
              new Date(log.date).toDateString() === currentDate.toDateString()
          );
          const totalMinutesForDay = logsForDay.reduce(
            (sum, log) => sum + (log.durationMinutes || 0),
            0
          );
          return { ...dayData, minutes: totalMinutesForDay };
        });
        setChartData(processedData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card>
        <p className="p-4 text-center">Loading weekly summary...</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold p-4 pb-2 text-light-text dark:text-dark-text">
        Weekly Workout Minutes
      </h3>
      {chartData.some((d) => d.minutes > 0) ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="name"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              stroke="currentColor"
            />
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
              itemStyle={{ color: "#cbd5e1" }} /* text-slate-300 */
              cursor={{
                fill: "rgba(100, 116, 139, 0.2)",
              }} /* slate-500 with opacity */
            />
            {/* If you decide to use Legend, uncomment it and its import */}
            {/* <Legend /> */}
            <Bar
              dataKey="minutes"
              name="Workout Minutes"
              fill="url(#colorMinutes)"
            >
              {chartData.map((entry, index) => (
                <motion.rect
                  key={`bar-${index}`}
                  x={undefined} // Recharts handles position
                  y={undefined}
                  width={undefined}
                  height={undefined}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                  }}
                />
              ))}
            </Bar>
            {/* Gradient definition */}
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary, #3B82F6)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary, #3B82F6)"
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="p-4 pt-0 text-center text-light-secondary dark:text-dark-secondary">
          No workout data for this week.
        </p>
      )}
    </Card>
  );
};

export default WeeklySummaryWidget;
