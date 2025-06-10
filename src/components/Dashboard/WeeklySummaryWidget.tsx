// /src/components/Dashboard/WeeklySummaryWidget.tsx (Corrected)
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "../UI/Card";
import { useWorkout } from "../../contexts/WorkoutContext";
import { format, subDays, parseISO, isThisWeek } from "date-fns";
import { motion } from "framer-motion";

interface WeeklySummaryData {
  name: string;
  volume: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-card/80 backdrop-blur-sm p-2 border border-brand-border rounded-lg shadow-lg">
        <p className="label text-brand-text-muted">{`${label}`}</p>
        <p className="intro text-brand-text">{`Volume: ${payload[0].value.toLocaleString()} kg`}</p>
      </div>
    );
  }
  return null;
};

const StatDisplay: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm text-brand-text-muted">{label}</p>
    <p className="text-xl font-bold text-brand-text">{value}</p>
  </div>
);

const WeeklySummaryWidget: React.FC = () => {
  const { workouts } = useWorkout();
  const [activeBarIndex, setActiveBarIndex] = React.useState<number | null>(
    null
  );

  const { chartData, totalWeeklyVolume, weeklyWorkoutCount, avgDuration } =
    useMemo(() => {
      const weekDates = Array.from({ length: 7 }, (_, i) =>
        subDays(new Date(), i)
      ).reverse();

      const thisWeeksWorkouts = workouts.filter((w) =>
        isThisWeek(parseISO(w.date), { weekStartsOn: 1 })
      );

      const totalWeeklyVolume = thisWeeksWorkouts.reduce(
        (sum, w) => sum + w.volume,
        0
      );
      const weeklyWorkoutCount = thisWeeksWorkouts.length;
      const totalMinutes = thisWeeksWorkouts.reduce(
        (sum, w) => sum + w.duration,
        0
      );
      const avgDuration =
        weeklyWorkoutCount > 0
          ? Math.round(totalMinutes / weeklyWorkoutCount)
          : 0;

      const dailyData = weekDates.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayName = format(day, "eee");
        const dailyVolume = workouts
          .filter((w) => format(parseISO(w.date), "yyyy-MM-dd") === dayStr)
          .reduce((acc, w) => acc + w.volume, 0);
        return { name: dayName, volume: dailyVolume };
      });

      return {
        chartData: dailyData,
        totalWeeklyVolume,
        weeklyWorkoutCount,
        avgDuration,
      };
    }, [workouts]);

  return (
    <Card>
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-4">
          Weekly Summary
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <StatDisplay
            label="Total Volume"
            value={`${(totalWeeklyVolume / 1000).toFixed(1)}k kg`}
          />
          <StatDisplay label="Workouts" value={weeklyWorkoutCount} />
          <StatDisplay label="Avg. Duration" value={`${avgDuration} min`} />
        </div>
      </div>

      <div className="px-2">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            barCategoryGap="30%"
            onMouseLeave={() => setActiveBarIndex(null)}
          >
            <XAxis
              dataKey="name"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              stroke="var(--color-text-muted)"
            />
            <YAxis
              fontSize={10}
              tickLine={false}
              axisLine={false}
              stroke="var(--color-text-muted)"
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgb(var(--color-primary-rgb) / 0.1)" }}
            />
            <Bar
              dataKey="volume"
              onMouseEnter={(_, index) => setActiveBarIndex(index)}
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((_entry, index) => (
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
      </div>
    </Card>
  );
};

export default WeeklySummaryWidget;
