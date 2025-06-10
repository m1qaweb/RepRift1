// /src/pages/ProgramDetailPage.tsx – Shows details of a single program.
import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Program } from "../types/data";
import { getProgramById, saveProgram } from "../services/programService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Button from "../components/UI/Button";
import Spinner from "../components/UI/Spinner";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  ScaleIcon,
  ArrowPathIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import Modal from "../components/UI/Modal";
import ProgramEditorForm from "../components/Programs/ProgramEditorForm";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const exerciseListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const exerciseItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, mass: 0.8 },
  },
};

const HolographicHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    x.set(width / 2);
    y.set(height / 2);
  };

  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    x.set(width / 2);
    y.set(height / 2);
  }, [x, y]);

  return (
    <motion.header
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
      className="relative bg-brand-card/50 dark:bg-brand-card/40 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 mb-8 sm:mb-12 border border-brand-border/20 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: useMotionValue(
            `radial-gradient(250px circle at ${springX.get()}px ${springY.get()}px, rgb(var(--color-primary-rgb)/0.15), transparent 80%)`
          ),
        }}
      />
      <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-brand-primary/10 to-transparent dark:from-brand-primary/5"></div>
      <div className="relative z-10">{children}</div>
    </motion.header>
  );
};

const ProgramDetailPage: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: program,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["program", programId],
    queryFn: () => getProgramById(programId!),
    enabled: !!programId,
  });

  const saveProgramMutation = useMutation({
    mutationFn: (
      programData: Omit<Program, "id" | "createdBy"> & { id?: string }
    ) => saveProgram(programData),
    onSuccess: (updatedProgram) => {
      queryClient.invalidateQueries({
        queryKey: ["program", updatedProgram.id],
      });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setIsEditModalOpen(false);
    },
  });

  const handleSaveProgram = (
    programData: Omit<Program, "id" | "createdBy"> & { id?: string }
  ) => {
    saveProgramMutation.mutate(programData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !program) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-center py-10 container mx-auto"
      >
        <h2 className="text-xl text-error font-semibold">Program not found.</h2>
        <p className="text-brand-text-muted mt-2 mb-6">
          The requested program does not exist or could not be loaded.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/programs")}
          leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
        >
          Back to Programs
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 py-6 sm:py-8"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
          className="hover:bg-brand-card/50"
        >
          Back to Programs
        </Button>
      </div>

      {/* Program Header */}
      <HolographicHeader>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight mb-2">
          {program.title}
        </h1>
        <p className="text-brand-text-muted text-base max-w-3xl">
          {program.description}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link to={`/log-workout?programId=${program.id}`}>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<CalendarDaysIcon className="h-5 w-5" />}
              className="w-full sm:w-auto shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Start Workout
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsEditModalOpen(true)}
            leftIcon={<PencilSquareIcon className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            Edit Program
          </Button>
        </div>
      </HolographicHeader>

      {/* Exercises Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2 } }}
      >
        <h2 className="text-2xl font-bold text-brand-text mb-6">
          Exercises ({program.exercises.length})
        </h2>
        {program.exercises.length > 0 ? (
          <motion.div
            variants={exerciseListVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {program.exercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                variants={exerciseItemVariants}
                className="group bg-brand-card/60 rounded-xl border border-brand-border/10 shadow-md hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300"
              >
                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold text-lg text-brand-primary">
                    {exercise.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-sm">
                    <div className="flex items-center">
                      <ArrowPathIcon className="h-4 w-4 mr-2 text-brand-text-muted" />
                      <span className="text-brand-text-muted">Sets:</span>
                      <span className="ml-2 font-semibold text-brand-text">
                        {exercise.sets}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <HashtagIcon className="h-4 w-4 mr-2 text-brand-text-muted" />
                      <span className="text-brand-text-muted">Reps:</span>
                      <span className="ml-2 font-semibold text-brand-text">
                        {exercise.reps}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ScaleIcon className="h-4 w-4 mr-2 text-brand-text-muted" />
                      <span className="text-brand-text-muted">Weight:</span>
                      <span className="ml-2 font-semibold text-brand-text">
                        {exercise.weight} kg
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 px-4 bg-brand-card/30 rounded-2xl border border-brand-border/10">
            <h3 className="text-lg font-semibold text-brand-text mb-2">
              No Exercises Here Yet
            </h3>
            <p className="text-brand-text-muted max-w-sm mx-auto mb-6">
              Click 'Edit Program' to add exercises and build your workout.
            </p>
          </div>
        )}
      </motion.div>

      {isEditModalOpen && program && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Program"
          size="4xl"
        >
          <ProgramEditorForm
            program={program}
            onSave={handleSaveProgram}
            onCancel={() => setIsEditModalOpen(false)}
            isSaving={saveProgramMutation.isPending}
          />
        </Modal>
      )}
    </motion.div>
  );
};

export default ProgramDetailPage;
