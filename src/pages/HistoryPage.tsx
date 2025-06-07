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
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

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
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isGeneratingCalendar, setIsGeneratingCalendar] = useState(false);
  const [monthChangeDirection, setMonthChangeDirection] = useState<
    "prev" | "next" | null
  >(null);

  // Fetch all workout logs once on component mount
  useEffect(() => {
    setIsLoadingLogs(true);
    // === CHANGE 2: Call the new service function ===
    // We no longer pass any arguments, as RLS handles user filtering on the backend.
    getWorkoutLogs()
      // === END CHANGE ===
      .then((logs) => {
        setAllWorkoutLogs(logs);
      })
      .catch((err) => {
        console.error("Failed to load workout history:", err);
        // You could set an error state here to show a message
      })
      .finally(() => {
        setIsLoadingLogs(false);
      });
  }, []); // Empty dependency array means this runs only once. Perfect.

  // The rest of the component's logic is perfectly structured and needs no changes.
  const generateCalendarDays = useCallback(() => {
    // ... no change ...
    if (isLoadingLogs) return;

    setIsGeneratingCalendar(true);
    const monthStart = startOfMonth(currentMonthDate);
    const daysInMonthValue = getDaysInMonth(currentMonthDate);
    const firstDayOfMonthWeekDay = getDay(monthStart);

    const daysArray: CalendarDay[] = [];

    // Days from previous month
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

    // Days of current month
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

    // Days from next month
    const totalDaysShown = daysArray.length;
    const remainingCells = Math.ceil(totalDaysShown / 7) * 7 - totalDaysShown;
    for (let i = 1; i <= remainingCells; i++) {
      daysArray.push({
        date: new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, i),
        isCurrentMonth: false,
        isToday: false,
        hasWorkout: false,
      });
    }

    setCalendarDays(daysArray);
    setIsGeneratingCalendar(false);
  }, [currentMonthDate, allWorkoutLogs, isLoadingLogs]);

  useEffect(() => {
    generateCalendarDays();
  }, [generateCalendarDays]);

  const handleDayClick = (day: CalendarDay) => {
    if (day.hasWorkout && day.workoutLog) {
      setSelectedLog(day.workoutLog);
      setIsModalOpen(true);
    }
  };

  const changeMonth = (direction: "prev" | "next") => {
    setMonthChangeDirection(direction);
    setCurrentMonthDate(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() + (direction === "next" ? 1 : -1),
          1
        )
    );
  };

  const calendarAnimationProps =
    monthChangeDirection === "next"
      ? {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -50 },
        }
      : {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 50 },
        };

  const showLoadingSpinner =
    isLoadingLogs || (isGeneratingCalendar && calendarDays.length === 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 p-4 bg-brand-card rounded-lg shadow-lg">
        <Button
          variant="ghost"
          onClick={() => changeMonth("prev")}
          aria-label="Previous month"
          disabled={isLoadingLogs || isGeneratingCalendar}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold text-brand-text">
          {format(currentMonthDate, "MMMM yyyy")}
        </h1>
        <Button
          variant="ghost"
          onClick={() => changeMonth("next")}
          aria-label="Next month"
          disabled={isLoadingLogs || isGeneratingCalendar}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </Button>
      </div>

      {showLoadingSpinner ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMonthDate.toISOString()}
            className="grid grid-cols-7 gap-1 md:gap-2"
            {...calendarAnimationProps}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (dayName) => (
                <div
                  key={dayName}
                  className="text-center font-medium text-xs sm:text-sm text-brand-text-muted py-2"
                >
                  {dayName}
                </div>
              )
            )}
            {calendarDays.map((day, index) => (
              <motion.div
                key={`${format(day.date, "yyyy-MM-dd")}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01, duration: 0.2 }}
                onClick={() => day.isCurrentMonth && handleDayClick(day)}
                className={`relative p-1 sm:p-2 border aspect-square flex flex-col items-center justify-center rounded-md transition-colors ${
                  day.isCurrentMonth
                    ? "bg-brand-card hover:bg-brand-secondary/30"
                    : "bg-brand-secondary/20 text-brand-text-muted/50"
                } ${
                  day.isToday
                    ? "border-brand-primary ring-2 ring-brand-primary/50"
                    : "border-brand-border"
                } ${
                  day.hasWorkout && day.isCurrentMonth ? "cursor-pointer" : ""
                }`}
              >
                <span className={`text-xs sm:text-sm`}>
                  {format(day.date, "d")}
                </span>
                {day.hasWorkout && day.isCurrentMonth && (
                  <motion.div
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 bg-brand-accent rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {selectedLog && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Workout: ${formatDateUtil(
            selectedLog.date,
            "MMMM d, yyyy"
          )} - ${selectedLog.programTitle}`}
        >
          <div className="text-sm text-brand-text">
            {selectedLog.durationMinutes && (
              <p>
                <strong>Duration:</strong> {selectedLog.durationMinutes} minutes
              </p>
            )}
            {selectedLog.caloriesBurned && (
              <p>
                <strong>Calories Burned:</strong> {selectedLog.caloriesBurned}{" "}
                kcal
              </p>
            )}
            <h5 className="font-semibold mt-3 mb-1">Completed Exercises:</h5>
            {selectedLog.completedExercises.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto pr-2">
                {selectedLog.completedExercises.map((ex, idx) => (
                  <li key={idx}>
                    {" "}
                    {ex.exerciseName}:{" "}
                    {ex.sets.filter((s) => s.completed).length}/{ex.sets.length}{" "}
                    sets{" "}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No specific exercises tracked.</p>
            )}
            {selectedLog.notes && (
              <p className="mt-3">
                <strong>Notes:</strong> {selectedLog.notes}
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HistoryPage;
