// /src/pages/HistoryPage.tsx (UPGRADED FOR SUPABASE)

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// === CHANGE 1: Import from our new service layer ===
import { WorkoutLog } from "../types/data"; // The 'WorkoutLog' type is still useful
import { getWorkoutLogs } from "../services/workoutLogService"; // Import our new function
// === END CHANGE ===

import { getDaysInMonth, startOfMonth, getDay, format } from "date-fns";
import { formatDate as formatDateUtil } from "../utils/dateUtils";

import Modal from "../components/UI/Modal";
import Button from "../components/UI/Button";
import Spinner from "../components/UI/Spinner";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  FireIcon,
  ListBulletIcon,
  PencilIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Card from "../components/UI/Card";
import { Tooltip } from "react-tooltip";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasWorkout: boolean;
  workoutLog?: WorkoutLog;
}

const HistoryPage: React.FC = () => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [allWorkoutLogs, setAllWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [monthChangeDirection, setMonthChangeDirection] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const logs = await getWorkoutLogs();
        setAllWorkoutLogs(logs);
      } catch (err) {
        console.error("Failed to load workout history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const generateCalendarDays = useCallback(() => {
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
      const logForDay = allWorkoutLogs.find(
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

    setCalendarDays(daysArray);
  }, [currentMonthDate, allWorkoutLogs]);

  useEffect(() => {
    if (!isLoading) {
      generateCalendarDays();
    }
  }, [isLoading, generateCalendarDays]);

  const handleDayClick = (day: CalendarDay) => {
    if (day.hasWorkout && day.workoutLog) {
      setSelectedLog(day.workoutLog);
      setIsModalOpen(true);
    }
  };

  const changeMonth = (direction: "prev" | "next") => {
    setMonthChangeDirection(direction === "next" ? 1 : -1);
    setCurrentMonthDate(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() + (direction === "next" ? 1 : -1),
          1
        )
    );
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

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

  return (
    <>
      <motion.div
        className="container mx-auto p-4 sm:p-6"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl font-bold text-brand-text tracking-tight">
            Workout History
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMonth("prev")}
              aria-label="Previous month"
              disabled={isLoading}
              className="!p-2"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold text-brand-text text-center w-36 sm:w-48">
              {format(currentMonthDate, "MMMM yyyy")}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMonth("next")}
              aria-label="Next month"
              disabled={isLoading}
              className="!p-2"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4 sm:p-6 bg-brand-card/60 backdrop-blur-sm border border-white/10 min-h-[580px]">
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
                            onClick={() =>
                              day.isCurrentMonth && handleDayClick(day)
                            }
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
        </motion.div>

        {selectedLog && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`Workout Details`}
          >
            <div className="space-y-4 text-brand-text">
              <div className="text-center -mt-2">
                <h4 className="text-lg font-bold text-brand-primary">
                  {selectedLog.programTitle}
                </h4>
                <p className="text-sm text-brand-text-muted">
                  {formatDateUtil(selectedLog.date, "EEEE, MMMM d, yyyy")}
                </p>
              </div>

              <div className="flex justify-center items-center gap-6 text-sm bg-brand-background/40 p-3 rounded-lg">
                {selectedLog.durationMinutes && (
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="h-5 w-5 text-brand-text-muted" />{" "}
                    {selectedLog.durationMinutes} min
                  </span>
                )}
                {selectedLog.caloriesBurned && (
                  <span className="flex items-center gap-1.5">
                    <FireIcon className="h-5 w-5 text-brand-text-muted" />{" "}
                    {selectedLog.caloriesBurned} kcal
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h5 className="font-semibold flex items-center gap-2 text-sm text-brand-text-muted">
                  <ListBulletIcon className="h-5 w-5" />
                  Completed Exercises
                </h5>
                {selectedLog.completedExercises.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto pr-2 bg-brand-background/40 rounded-lg p-3 space-y-2">
                    {selectedLog.completedExercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="text-sm flex justify-between items-center"
                      >
                        <span>{ex.exerciseName}</span>
                        <span className="font-medium bg-brand-background/50 px-2 py-0.5 rounded">
                          {ex.sets.filter((s) => s.completed).length}/
                          {ex.sets.length} sets
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-text-muted italic text-sm p-3 bg-brand-background/40 rounded-lg">
                    No specific exercises were tracked for this session.
                  </p>
                )}
              </div>

              {selectedLog.notes && (
                <div className="space-y-2">
                  <h5 className="font-semibold flex items-center gap-2 text-sm text-brand-text-muted">
                    <PencilIcon className="h-5 w-5" />
                    Notes
                  </h5>
                  <p className="text-sm bg-brand-background/40 rounded-lg p-3 text-brand-text-muted">
                    {selectedLog.notes}
                  </p>
                </div>
              )}
            </div>
          </Modal>
        )}
      </motion.div>
    </>
  );
};

export default HistoryPage;
