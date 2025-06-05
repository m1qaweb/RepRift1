// /src/components/Dashboard/BodyMetricsWidget.tsx (Enhanced)
import React, { useEffect, useState } from "react";
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
import Spinner from "../UI/Spinner";
import { fetchBodyMetrics } from "../../utils/fakeApi";
import { formatDate } from "../../utils/dateUtils";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

interface BodyMetricsChartData {
  date: string;
  fullDate: Date;
  weight?: number;
  bmi?: number;
}

const BodyMetricsWidget: React.FC = () => {
  const [chartData, setChartData] = useState<BodyMetricsChartData[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<{
    weight?: number;
    bmi?: number;
  }>({});
  const [trends, setTrends] = useState<{ weight?: number; bmi?: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBodyMetrics()
      .then((metrics) => {
        if (metrics.length === 0) {
          setChartData([]);
          setIsLoading(false);
          return;
        }

        const sortedMetrics = metrics.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const data = sortedMetrics.map((m) => ({
          date: formatDate(m.date, "MMM d"),
          fullDate: new Date(m.date),
          weight: m.weightKg,
          bmi: m.bmi,
        }));
        setChartData(data);

        const lastMetric = sortedMetrics[sortedMetrics.length - 1];
        setLatestMetrics({ weight: lastMetric.weightKg, bmi: lastMetric.bmi });

        if (sortedMetrics.length > 1) {
          const secondLastMetric = sortedMetrics[sortedMetrics.length - 2];
          setTrends({
            weight:
              lastMetric.weightKg && secondLastMetric.weightKg
                ? lastMetric.weightKg - secondLastMetric.weightKg
                : undefined,
            bmi:
              lastMetric.bmi && secondLastMetric.bmi
                ? lastMetric.bmi - secondLastMetric.bmi
                : undefined,
          });
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const renderTrend = (value?: number, unit: string = "") => {
    if (value === undefined || value === 0)
      return <span className="text-xs text-brand-text-muted ml-1">-</span>;
    const isPositive = value > 0;
    const TrendIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    const colorClass = isPositive ? "text-success" : "text-error";
    return (
      <span
        className={`ml-2 text-xs font-medium flex items-center ${colorClass}`}
      >
        <TrendIcon className="h-3 w-3 mr-0.5" />
        {Math.abs(value).toFixed(1)}
        {unit}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[200px]">
        <Spinner size="md" />
        <p className="ml-2 text-brand-text-muted">Loading body metrics...</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-1">
          Body Metrics
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-text-muted mb-3">
          {latestMetrics.weight !== undefined && (
            <div className="flex items-baseline">
              Weight:{" "}
              <strong className="text-brand-text text-sm ml-1">
                {latestMetrics.weight.toFixed(1)}kg
              </strong>
              {renderTrend(trends.weight, "kg")}
            </div>
          )}
          {latestMetrics.bmi !== undefined && (
            <div className="flex items-baseline">
              BMI:{" "}
              <strong className="text-brand-text text-sm ml-1">
                {latestMetrics.bmi.toFixed(1)}
              </strong>
              {renderTrend(trends.bmi)}
            </div>
          )}
        </div>
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgb(var(--color-border-rgb) / 0.2)"
            />
            <XAxis
              dataKey="date"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "rgb(var(--color-border-rgb) / 0.5)" }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              yAxisId="weight"
              orientation="left"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "rgb(var(--color-border-rgb) / 0.5)" }}
              domain={["dataMin - 1", "dataMax + 1"]}
              tickFormatter={(value) => `${value}kg`}
              stroke="var(--color-primary)"
            />
            {chartData.some((d) => d.bmi !== undefined) && (
              <YAxis
                yAxisId="bmi"
                orientation="right"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "rgb(var(--color-border-rgb) / 0.5)" }}
                domain={["dataMin - 0.5", "dataMax + 0.5"]}
                tickFormatter={(value) => `${value.toFixed(1)}`}
                stroke="var(--color-accent)"
              />
            )}
            <Tooltip
              cursor={{
                stroke: "rgb(var(--color-primary-rgb) / 0.2)",
                strokeWidth: 1.5,
              }}
              formatter={(value: number, name: string) => {
                if (name === "Weight") return [`${value.toFixed(1)} kg`, name];
                if (name === "BMI") return [`${value.toFixed(1)}`, name];
                return [value, name];
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconSize={10}
              wrapperStyle={{ fontSize: "11px" }}
            />
            <Line
              yAxisId="weight"
              type="monotone"
              dataKey="weight"
              name="Weight"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-primary)", strokeWidth: 0 }}
              activeDot={{
                r: 5,
                stroke: "rgb(var(--color-card-rgb))",
                strokeWidth: 2,
              }}
              connectNulls
            />
            {chartData.some((d) => d.bmi !== undefined) && (
              <Line
                yAxisId="bmi"
                type="monotone"
                dataKey="bmi"
                name="BMI"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-accent)", strokeWidth: 0 }}
                activeDot={{
                  r: 5,
                  stroke: "rgb(var(--color-card-rgb))",
                  strokeWidth: 2,
                }}
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="p-4 pt-2 text-center text-brand-text-muted min-h-[150px] flex items-center justify-center">
          No body metrics data available to display chart.
        </div>
      )}
    </Card>
  );
};

export default BodyMetricsWidget;
