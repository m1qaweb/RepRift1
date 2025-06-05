// /src/components/Dashboard/BodyMetricsWidget.tsx (Using ScaleIcon for Weight)
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
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
  Payload,
} from "recharts/types/component/DefaultTooltipContent";
import Card from "../UI/Card";
import Spinner from "../UI/Spinner";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import {
  BodyMetric,
  fetchBodyMetrics,
  saveBodyMetric,
} from "../../utils/fakeApi";
import { formatDate, getISOStringFromDate } from "../../utils/dateUtils";
import { useAuth } from "../../contexts/AuthContext";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  PlusCircleIcon,
  ChartPieIcon, // Kept for BMI for now
  ScaleIcon, // <<< IMPORTED ScaleIcon for Weight
} from "@heroicons/react/24/solid";

interface BodyMetricsChartData {
  date: string;
  fullDate: Date;
  weight?: number;
  bmi?: number;
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

const MetricInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  unit?: string;
  placeholder?: string;
  autoFocus?: boolean;
}> = ({
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
    <label
      htmlFor={id}
      className="block text-xs font-medium text-brand-text-muted mb-1"
    >
      {label}
    </label>
    <div className="relative">
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
      />
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-text-muted">
          {unit}
        </span>
      )}
    </div>
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

const BodyMetricsWidget: React.FC = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<BodyMetricsChartData[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<{
    weight?: number;
    bmi?: number;
    date?: string;
  }>({});
  const [trends, setTrends] = useState<{
    weight?: number;
    bmi?: number;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isSavingMetric, setIsSavingMetric] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddWeight, setQuickAddWeight] = useState("");

  const userHeightCm = user?.heightCm;
  const userWeightGoalKg = user?.goals?.weightKg;

  const processMetricsData = useCallback(
    (metrics: BodyMetric[]) => {
      if (metrics.length === 0) {
        setChartData([]);
        setLatestMetrics({});
        setTrends({});
        const todayISO = getISOStringFromDate(new Date());
        const hasTodayMetric = metrics.some((m) => m.date === todayISO);
        setShowQuickAdd(!hasTodayMetric);
        return;
      }
      setShowQuickAdd(false);

      const sortedMetrics = [...metrics].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const dataForChart = sortedMetrics.map((m) => {
        const bmi = m.bmi ?? calculateBMI(m.weightKg, userHeightCm);
        return {
          date: formatDate(m.date, "MMM d"),
          fullDate: new Date(m.date),
          weight: m.weightKg,
          bmi,
        };
      });
      setChartData(dataForChart);

      const lastApiMetric = sortedMetrics[sortedMetrics.length - 1];
      const lastBmi =
        lastApiMetric.bmi ?? calculateBMI(lastApiMetric.weightKg, userHeightCm);
      setLatestMetrics({
        weight: lastApiMetric.weightKg,
        bmi: lastBmi,
        date: formatDate(lastApiMetric.date, "MMM d, ''yy"),
      });

      if (sortedMetrics.length > 1) {
        const secondLastApiMetric = sortedMetrics[sortedMetrics.length - 2];
        const secondLastBmi =
          secondLastApiMetric.bmi ??
          calculateBMI(secondLastApiMetric.weightKg, userHeightCm);
        setTrends({
          weight:
            lastApiMetric.weightKg && secondLastApiMetric.weightKg
              ? parseFloat(
                  (
                    lastApiMetric.weightKg - secondLastApiMetric.weightKg
                  ).toFixed(1)
                )
              : undefined,
          bmi:
            lastBmi && secondLastBmi
              ? parseFloat((lastBmi - secondLastBmi).toFixed(1))
              : undefined,
        });
      } else {
        setTrends({});
      }
    },
    [userHeightCm]
  );

  const loadMetrics = useCallback(() => {
    setIsLoading(true);
    fetchBodyMetrics(user?.id)
      .then(processMetricsData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user?.id, processMetricsData]);

  useEffect(loadMetrics, [loadMetrics]);

  const handleLogMetric = async (weight: string) => {
    if (!weight) return;
    setIsSavingMetric(true);
    const todayISO = getISOStringFromDate(new Date());
    const metricToSave: BodyMetric & { userId?: string } = {
      date: todayISO,
      userId: user?.id,
    };
    if (weight) metricToSave.weightKg = parseFloat(weight);
    if (userHeightCm && metricToSave.weightKg) {
      metricToSave.bmi = calculateBMI(metricToSave.weightKg, userHeightCm);
    }
    try {
      await saveBodyMetric(metricToSave);
      setNewWeight("");
      setQuickAddWeight("");
      setIsLogModalOpen(false);
      loadMetrics();
    } catch (error) {
      console.error("Failed to save new metric:", error);
    } finally {
      setIsSavingMetric(false);
    }
  };

  const renderTrend = (
    value?: number,
    unit: string = "",
    precision: number = 1,
    labelSuffix: string = ""
  ) => {
    if (value === undefined)
      return <span className="ml-2 text-xs text-brand-text-muted/70">-</span>;
    if (value === 0)
      return <span className="ml-2 text-xs text-brand-text-muted/70">NC</span>;
    const isPositive = value > 0;
    const TrendIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    const colorClass = isPositive ? "text-success" : "text-error";
    return (
      <motion.div
        key={`${value}-${unit}-${labelSuffix}`}
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`ml-1.5 flex items-center text-xs font-semibold ${colorClass} bg-current/10 px-2 py-1 rounded-md`}
      >
        <TrendIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
        <span className="leading-none">
          {isPositive && "+"}
          {Math.abs(value).toFixed(precision)}
          {unit && <span className="ml-0.5 opacity-80">{unit}</span>}
          {labelSuffix && (
            <span className="ml-0.5 opacity-80">{labelSuffix}</span>
          )}
        </span>
      </motion.div>
    );
  };

  const AnimatedStat: React.FC<{
    value?: number;
    unit?: string;
    precision?: number;
    className?: string;
  }> = ({ value, unit, precision = 1, className = "" }) => {
    if (value === undefined)
      return (
        <span
          className={`text-3xl font-bold text-brand-text-muted/80 ${className}`}
        >
          --
        </span>
      );
    return (
      <motion.div
        key={value}
        initial={{ opacity: 0.5, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className={`flex items-baseline ${className}`}
      >
        <strong className={`text-3xl font-bold text-brand-text tabular-nums`}>
          {value.toFixed(precision)}
        </strong>
        {unit && (
          <span className="text-sm font-medium text-brand-text-muted/90 ml-1">
            {unit}
          </span>
        )}
      </motion.div>
    );
  };

  const LatestMetricDisplay: React.FC<{
    label: string;
    Icon: React.ElementType;
    value?: number;
    unit?: string;
    trendValue?: number;
    className?: string;
  }> = ({ label, Icon, value, unit, trendValue, className }) => (
    <motion.div
      className={`flex flex-col p-3.5 rounded-xl bg-brand-card/60 dark:bg-brand-card/40 shadow-md flex-1 min-w-[120px] ${className}`}
      variants={statCardAnimation}
    >
      <div className="flex items-center text-xs text-brand-text-muted mb-1">
        <Icon className="w-4 h-4 mr-1.5 opacity-80" /> {label}
      </div>
      <div className="flex items-baseline mt-0.5">
        <AnimatedStat value={value} unit={unit} />
        {renderTrend(trendValue, unit)}
      </div>
    </motion.div>
  );

  const cardBaseClasses =
    "bg-brand-card/70 dark:bg-brand-card/60 backdrop-blur-xl border border-brand-border/10 shadow-xl rounded-xl";

  if (isLoading && chartData.length === 0) {
    return (
      <Card
        className={`flex items-center justify-center min-h-[360px] ${cardBaseClasses}`}
      >
        <Spinner size="lg" />
        <p className="ml-3 text-brand-text-muted">Crunching numbers...</p>
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
              Body Metrics
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogModalOpen(true)}
              leftIcon={<PlusCircleIcon className="h-4 w-4" />}
              className="!py-1.5 !px-3 text-xs"
            >
              Log Metrics
            </Button>
          </div>

          {isLoading && chartData.length > 0 && (
            <div className="absolute inset-0 bg-brand-card/30 backdrop-blur-sm z-10 flex items-center justify-center">
              <Spinner />
            </div>
          )}

          <AnimatePresence mode="popLayout">
            <motion.div
              key="latest-metrics-grid"
              layout
              className="grid grid-cols-2 gap-3 sm:gap-4 mb-5"
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.07 } } }}
            >
              <LatestMetricDisplay
                label="Weight"
                Icon={ScaleIcon}
                value={latestMetrics.weight}
                unit="kg"
                trendValue={trends.weight}
              />{" "}
              {/* MODIFIED ICON */}
              <LatestMetricDisplay
                label="BMI"
                Icon={ChartPieIcon}
                value={latestMetrics.bmi}
                trendValue={trends.bmi}
              />
            </motion.div>
          </AnimatePresence>
          {latestMetrics.date && (
            <p className="text-center text-[0.7rem] text-brand-text-muted/70 -mt-2 mb-3">
              Last logged: {latestMetrics.date}
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {chartData.length > 0 ? (
            <motion.div
              key="chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative min-h-[280px]"
            >
              <ResponsiveContainer width="100%" height={280}>
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
                      <stop
                        offset="5%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient id="colorBmi" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-accent)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-accent)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgb(var(--color-border-rgb) / 0.1)"
                  />
                  <XAxis
                    dataKey="date"
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: "rgb(var(--color-border-rgb)/0.3)" }}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    yAxisId="weight"
                    orientation="left"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={["dataMin - 3", "dataMax + 3"]}
                    tickFormatter={(v) => `${v}kg`}
                    stroke="var(--color-primary)"
                  />
                  {chartData.some((d) => d.bmi) && (
                    <YAxis
                      yAxisId="bmi"
                      orientation="right"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      domain={["auto", "auto"]}
                      tickFormatter={(v) => `${v.toFixed(1)}`}
                      stroke="var(--color-accent)"
                    />
                  )}

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: "rgb(var(--color-primary-rgb)/0.3)",
                      strokeWidth: 1,
                      strokeDasharray: "3 3",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={30}
                    iconSize={10}
                    wrapperStyle={{
                      fontSize: "11px",
                      paddingTop: "0px",
                      paddingBottom: "5px",
                    }}
                  />

                  <Line
                    yAxisId="weight"
                    type="natural"
                    dataKey="weight"
                    name="Weight"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    dot={{ r: 0, strokeWidth: 0, fill: "var(--color-primary)" }}
                    activeDot={{
                      r: 5,
                      stroke: "var(--color-card)",
                      strokeWidth: 2,
                      fill: "var(--color-primary)",
                    }}
                    connectNulls
                  />
                  <Area
                    yAxisId="weight"
                    type="natural"
                    dataKey="weight"
                    strokeWidth={0}
                    fill="url(#colorWeight)"
                    connectNulls
                  />

                  {chartData.some((d) => d.bmi) && (
                    <>
                      <Line
                        yAxisId="bmi"
                        type="natural"
                        dataKey="bmi"
                        name="BMI"
                        stroke="var(--color-accent)"
                        strokeWidth={2.5}
                        dot={{
                          r: 0,
                          strokeWidth: 0,
                          fill: "var(--color-accent)",
                        }}
                        activeDot={{
                          r: 5,
                          stroke: "var(--color-card)",
                          strokeWidth: 2,
                          fill: "var(--color-accent)",
                        }}
                        connectNulls
                      />
                      <Area
                        yAxisId="bmi"
                        type="natural"
                        dataKey="bmi"
                        strokeWidth={0}
                        fill="url(#colorBmi)"
                        connectNulls
                      />
                    </>
                  )}
                  {userWeightGoalKg && (
                    <ReferenceLine
                      yAxisId="weight"
                      y={userWeightGoalKg}
                      label={{
                        value: `Goal: ${userWeightGoalKg}kg`,
                        position: "insideTopRight",
                        fill: "var(--color-success)",
                        fontSize: 10,
                      }}
                      stroke="var(--color-success)"
                      strokeDasharray="4 4"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            !isLoading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
                className="min-h-[280px] flex items-center justify-center"
              >
                <div className="text-center py-10 sm:py-12">
                  {/* Using ScaleIcon for empty state related to metrics as well */}
                  <ScaleIcon className="h-20 w-20 mx-auto text-brand-primary/10 mb-4" />
                  <h3 className="text-lg font-semibold text-brand-text mb-2">
                    No Metrics Yet
                  </h3>
                  <p className="text-sm text-brand-text-muted max-w-xs mx-auto mb-5">
                    Log your weight to start seeing your progress.
                  </p>
                  {!userHeightCm && (
                    <p className="text-xs text-brand-primary bg-brand-primary/10 p-2 rounded-md mb-4">
                      Pro Tip: Add your height in{" "}
                      <Link
                        to="/profile"
                        className="font-semibold hover:underline"
                      >
                        your profile
                      </Link>{" "}
                      for BMI tracking!
                    </p>
                  )}
                  {showQuickAdd && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-end gap-2 justify-center"
                    >
                      <MetricInput
                        id="quickAddWeight"
                        label="Today's Weight"
                        value={quickAddWeight}
                        onChange={(e) => setQuickAddWeight(e.target.value)}
                        unit="kg"
                        placeholder="e.g., 75"
                        autoFocus
                      />
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleLogMetric(quickAddWeight)}
                        isLoading={isSavingMetric}
                        disabled={!quickAddWeight || isSavingMetric}
                      >
                        Save
                      </Button>
                    </motion.div>
                  )}
                  {!showQuickAdd && chartData.length === 0 && (
                    <Button
                      variant="secondary"
                      onClick={() => setIsLogModalOpen(true)}
                      leftIcon={<PlusCircleIcon className="h-5 w-5" />}
                    >
                      Log First Metric
                    </Button>
                  )}
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>

      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log New Body Metrics"
        size="md"
        hideDefaultFooter
        customFooter={
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsLogModalOpen(false)}
              disabled={isSavingMetric}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleLogMetric(newWeight)}
              isLoading={isSavingMetric}
              disabled={isSavingMetric || !newWeight}
            >
              Save Metrics
            </Button>
          </div>
        }
        preventCloseOnBackdropClick
        panelClassName="dark:bg-[rgb(var(--color-card-rgb)/0.9)]"
      >
        <div className="space-y-5 p-1">
          <p className="text-sm text-brand-text-muted">
            Log your current weight. BMI is calculated if height is set in your
            profile.
          </p>
          <MetricInput
            id="newWeight"
            label="Current Weight"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            unit="kg"
            placeholder="e.g., 75.5"
            autoFocus
          />
          {!userHeightCm && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-brand-primary/90 text-center p-2.5 bg-brand-primary/10 rounded-lg mt-3"
            >
              Don't forget to add your height in your{" "}
              <Link
                to="/profile"
                className="font-bold hover:underline"
                onClick={() => setIsLogModalOpen(false)}
              >
                Account Profile
              </Link>{" "}
              to enable automatic BMI calculations.
            </motion.p>
          )}
        </div>
      </Modal>
    </>
  );
};

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-brand-card shadow-xl rounded-lg border border-brand-border/30 text-xs backdrop-blur-sm min-w-[150px]">
        <p className="label font-semibold text-brand-text mb-1.5">
          {label ? `Date: ${label}` : "Current"}
        </p>
        {payload.map((entry: Payload<ValueType, NameType>, index: number) => {
          const entryName =
            entry.name ||
            (typeof entry.dataKey === "string"
              ? entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1)
              : "Value");
          if (entryName !== "Weight" && entryName !== "BMI") return null;
          const unitSuffix = entryName === "Weight" ? "kg" : "";
          const valueString =
            entry.value !== undefined && entry.value !== null
              ? (entry.value as number).toFixed(1)
              : "N/A";
          if (entry.value === undefined || entry.value === null) return null;
          return (
            <p
              key={`item-${index}`}
              style={{ color: entry.color }}
              className="font-medium flex justify-between"
            >
              <span>{entryName}:</span>
              <span className="ml-2 tabular-nums">{`${valueString}${unitSuffix}`}</span>
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default BodyMetricsWidget;
