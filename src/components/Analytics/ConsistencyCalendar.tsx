import React from "react";
import {
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  format,
  getDay,
  startOfWeek,
  differenceInCalendarDays,
} from "date-fns";
import Tooltip from "../UI/Tooltip";

interface ConsistencyCalendarProps {
  workoutData: { date: string; volume: number }[];
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ConsistencyCalendar: React.FC<ConsistencyCalendarProps> = ({
  workoutData,
}) => {
  const today = new Date();
  const yearStart = startOfYear(today);
  const yearEnd = endOfYear(today);
  const daysInYear = eachDayOfInterval({ start: yearStart, end: yearEnd });

  const workoutMap = new Map<string, number>();
  let maxVolume = 0;
  workoutData.forEach((d) => {
    const dateKey = format(new Date(d.date), "yyyy-MM-dd");
    const newVolume = (workoutMap.get(dateKey) || 0) + d.volume;
    workoutMap.set(dateKey, newVolume);
    if (newVolume > maxVolume) {
      maxVolume = newVolume;
    }
  });

  const getIntensityLevel = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const volume = workoutMap.get(dateKey) || 0;
    if (volume === 0) return 0;
    if (maxVolume === 0) return 1; // Avoid division by zero

    const percentage = volume / maxVolume;
    if (percentage > 0.75) return 4;
    if (percentage > 0.5) return 3;
    if (percentage > 0.25) return 2;
    return 1;
  };

  const intensityColors = [
    "bg-brand-secondary", // Level 0
    "bg-brand-primary/40", // Level 1
    "bg-brand-primary/60", // Level 2
    "bg-brand-primary/80", // Level 3
    "bg-brand-primary", // Level 4
  ];

  const firstDayOfMonth = (monthIndex: number) => {
    const day = new Date(today.getFullYear(), monthIndex, 1);
    const firstDayOfWeek = startOfWeek(day);
    return differenceInCalendarDays(day, firstDayOfWeek);
  };

  return (
    <div className="rounded-2xl bg-brand-card/30 p-4 border border-brand-border/10 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-brand-text">
          Workout Consistency
        </h3>
        <div className="flex items-center space-x-2 text-xs text-brand-text-muted">
          <span>Less</span>
          {intensityColors.map((color, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-sm ${color}`}
              style={{ opacity: i === 0 ? 0.3 : 1 }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="flex flex-col items-start overflow-x-auto p-2">
        <div className="grid grid-cols-53 grid-rows-7 grid-flow-col gap-1">
          {daysInYear.map((day, index) => {
            const intensityLevel = getIntensityLevel(day);
            const colorClass = intensityColors[intensityLevel];
            const volume = workoutMap.get(format(day, "yyyy-MM-dd")) || 0;

            const tooltipContent =
              volume > 0
                ? `${format(
                    day,
                    "d MMM, yyyy"
                  )} - ${volume.toLocaleString()} kg volume`
                : `${format(day, "d MMM, yyyy")} - No workout`;

            return (
              <Tooltip key={index} content={tooltipContent} position="top">
                <div
                  className={`w-3.5 h-3.5 rounded-sm ${colorClass}`}
                  style={{ opacity: intensityLevel === 0 ? 0.3 : 1 }}
                />
              </Tooltip>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-brand-text-muted mt-2 w-full pr-4">
          {MONTH_LABELS.map((month, i) => (
            <div
              key={month}
              style={{
                gridColumn: `${Math.floor(firstDayOfMonth(i) / 7) + i * 4 + 1}`,
              }}
            >
              {month}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsistencyCalendar;
