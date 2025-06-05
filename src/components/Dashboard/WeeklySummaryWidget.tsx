// /src/components/Dashboard/WeeklySummaryWidget.tsx (Corrected)
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "../UI/Card";
import Spinner from "../UI/Spinner";
import { fetchWorkoutLogs, WorkoutLog } from "../../utils/fakeApi";
import { getWeekDates, formatDate } from "../../utils/dateUtils";

interface WeeklySummaryData {
  name: string;
  date: Date;
  minutes: number;
}

const WeeklySummaryWidget: React.FC = () => {
  const [chartData, setChartData] = useState<WeeklySummaryData[]>([]);
  const [totalWeeklyMinutes, setTotalWeeklyMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

  useEffect(() => {
    const weekDates = getWeekDates(new Date(), 1);

    const initialData: WeeklySummaryData[] = weekDates.map((date) => ({
      name: formatDate(date, "E"),
      date: date,
      minutes: 0,
    }));

    fetchWorkoutLogs()
      .then((logs: WorkoutLog[]) => {
        let currentWeekTotal = 0;
        const processedData = initialData.map((dayData) => {
          const logsForDay = logs.filter(
            (log) =>
              new Date(log.date).toDateString() === dayData.date.toDateString()
          );
          const totalMinutesForDay = logsForDay.reduce(
            (sum, log) => sum + (log.durationMinutes || 0),
            0
          );
          currentWeekTotal += totalMinutesForDay;
          return { ...dayData, minutes: totalMinutesForDay };
        });
        setChartData(processedData);
        setTotalWeeklyMinutes(currentWeekTotal);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <Spinner size="md" />
        <p className="ml-2 text-brand-text-muted">Loading weekly summary...</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base sm:text-lg font-semibold text-brand-text">
            Weekly Activity
          </h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-brand-primary mb-3">
          {totalWeeklyMinutes}{" "}
          <span className="text-sm font-medium text-brand-text-muted">
            total minutes
          </span>
        </p>
      </div>

      {chartData.some((d) => d.minutes > 0) ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 5, left: -25, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgb(var(--color-border) / 0.2)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "rgb(var(--color-primary-rgb) / 0.1)" }}
              formatter={(value: number) => [`${value} minutes`, "Activity"]}
            />
            <Bar
              dataKey="minutes"
              radius={[4, 4, 0, 0]}
              onMouseEnter={(data, index) => setActiveBarIndex(index)}
              onMouseLeave={() => setActiveBarIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    activeBarIndex === index
                      ? "var(--color-accent)"
                      : "var(--color-primary)"
                  }
                  className="transition-fill duration-150"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="p-4 pt-0 text-center text-brand-text-muted min-h-[150px] flex items-center justify-center">
          No workout data recorded for this week yet.
        </div>
      )}
    </Card>
  );
};

export default WeeklySummaryWidget;
