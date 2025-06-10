import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDaysInMonth, startOfMonth, getDay, format } from "date-fns";
import { formatDate as formatDateUtil } from "../../utils/dateUtils";
import { WorkoutLog } from "../../types/data";

import Card from "../UI/Card";
import Spinner from "../UI/Spinner";
import Button from "../UI/Button";
import { Tooltip } from "react-tooltip";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasWorkout: boolean;
  workoutLog?: WorkoutLog;
}

interface CalendarProps {
  workoutLogs: WorkoutLog[];
  currentMonthDate: Date;
  onMonthChange: (direction: "prev" | "next") => void;
  onDayClick: (day: CalendarDay) => void;
  isLoading: boolean;
  monthChangeDirection: number;
}

const calendarVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 50 : -50,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? 50 : -50,
  }),
};

const Calendar: React.FC<CalendarProps> = ({
  workoutLogs,
  currentMonthDate,
  onMonthChange,
  onDayClick,
  isLoading,
  monthChangeDirection,
}) => {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonthDate);
    const daysInMonthValue = getDaysInMonth(currentMonthDate);
    const firstDayOfMonthWeekDay = getDay(monthStart);

    const daysArray: CalendarDay[] = [];

    for (let i = 0; i < firstDayOfMonthWeekDay; i++) {
      daysArray.push({
        date: new Date(
          monthStart.getFullYear(),
          monthStart.getMonth(),
          i - firstDayOfMonthWeekDay + 1
        ),
        isCurrentMonth: false,
        isToday: false,
        hasWorkout: false,
      });
    }

    for (let i = 1; i <= daysInMonthValue; i++) {
      const currentDateVal = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth(),
        i
      );
      const logForDay = workoutLogs.find(
        (log) =>
          formatDateUtil(log.date, "yyyy-MM-dd") ===
          formatDateUtil(currentDateVal, "yyyy-MM-dd")
      );
      daysArray.push({
        date: currentDateVal,
        isCurrentMonth: true,
        isToday:
          formatDateUtil(currentDateVal, "yyyy-MM-dd") ===
          formatDateUtil(new Date(), "yyyy-MM-dd"),
        hasWorkout: !!logForDay,
        workoutLog: logForDay,
      });
    }

    const totalDaysShown = daysArray.length;
    const remainingCells =
      totalDaysShown <= 35 ? 35 - totalDaysShown : 42 - totalDaysShown;
    for (let i = 1; i <= remainingCells; i++) {
      daysArray.push({
        date: new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, i),
        isCurrentMonth: false,
        isToday: false,
        hasWorkout: false,
      });
    }

    return daysArray;
  }, [currentMonthDate, workoutLogs]);

  return (
    <Card className="p-4 sm:p-6 bg-brand-card/60 backdrop-blur-sm border border-white/10 min-h-[580px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-brand-text tracking-tight">
          {format(currentMonthDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMonthChange("prev")}
            aria-label="Previous month"
            disabled={isLoading}
            className="!p-2"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMonthChange("next")}
            aria-label="Next month"
            disabled={isLoading}
            className="!p-2"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (dayName) => (
                <div
                  key={dayName}
                  className="text-center font-semibold text-xs sm:text-sm text-brand-text-muted py-2"
                >
                  {dayName.substring(0, 3)}
                </div>
              )
            )}
          </div>
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={monthChangeDirection}>
              <motion.div
                key={currentMonthDate.toISOString()}
                className="grid grid-cols-7 gap-1 md:gap-2"
                variants={calendarVariants}
                custom={monthChangeDirection}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                {calendarDays.map((day, index) => {
                  const hasWorkout = day.hasWorkout && day.isCurrentMonth;
                  const tooltipId = `day-tooltip-${index}`;
                  return (
                    <motion.div
                      key={index}
                      onClick={() => day.isCurrentMonth && onDayClick(day)}
                      className={`relative aspect-[4/5] sm:aspect-square flex items-center justify-center rounded-lg transition-all duration-300 group
                      ${!day.isCurrentMonth && "text-brand-text-muted/30"}
                      ${
                        hasWorkout
                          ? "bg-brand-primary text-brand-primary-content font-bold shadow-lg shadow-brand-primary/20 cursor-pointer"
                          : "bg-brand-background/30 hover:bg-brand-background/60"
                      }
                      ${
                        day.isToday &&
                        !hasWorkout &&
                        "ring-2 ring-brand-primary ring-offset-2 ring-offset-brand-background"
                      }
                    `}
                      whileHover={day.isCurrentMonth ? { y: -4 } : {}}
                      data-tooltip-id={hasWorkout ? tooltipId : undefined}
                    >
                      {hasWorkout && day.workoutLog && (
                        <Tooltip
                          id={tooltipId}
                          place="top"
                          className="z-20 !bg-brand-card !text-brand-text !rounded-lg !p-2 !shadow-lg border !border-brand-border"
                          render={() =>
                            day.workoutLog ? (
                              <div className="text-sm">
                                <p className="font-bold text-brand-primary">
                                  {day.workoutLog.programTitle}
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <ClockIcon className="h-4 w-4" />{" "}
                                  {day.workoutLog.durationMinutes} min
                                </p>
                              </div>
                            ) : null
                          }
                        />
                      )}
                      <span className="relative z-10 text-sm">
                        {format(day.date, "d")}
                      </span>
                      {hasWorkout && (
                        <SparklesIcon className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-brand-primary-content/50 group-hover:text-brand-primary-content transition-colors" />
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </Card>
  );
};

export default Calendar;
