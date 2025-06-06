// /src/components/widgets/BodyMetricsWidget.tsx (Corrected with Straight Line Chart)

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

import Card from "../UI/Card";
import Spinner from "../UI/Spinner";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import { BodyMetric, fetchBodyMetrics, saveBodyMetric } from "../../utils/API";
import {
  formatDate,
  getISOStringFromDate,
  parseTimestamp,
} from "../../utils/dateUtils";
import { useAuth } from "../../contexts/AuthContext";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PlusCircleIcon,
  ChartPieIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

interface BodyMetricsChartData {
  date: string;
  fullDate: Date;
  weight?: number;
  bmi?: number;
  weightChange?: number;
  bmiChange?: number;
}

const calculateBMI = (
  weightKg?: number,
  heightCm?: number
): number | undefined => {
  if (weightKg && heightCm && heightCm > 0) {
    const heightM = heightCm / 100;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  }
  return undefined;
};

// --- Reusable Sub-components (omitted for brevity, they remain the same) ---
const MetricInput: React.FC<any> = ({
  id,
  label,
  value,
  onChange,
  type = "number",
  unit,
  placeholder,
  autoFocus,
}) => (
  <div className="flex-1">
    {" "}
    <label
      htmlFor={id}
      className="block text-xs font-medium text-brand-text-muted mb-1"
    >
      {" "}
      {label}{" "}
    </label>{" "}
    <div className="relative">
      {" "}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full px-3 py-2.5 border border-brand-border rounded-lg bg-brand-background text-brand-text focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm shadow-sm"
        step={type === "number" ? "0.1" : undefined}
      />{" "}
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-text-muted">
          {unit}
        </span>
      )}{" "}
    </div>{" "}
  </div>
);
const statCardAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 150, damping: 20 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};
const pageSectionVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.1, type: "spring", stiffness: 100, damping: 20 },
  },
};

// --- Main Widget Component ---

