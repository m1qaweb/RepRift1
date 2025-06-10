import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useWorkout } from "../../contexts/WorkoutContext";
import { format, subDays, parseISO } from "date-fns";

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

const VolumeChart: React.FC = () => {
  const { workouts } = useWorkout();

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      subDays(new Date(), i)
    ).reverse();

    return last7Days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayName = format(day, "eee");

      const dailyVolume = workouts
        .filter((w) => format(parseISO(w.date), "yyyy-MM-dd") === dayStr)
        .reduce((acc, w) => acc + w.volume, 0);

      return {
        name: dayName,
        date: dayStr,
        volume: dailyVolume,
      };
    });
  }, [workouts]);

  return (
    <motion.div className="bg-brand-card rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-brand-text mb-4">
        Weekly Volume
      </h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis
              dataKey="name"
              stroke="rgba(255, 255, 255, 0.4)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.4)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value > 1000 ? `${Math.round(value / 1000)}k` : `${value}`
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            />
            <Bar
              dataKey="volume"
              fill="url(#colorVolume)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-primary)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-primary)"
              stopOpacity={0.2}
            />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default VolumeChart;
