import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  RectangleStackIcon,
  CalendarDaysIcon,
  ClockIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { useWorkout } from "../../contexts/WorkoutContext";
import { isThisWeek, parseISO } from "date-fns";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const QuickStats: React.FC = () => {
  const { workouts, personalRecords } = useWorkout();

  const stats = useMemo(() => {
    const totalWorkouts = workouts.length;
    const workoutsThisWeek = workouts.filter((w) =>
      isThisWeek(parseISO(w.date), { weekStartsOn: 1 })
    ).length;
    const totalHours = Math.floor(
      workouts.reduce((acc, w) => acc + w.duration, 0) / 60
    );
    const totalPrs = Object.keys(personalRecords).length;

    return [
      {
        name: "Total Workouts",
        stat: totalWorkouts.toString(),
        icon: RectangleStackIcon,
      },
      {
        name: "Workouts This Week",
        stat: workoutsThisWeek.toString(),
        icon: CalendarDaysIcon,
      },
      {
        name: "Hours Trained",
        stat: `${totalHours} hrs`,
        icon: ClockIcon,
      },
      {
        name: "Total PRs",
        stat: totalPrs.toString(),
        icon: TrophyIcon,
      },
    ];
  }, [workouts, personalRecords]);

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      animate="visible"
    >
      {stats.map((item) => (
        <motion.div
          key={item.name}
          variants={cardVariants}
          className="bg-brand-card rounded-2xl shadow-lg p-5"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <item.icon
                className="h-6 w-6 text-brand-text-muted"
                aria-hidden="true"
              />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-brand-text-muted truncate">
                  {item.name}
                </dt>
                <dd>
                  <div className="text-lg font-bold text-brand-text">
                    {item.stat}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuickStats;
