import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  FieldErrors,
} from "react-hook-form";
import {
  Program,
  Exercise as ProgramExerciseData,
  saveProgram,
  MasterExercise,
} from "../../utils/fakeApi";
import Button from "../UI/Button";
import ExerciseInputRow from "./ExerciseInputRow";
import ExerciseSelectionModal from "./ExerciseSelectionModal";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { validateRequired } from "../../utils/validators";
import Spinner from "../UI/Spinner";

interface ProgramEditorFormProps {
  program?: Program | null;
  onSave: (savedProgram: Program) => void;
  onCancel: () => void;
}

export type ProgramExerciseFormFields = {
  masterExerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restInterval: number;
  localId: string;
};

type ProgramFormInputs = {
  title: string;
  description: string;
  exercises: ProgramExerciseFormFields[];
};

const listItemVariants = {
  initial: { opacity: 0, y: -10, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 25 },
  },
  exit: { opacity: 0, x: 30, scale: 0.95, transition: { duration: 0.2 } },
};

const ProgramEditorForm: React.FC<ProgramEditorFormProps> = ({
  program,
  onSave,
  onCancel,
}) => {
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
    watch,
  } = useForm<ProgramFormInputs>({
    defaultValues: { title: "", description: "", exercises: [] },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    // 'move' is available if needed for reordering
    control,
    name: "exercises",
    keyName: "localId",
  });

  const currentProgramExercises = watch("exercises");

  useEffect(() => {
    if (program) {
      const mappedExercises = program.exercises.map((ex, index) => ({
        masterExerciseId:
          (ex as any).masterExerciseId || ex.id || `imported_ex_${index}`,
        name: ex.name,
        sets: ex.sets || 3,
        reps: ex.reps || "8-12",
        restInterval: ex.restInterval || 60,
        localId: (ex as any).localId || Math.random().toString(36).substr(2, 9),
      }));
      reset({
        title: program.title,
        description: program.description,
        exercises: mappedExercises,
      });
    } else {
      reset({ title: "", description: "", exercises: [] });
    }
  }, [program, reset]);

  const onSubmitHandler: SubmitHandler<ProgramFormInputs> = async (data) => {
    const exercisesToSave: ProgramExerciseData[] = data.exercises.map((ex) => ({
      id: ex.masterExerciseId,
      name: ex.name,
      sets: Number(ex.sets),
      reps: ex.reps,
      restInterval: Number(ex.restInterval),
    }));
    const programDataToSave = {
      id: program?.id,
      title: data.title,
      description: data.description,
      exercises: exercisesToSave,
    };
    try {
      const saved = await saveProgram(
        programDataToSave as Omit<Program, "createdBy"> & { createdBy?: string }
      );
      setToastMessage("Program saved successfully!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      onSave(saved);
    } catch (error) {
      setToastMessage(
        `Error: ${
          error instanceof Error ? error.message : "Could not save program"
        }`
      );
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  const handleExercisesSelectedFromModal = (
    selectedMasterExercises: MasterExercise[]
  ) => {
    const newExercisesToAdd = selectedMasterExercises.map((masterEx) => ({
      masterExerciseId: masterEx.id,
      name: masterEx.name,
      sets: 3,
      reps: "8-12",
      restInterval: 60,
      localId: Math.random().toString(36).substr(2, 9),
    }));
    append(newExercisesToAdd);
    setIsExerciseModalOpen(false);
  };

  const textInputClass = (hasError: boolean) =>
    `w-full px-3 py-2 border rounded-md bg-transparent text-brand-text placeholder-brand-text-muted/70 focus:outline-none focus:ring-1 shadow-sm ${
      hasError
        ? "border-error focus:border-error focus:ring-error"
        : "border-brand-border focus:border-brand-primary focus:ring-brand-primary"
    }`;

  return (
    <>
      <AnimatePresence mode="wait">
        {!isExerciseModalOpen && (
          <motion.form
            key="program-editor-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onSubmit={handleSubmit(onSubmitHandler)}
            className="space-y-4 h-full flex flex-col"
          >
            <div className="flex-shrink-0 space-y-3 pb-2">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-brand-text mb-1"
                >
                  Program Title
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title", {
                    validate: (v) => validateRequired(v, "Title"),
                  })}
                  className={textInputClass(!!errors.title)}
                  placeholder="e.g., My Awesome Strength Plan"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-error">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-brand-text mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={2}
                  {...register("description")}
                  className={textInputClass(!!errors.description)}
                  placeholder="A short description of this program's focus..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-error">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 pr-1.5 custom-scrollbar-thin py-1 -mr-1.5">
              <div className="flex justify-between items-center mb-2 sticky top-0 bg-brand-card py-2 z-10 border-b border-brand-border/50 px-1">
                <h4 className="text-base sm:text-lg font-semibold text-brand-text">
                  Exercises ({fields.length})
                </h4>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsExerciseModalOpen(true)}
                  leftIcon={<PlusCircleIcon className="h-4 w-4" />}
                >
                  Add
                </Button>
              </div>
              <AnimatePresence initial={false}>
                {fields.length === 0 && (
                  <motion.div
                    key="no-exercises-msg"
                    variants={listItemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-center text-brand-text-muted py-6 italic text-sm"
                  >
                    No exercises. Add from library to build your program.
                  </motion.div>
                )}
                {fields.map((field, index) => (
                  <motion.div
                    key={field.localId}
                    variants={listItemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                    className="p-3 border border-brand-border/50 rounded-lg bg-brand-card/40 shadow relative"
                  >
                    <ExerciseInputRow
                      exerciseData={field}
                      index={index}
                      register={register}
                      errors={
                        errors.exercises?.[index] as
                          | FieldErrors<ProgramExerciseFormFields>
                          | undefined
                      }
                      onRemove={() => remove(index)}
                      canRemove={true}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex-shrink-0 flex justify-end space-x-3 pt-3 border-t border-brand-border mt-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                size="md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                size="md"
                disabled={
                  isSubmitting ||
                  (!program &&
                    Object.keys(dirtyFields).length === 0 &&
                    fields.length === 0)
                }
              >
                {program?.id ? "Update Program" : "Save Program"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <ExerciseSelectionModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onExercisesSelected={handleExercisesSelectedFromModal}
        alreadySelectedIds={currentProgramExercises.map(
          (ex) => ex.masterExerciseId
        )}
      />

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{
              opacity: 0,
              y: 20,
              x: "-50%",
              transition: { duration: 0.2 },
            }}
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 p-3 sm:p-4 rounded-lg shadow-lg text-sm sm:text-base
                        ${
                          toastType === "error"
                            ? "bg-error text-white"
                            : "bg-success text-white"
                        }`}
          >
            <div className="flex items-center">
              <Spinner size="sm" colorClass="text-white" className="mr-2" />{" "}
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default ProgramEditorForm;
