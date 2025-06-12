// /src/pages/HistoryPage.tsx (REFACTORED)

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useWorkoutLogs } from "../hooks/useWorkoutLogs";
import { WorkoutLog } from "../types/data";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import Calendar, { CalendarDay } from "../components/History/Calendar";
import WorkoutDetailModal from "../components/History/WorkoutDetailModal";

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

const HistoryPage: React.FC = () => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null);
  const [monthChangeDirection, setMonthChangeDirection] = useState(1);

  const {
    workoutLogs: allWorkoutLogs = [],
    isLoading,
    isError,
    error,
  } = useWorkoutLogs();

  const handleDayClick = (day: CalendarDay) => {
    if (day.hasWorkout && day.workoutLog) {
      setSelectedLog(day.workoutLog);
    }
  };

  const handleMonthChange = (direction: "prev" | "next") => {
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

  const handleCloseModal = () => {
    setSelectedLog(null);
  };

  if (isError && error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-500">
          Error Loading History
        </h2>
        <p className="text-brand-text-muted mt-2">{error.message}</p>
      </div>
    );
  }

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
        </motion.div>

        <motion.div variants={itemVariants}>
          <Calendar
            workoutLogs={allWorkoutLogs}
            currentMonthDate={currentMonthDate}
            onMonthChange={handleMonthChange}
            onDayClick={handleDayClick}
            isLoading={isLoading}
            monthChangeDirection={monthChangeDirection}
          />
        </motion.div>
      </motion.div>

      <WorkoutDetailModal
        isOpen={!!selectedLog}
        onClose={handleCloseModal}
        log={selectedLog}
      />
    </>
  );
};

export default HistoryPage;