const BodyMetricsWidget: React.FC = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<BodyMetricsChartData[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<{
    weight?: number;
    bmi?: number;
    date?: string;
  }>({});
  const [trends, setTrends] = useState<{ weight?: number; bmi?: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSavingMetric, setIsSavingMetric] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  const userHeightCm = user?.heightCm;
  const userWeightGoalKg = user?.goals?.weightKg;

  const processMetricsData = useCallback(
    (metrics: BodyMetric[]) => {
      if (metrics.length === 0) {
        setChartData([]);
        setLatestMetrics({});
        setTrends({});
        return;
      }
      const sortedMetrics = [...metrics].sort(
        (a, b) =>
          parseTimestamp(a.date).getTime() - parseTimestamp(b.date).getTime()
      );
      const dataForChart: BodyMetricsChartData[] = sortedMetrics.map(
        (m, index) => {
          const bmi = m.bmi ?? calculateBMI(m.weightKg, userHeightCm);
          let weightChange, bmiChange;
          if (index > 0) {
            const prevMetric = sortedMetrics[index - 1];
            const prevBmi =
              prevMetric.bmi ?? calculateBMI(prevMetric.weightKg, userHeightCm);
            if (m.weightKg && prevMetric.weightKg) {
              weightChange = parseFloat(
                (m.weightKg - prevMetric.weightKg).toFixed(1)
              );
            }
            if (bmi && prevBmi) {
              bmiChange = parseFloat((bmi - prevBmi).toFixed(1));
            }
          }
          return {
            date: formatDate(m.date, "MMM d"),
            fullDate: parseTimestamp(m.date),
            weight: m.weightKg,
            bmi,
            weightChange,
            bmiChange,
          };
        }
      );
      setChartData(dataForChart);
      const lastPoint = dataForChart[dataForChart.length - 1];
      setLatestMetrics({
        weight: lastPoint.weight,
        bmi: lastPoint.bmi,
        date: formatDate(lastPoint.fullDate, "MMM d, yy"),
      });
      if (dataForChart.length > 1) {
        const secondLastPoint = dataForChart[dataForChart.length - 2];
        setTrends({
          weight:
            lastPoint.weight && secondLastPoint.weight
              ? parseFloat(
                  (lastPoint.weight - secondLastPoint.weight).toFixed(1)
                )
              : undefined,
          bmi:
            lastPoint.bmi && secondLastPoint.bmi
              ? parseFloat((lastPoint.bmi - secondLastPoint.bmi).toFixed(1))
              : undefined,
        });
      } else {
        setTrends({});
      }
    },
    [userHeightCm]
  );

  const loadMetrics = useCallback(() => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    fetchBodyMetrics(user.id)
      .then(processMetricsData)
      .catch((err) => {
        console.error("Failed to fetch body metrics:", err);
        setError("Could not load metrics data.");
      })
      .finally(() => setIsLoading(false));
  }, [user, processMetricsData]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  const handleLogMetric = async (weight: string) => {
    if (!user || !weight) return;
    setIsSavingMetric(true);
    const todayISO = getISOStringFromDate(new Date());
    const metricToSave: Partial<BodyMetric> = {
      date: todayISO,
      userId: user.id,
      weightKg: parseFloat(weight),
    };
    if (userHeightCm && metricToSave.weightKg) {
      metricToSave.bmi = calculateBMI(metricToSave.weightKg, userHeightCm);
    }
    try {
      await saveBodyMetric(metricToSave);
      setNewWeight("");
      setIsLogModalOpen(false);
      loadMetrics();
    } catch (error) {
      console.error("Failed to save new metric:", error);
    } finally {
      setIsSavingMetric(false);
    }
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogMetric(newWeight);
  };

  const renderTrend = (value?: number, unit: string = "") => {
    if (value === undefined)
      return <span className="ml-2 text-xs text-brand-text-muted/70">-</span>;
    if (value === 0)
      return <span className="ml-2 text-xs text-brand-text-muted/70">NC</span>;
    const isPositive = value > 0;
    const TrendIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    const colorClass = isPositive ? "text-success" : "text-error";
    return (
      <motion.div
        key={`${value}-${unit}`}
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        className={`ml-1.5 flex items-center text-xs font-semibold ${colorClass} bg-current/10 px-2 py-1 rounded-md`}
      >
        {" "}
        <TrendIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />{" "}
        <span className="leading-none">
          {isPositive && "+"}
          {value.toFixed(1)}
          {unit}
        </span>{" "}
      </motion.div>
    );
  };

  const AnimatedStat: React.FC<{ value?: number; unit?: string }> = ({
    value,
    unit,
  }) => {
    if (value === undefined)
      return (
        <span className="text-3xl font-bold text-brand-text-muted/80">--</span>
      );
    return (
      <motion.div
        key={value}
        initial={{ y: -5, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex items-baseline"
      >
        {" "}
        <strong className="text-3xl font-bold text-brand-text tabular-nums">
          {value.toFixed(1)}
        </strong>{" "}
        {unit && (
          <span className="text-sm font-medium text-brand-text-muted/90 ml-1">
            {unit}
          </span>
        )}{" "}
      </motion.div>
    );
  };

  const LatestMetricDisplay: React.FC<{
    label: string;
    Icon: React.ElementType;
    value?: number;
    unit?: string;
    trendValue?: number;
  }> = ({ label, Icon, value, unit, trendValue }) => (
    <motion.div
      className="flex flex-col p-3.5 rounded-xl bg-brand-card/60 dark:bg-brand-card/40 shadow-md flex-1 min-w-[120px]"
      variants={statCardAnimation}
    >
      {" "}
      <div className="flex items-center text-xs text-brand-text-muted mb-1">
        {" "}
        <Icon className="w-4 h-4 mr-1.5 opacity-80" /> {label}{" "}
      </div>{" "}
      <div className="flex items-baseline mt-0.5">
        {" "}
        <AnimatedStat value={value} unit={unit} />{" "}
        {renderTrend(trendValue, unit)}{" "}
      </div>{" "}
    </motion.div>
  );

  const cardBaseClasses =
    "bg-brand-card/70 dark:bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 shadow-xl rounded-xl";
  const hasBmiData = chartData.some((d) => d.bmi !== undefined);

  if (isLoading && chartData.length === 0) {
    return (
      <Card
        className={`flex items-center justify-center min-h-[360px] ${cardBaseClasses}`}
      >
        {" "}
        <Spinner size="lg" />{" "}
        <p className="ml-3 text-brand-text-muted">Crunching numbers...</p>{" "}
      </Card>
    );
  }
  if (error) {
    return (
      <Card
        className={`flex flex-col items-center justify-center min-h-[360px] text-error p-4 ${cardBaseClasses}`}
      >
        {" "}
        <ExclamationTriangleIcon className="h-12 w-12 mb-3" />{" "}
        <h4 className="font-semibold mb-1">Error</h4>{" "}
        <p className="text-sm text-center">{error}</p>{" "}
      </Card>
    );
  }

  return (
    <>
      <motion.div
        className={`overflow-hidden ${cardBaseClasses}`}
        variants={pageSectionVariants}
        initial="initial"
        animate="animate"
      >
        <div className="p-4 sm:p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-brand-text">
              Body Progress
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogModalOpen(true)}
              leftIcon={<PlusCircleIcon className="h-4 w-4" />}
            >
              Log Metrics
            </Button>
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-brand-card/30 backdrop-blur-sm z-10 flex items-center justify-center">
              <Spinner />
            </div>
          )}
          {latestMetrics.date && (
            <>
              {" "}
              <AnimatePresence mode="popLayout">
                {" "}
                <motion.div
                  layout
                  key="stats"
                  initial="initial"
                  animate="animate"
                  variants={{
                    animate: { transition: { staggerChildren: 0.07 } },
                  }}
                  className="grid grid-cols-2 gap-3 sm:gap-4 mb-3"
                >
                  {" "}
                  <LatestMetricDisplay
                    label="Latest Weight"
                    Icon={ScaleIcon}
                    value={latestMetrics.weight}
                    unit="kg"
                    trendValue={trends.weight}
                  />{" "}
                  <LatestMetricDisplay
                    label="Latest BMI"
                    Icon={ChartPieIcon}
                    value={latestMetrics.bmi}
                    trendValue={trends.bmi}
                  />{" "}
                </motion.div>{" "}
              </AnimatePresence>{" "}
              <p className="text-center text-[0.7rem] text-brand-text-muted/70 -mt-1 mb-3">
                {" "}
                Last logged: {latestMetrics.date}{" "}
              </p>{" "}
            </>
          )}
        </div>
        <AnimatePresence mode="wait">
          {chartData.length > 0 ? (
            <motion.div
              key="chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="colorWeight"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      {" "}
                      <stop
                        offset="5%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.4}
                      />{" "}
                      <stop
                        offset="95%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0}
                      />{" "}
                    </linearGradient>
                    <linearGradient id="colorBmi" x1="0" y1="0" x2="0" y2="1">
                      {" "}
                      <stop
                        offset="5%"
                        stopColor="var(--color-accent)"
                        stopOpacity={0.4}
                      />{" "}
                      <stop
                        offset="95%"
                        stopColor="var(--color-accent)"
                        stopOpacity={0}
                      />{" "}
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="rgb(var(--color-border-rgb) / 0.1)"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis
                    yAxisId="weight"
                    orientation="left"
                    tick={{ fontSize: 11, fill: "var(--color-primary)" }}
                    tickMargin={5}
                    tickLine={false}
                    axisLine={false}
                    domain={["dataMin - 2", "dataMax + 4"]}
                    tickFormatter={(v) => `${v}kg`}
                  />
                  {hasBmiData && (
                    <YAxis
                      yAxisId="bmi"
                      orientation="right"
                      tick={{ fontSize: 11, fill: "var(--color-accent)" }}
                      tickMargin={5}
                      tickLine={false}
                      axisLine={false}
                      domain={["dataMin - 2", "dataMax + 2"]}
                      tickFormatter={(v) => v.toFixed(1)}
                    />
                  )}
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={<CustomCursor />}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconSize={10}
                    wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }}
                  />
                  {hasBmiData && (
                    <ReferenceArea
                      yAxisId="bmi"
                      y1={18.5}
                      y2={24.9}
                      strokeDasharray="3 3"
                      stroke="var(--color-success)"
                      strokeOpacity={0.6}
                      fill="var(--color-success)"
                      fillOpacity={0.07}
                    >
                      <Legend
                        payload={[
                          {
                            value: "Healthy BMI",
                            type: "line",
                            color: "var(--color-success-dim)",
                          },
                        ]}
                      />
                    </ReferenceArea>
                  )}
                  {userWeightGoalKg && (
                    <ReferenceLine
                      yAxisId="weight"
                      y={userWeightGoalKg}
                      label={{
                        value: `Goal`,
                        position: "insideTopRight",
                        fill: "var(--color-success)",
                        fontSize: 12,
                        dy: -5,
                      }}
                      stroke="var(--color-success)"
                      strokeDasharray="5 5"
                    />
                  )}

                  {/* ===== FIX: REMOVED `type="monotone"` TO GET STRAIGHT LINES ===== */}
                  <Line
                    yAxisId="weight"
                    dataKey="weight"
                    name="Weight"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{
                      r: 6,
                      stroke: "var(--color-card)",
                      strokeWidth: 2,
                      fill: "var(--color-primary)",
                    }}
                    connectNulls
                  />
                  {chartData.length > 1 && (
                    <Area
                      yAxisId="weight"
                      dataKey="weight"
                      fill="url(#colorWeight)"
                      connectNulls
                    />
                  )}
                  {hasBmiData && (
                    <>
                      <Line
                        yAxisId="bmi"
                        dataKey="bmi"
                        name="BMI"
                        stroke="var(--color-accent)"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                        activeDot={{
                          r: 6,
                          stroke: "var(--color-card)",
                          strokeWidth: 2,
                          fill: "var(--color-accent)",
                        }}
                        connectNulls
                      />
                      {chartData.length > 1 && (
                        <Area
                          yAxisId="bmi"
                          dataKey="bmi"
                          fill="url(#colorBmi)"
                          connectNulls
                        />
                      )}
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[280px] flex items-center justify-center"
            >
              <div className="text-center py-8 px-4">
                <ScaleIcon className="h-16 w-16 mx-auto text-brand-primary/10 mb-4" />
                <h3 className="text-lg font-semibold text-brand-text mb-2">
                  Log Your Weight
                </h3>
                <p className="text-sm text-brand-text-muted max-w-xs mx-auto mb-5">
                  Start tracking your progress by logging your first
                  measurement.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setIsLogModalOpen(true)}
                  leftIcon={<PlusCircleIcon className="h-5 w-5" />}
                >
                  Log First Metric
                </Button>
                {!userHeightCm && (
                  <p className="text-xs text-brand-primary bg-brand-primary/10 p-2 rounded-md mt-6">
                    {" "}
                    Tip: Add your height in{" "}
                    <Link
                      to="/profile"
                      className="font-semibold hover:underline"
                    >
                      your profile
                    </Link>{" "}
                    for automatic BMI tracking!{" "}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log New Body Metric"
        size="sm"
        customFooter={
          <div className="flex justify-end gap-3">
            {" "}
            <Button variant="ghost" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>{" "}
            <Button
              type="submit"
              form="log-metric-form"
              variant="primary"
              isLoading={isSavingMetric}
              disabled={isSavingMetric || !newWeight}
            >
              Save Metric
            </Button>{" "}
          </div>
        }
      >
        <form
          id="log-metric-form"
          onSubmit={handleLogSubmit}
          className="space-y-4 p-1"
        >
          <p className="text-sm text-brand-text-muted">
            Log your current weight. BMI is calculated automatically if your
            height is set.
          </p>
          <MetricInput
            id="newWeight"
            label="Current Weight"
            value={newWeight}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setNewWeight(e.target.value)}
            placeholder="e.g., 75.5"
            autoFocus
          />
        </form>
      </Modal>
    </>
  );
};

