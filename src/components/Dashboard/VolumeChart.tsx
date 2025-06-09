import React from "react";
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

const data = [
  { name: "Mon", volume: 2400 },
  { name: "Tue", volume: 1398 },
  { name: "Wed", volume: 9800 },
  { name: "Thu", volume: 3908 },
  { name: "Fri", volume: 4800 },
  { name: "Sat", volume: 3800 },
  { name: "Sun", volume: 4300 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-card/80 backdrop-blur-sm p-2 border border-brand-border rounded-lg shadow-lg">
        <p className="label text-brand-text-muted">{`${label}`}</p>
        <p className="intro text-brand-text">{`Volume: ${payload[0].value} kg`}</p>
      </div>
    );
  }
  return null;
};

const VolumeChart: React.FC = () => {
  return (
    <motion.div className="bg-brand-card rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-brand-text mb-4">
        Weekly Volume
      </h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
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
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            />
            <Bar
              dataKey="volume"
              fill="url(#colorVolume)"
              radius={[4, 4, 0, 0]}
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
