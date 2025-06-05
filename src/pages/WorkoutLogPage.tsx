// /src/pages/WorkoutLogPage.tsx
import React from "react";
import WorkoutLogForm from "../components/Workout/WorkoutLogForm";
import { motion } from "framer-motion";

const WorkoutLogPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      <WorkoutLogForm />
    </motion.div>
  );
};

export default WorkoutLogPage;