const CustomCursor: React.FC<any> = ({ points, height }) => {
  const { x } = points[0];
  return (
    <line
      x1={x}
      y1={0}
      x2={x}
      y2={height}
      stroke="rgb(var(--color-primary-rgb) / 0.5)"
      strokeWidth={1}
      strokeDasharray="5 5"
    />
  );
};
const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as BodyMetricsChartData;
    const renderChange = (value?: number) => {
      if (value === undefined || value === 0) return null;
      const isPositive = value > 0;
      const color = isPositive ? "var(--color-success)" : "var(--color-error)";
      return (
        <span style={{ color }} className="font-normal text-xs ml-2">
          ({isPositive ? "+" : ""}
          {value.toFixed(1)})
        </span>
      );
    };
    return (
      <div className="p-3 bg-brand-card/80 dark:bg-brand-card/90 backdrop-blur-md shadow-xl rounded-lg border border-brand-border/30 text-xs min-w-[180px]">
        {" "}
        <p className="label font-bold text-brand-text mb-2 text-sm">
          {formatDate(data.fullDate, "MMMM d, yyyy")}
        </p>{" "}
        {payload.map((entry) => (
          <div
            key={`item-${entry.name}`}
            style={{ color: entry.color }}
            className="font-semibold flex justify-between items-center my-1.5"
          >
            {" "}
            <span>{entry.name}:</span>{" "}
            <div className="flex items-baseline">
              {" "}
              <span className="ml-2 tabular-nums text-base">{`${(
                entry.value as number
              ).toFixed(1)}${entry.name === "Weight" ? "kg" : ""}`}</span>{" "}
              {renderChange(
                entry.name === "Weight" ? data.weightChange : data.bmiChange
              )}{" "}
            </div>{" "}
          </div>
        ))}{" "}
      </div>
    );
  }
  return null;
};

export default BodyMetricsWidget;
