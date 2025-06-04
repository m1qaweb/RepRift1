// /src/pages/ProgramDetailPage.tsx – Shows details of a single program.
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// UPDATED: Removed Exercise import
import { Program, fetchProgramById } from "../utils/fakeApi";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Spinner from "../components/UI/Spinner";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Modal from "../components/UI/Modal";
import ProgramEditorForm from "../components/Programs/ProgramEditorForm";

// Define variants for the exercise cards for staggering
const exerciseCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    // i is the custom prop (index)
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 120,
    },
  }),
};

const ProgramDetailPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (programId) {
      setIsLoading(true);
      fetchProgramById(programId)
        .then((fetchedProgram) => {
          // CORRECTED: Handle undefined case
          if (fetchedProgram) {
            setProgram(fetchedProgram);
          } else {
            setProgram(null);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [programId]);

  const handleEditSuccess = (updatedProgram: Program) => {
    setProgram(updatedProgram);
    setIsEditModalOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-red-500">Program not found.</h2>
        <Link to="/programs">
          <Button variant="primary" className="mt-4">
            Back to Programs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
          className="mb-4"
        >
          Back to Programs
        </Button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-lg"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
              {program.title}
            </h1>
            <p className="text-light-secondary dark:text-dark-secondary mt-1">
              {program.description}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<PencilSquareIcon className="h-5 w-5" />}
            >
              Edit
            </Button>
            <Link to={`/log-workout?programId=${program.id}`}>
              <Button
                variant="primary"
                leftIcon={<CalendarDaysIcon className="h-5 w-5" />}
              >
                Start this Workout
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-4">
          Exercises in this Program
        </h2>
        {program.exercises.length > 0 ? (
          <div className="space-y-4">
            {program.exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id || index}
                custom={index} // Pass index for variant function
                variants={exerciseCardVariants} // Use defined variants
                initial="hidden"
                animate="visible" // Target the 'visible' variant
              >
                <Card className="p-4 border border-light-border/50 dark:border-dark-border/50">
                  <h3 className="text-lg font-medium text-light-primary dark:text-dark-primary">
                    {exercise.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-sm text-light-secondary dark:text-dark-secondary">
                    <p>
                      <span className="font-medium text-light-text dark:text-dark-text">
                        Sets:
                      </span>{" "}
                      {exercise.sets}
                    </p>
                    <p>
                      <span className="font-medium text-light-text dark:text-dark-text">
                        Reps:
                      </span>{" "}
                      {exercise.reps}
                    </p>
                    <p>
                      <span className="font-medium text-light-text dark:text-dark-text">
                        Rest:
                      </span>{" "}
                      {exercise.restInterval}s
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-light-secondary dark:text-dark-secondary">
            No exercises have been added to this program yet.
          </p>
        )}
      </motion.div>

      {isEditModalOpen &&
        program && ( // Ensure program is not null for the editor
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Edit Program"
            size="xl"
          >
            <ProgramEditorForm
              program={program}
              onSave={handleEditSuccess}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </Modal>
        )}
    </motion.div>
  );
};

export default ProgramDetailPage;
