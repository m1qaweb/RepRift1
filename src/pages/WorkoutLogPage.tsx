// /src/pages/WorkoutLogPage.tsx – Page for active workout logging.
import React from "react";
import WorkoutLogForm from "../components/Workout/WorkoutLogForm";
import { motion } from "framer-motion";
// Optional: You might add other components here like a motivational quote or user stats relevant during workout.

const WorkoutLogPage: React.FC = () => {
  // The WorkoutLogForm component itself will handle program selection (via query param ideally) and exercise logging.
  // This page primarily serves as a wrapper.

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto" // Constrain width for better form readability
    >
      {/* You could have a header or introduction here */}
      {/* <h1 className="text-3xl font-bold mb-6 text-center text-light-text dark:text-dark-text">Log Your Workout</h1> */}

      <WorkoutLogForm />
    </motion.div>
  );
};

export default WorkoutLogPage;
