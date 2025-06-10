// /src/components/Programs/ProgramEditorForm.tsx (UPGRADED FOR SUPABASE)

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

// === THE ONLY CHANGE IS HERE ===
import {
  Program,
  Exercise as ProgramExerciseData,
  MasterExercise,
} from "../../types/data"; // Keep using types
// === END CHANGE ===

import Button from "../UI/Button";
import ExerciseInputRow from "./ExerciseInputRow";
import ExerciseSelectionModal from "./ExerciseSelectionModal";
import {
  PlusCircleIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import { validateRequired } from "../../utils/validators";

interface ProgramEditorFormProps {
  program?: Program | null;
  onSave: (
    programData: Omit<Program, "id" | "createdBy"> & { id?: string }
  ) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export type ProgramExerciseFormFields = {
  masterExerciseId: string;
  name: string;
  sets: number;
  reps: string;
  weight: number;
  localId: string;
};

type ProgramFormInputs = {
  title: string;
  description: string;
  exercises: ProgramExerciseFormFields[];
};

const listItemVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    x: -30,
    scale: 0.95,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const ProgramEditorForm: React.FC<ProgramEditorFormProps> = ({
  program,
  onSave,
  onCancel,
  isSaving,
}) => {
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm<ProgramFormInputs>({
    defaultValues: { title: "", description: "", exercises: [] },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
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
        sets: ex.sets ?? 3,
        reps: ex.reps ?? "8-12",
        weight: ex.weight ?? 0,
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

  const onSubmitHandler: SubmitHandler<ProgramFormInputs> = (data) => {
    const exercisesToSave: ProgramExerciseData[] = data.exercises.map((ex) => ({
      id: ex.masterExerciseId,
      name: ex.name,
      sets: Number(ex.sets),
      reps: ex.reps,
      weight: Number(ex.weight),
    }));

    onSave({
      id: program?.id,
      title: data.title,
      description: data.description,
      exercises: exercisesToSave,
    });
  };

  const handleExercisesSelectedFromModal = (
    selectedMasterExercises: MasterExercise[]
  ) => {
    const newExercisesToAdd = selectedMasterExercises.map((masterEx) => ({
      masterExerciseId: masterEx.id,
      name: masterEx.name,
      sets: 3,
      reps: "8-12",
      weight: 0,
      localId: Math.random().toString(36).substr(2, 9),
    }));
    append(newExercisesToAdd);
    setIsExerciseModalOpen(false);
  };

  const textInputClass = (hasError: boolean) =>
    `w-full appearance-none rounded-lg border bg-brand-background/50 py-2.5 px-4 text-base text-brand-text shadow-sm transition-colors placeholder:text-brand-text-muted/60 focus:outline-none focus:ring-1 ${
      hasError
        ? "border-error/50 ring-error/50 focus:border-error focus:ring-error"
        : "border-brand-border/20 ring-brand-primary/50 focus:border-brand-primary focus:ring-brand-primary"
    }`;

  const hasUnsavedChanges = isDirty;

  return (
    <>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex h-full flex-col p-1"
      >
        <div className="flex-grow space-y-6 overflow-y-auto p-4 pr-5 custom-scrollbar-thin">
          {/* Program Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-brand-text">Details</h3>
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-brand-text-muted"
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
                placeholder="e.g., Ultimate Strength"
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
                className="mb-1.5 block text-sm font-medium text-brand-text-muted"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={2}
                {...register("description")}
                className={textInputClass(!!errors.description)}
                placeholder="A short description of this program's purpose..."
              />
            </div>
          </div>

          {/* Exercises Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-brand-text">
                Exercises ({fields.length})
              </h3>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsExerciseModalOpen(true)}
                leftIcon={<PlusCircleIcon className="h-5 w-5" />}
              >
                Add Exercises
              </Button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.localId}
                    variants={listItemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                  >
                    <ExerciseInputRow
                      index={index}
                      exerciseData={field}
                      register={register}
                      errors={errors.exercises?.[index]}
                      onRemove={() => remove(index)}
                      canRemove={fields.length > 0}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {fields.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-border/20 bg-brand-background/20 py-12 text-center">
                  <RectangleStackIcon className="h-12 w-12 text-brand-primary/30" />
                  <h4 className="mt-4 font-semibold text-brand-text">
                    No exercises yet
                  </h4>
                  <p className="mt-1 text-sm text-brand-text-muted">
                    Add exercises to build your program.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 rounded-b-lg border-t border-brand-border/20 bg-brand-background/50 p-4">
          <div className="flex justify-between items-center">
            <p
              className={`text-xs transition-opacity duration-300 ${
                hasUnsavedChanges ? "opacity-100" : "opacity-0"
              }`}
            >
              Unsaved changes
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                disabled={isSaving || !isValid || !isDirty}
                className="min-w-[120px]"
              >
                {isSaving ? "Saving..." : "Save Program"}
              </Button>
            </div>
          </div>
        </div>
      </motion.form>

      {isExerciseModalOpen && (
        <ExerciseSelectionModal
          isOpen={isExerciseModalOpen}
          onClose={() => setIsExerciseModalOpen(false)}
          onExercisesSelected={handleExercisesSelectedFromModal}
          alreadySelectedIds={currentProgramExercises.map(
            (ex) => ex.masterExerciseId
          )}
        />
      )}
    </>
  );
};

export default ProgramEditorForm;
