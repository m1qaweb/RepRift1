// /src/components/Programs/ProgramEditorForm.tsx – Form for creating/editing programs.
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Program, Exercise, saveProgram } from "../../utils/fakeApi";
import Button from "../UI/Button";
import ExerciseInput from "./ExerciseInput"; // Component for individual exercise rows
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { validateRequired } from "../../utils/validators";

interface ProgramEditorFormProps {
  program?: Program | null; // Existing program to edit, or null/undefined for new
  onSave: (savedProgram: Program) => void; // Callback after save
  onCancel: () => void;
}

type ProgramFormInputs = {
  title: string;
  description: string;
  exercises: Array<Partial<Exercise> & { localId?: string }>; // Add localId for key in useFieldArray
};

const ProgramEditorForm: React.FC<ProgramEditorFormProps> = ({
  program,
  onSave,
  onCancel,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProgramFormInputs>({
    defaultValues: {
      title: program?.title || "",
      description: program?.description || "",
      exercises: program?.exercises.map((ex) => ({
        ...ex,
        localId: Math.random().toString(36).substr(2, 9),
      })) || [
        {
          name: "",
          sets: 3,
          reps: "8-12",
          restInterval: 60,
          localId: Math.random().toString(36).substr(2, 9),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (program) {
      reset({
        title: program.title,
        description: program.description,
        exercises: program.exercises.map((ex) => ({
          ...ex,
          localId: ex.id || Math.random().toString(36).substr(2, 9),
        })), // Use ex.id if available for existing ones
      });
    } else {
      reset({
        // Ensure some default for new program if not covered by defaultValues
        title: "",
        description: "",
        exercises: [
          {
            name: "",
            sets: 3,
            reps: "8-12",
            restInterval: 60,
            localId: Math.random().toString(36).substr(2, 9),
          },
        ],
      });
    }
  }, [program, reset]);

  const onSubmitHandler: SubmitHandler<ProgramFormInputs> = async (data) => {
    // Filter out exercises without a name, and remove localId before saving
    const exercisesToSave = data.exercises
      .filter((ex) => ex.name && ex.name.trim() !== "")
      .map(({ localId, ...rest }) => rest as Exercise); // Cast to Exercise assuming all fields are now present

    const programDataToSave: Omit<Program, "id" | "createdBy"> & {
      id?: string;
    } = {
      id: program?.id, // Include id if updating
      title: data.title,
      description: data.description,
      exercises: exercisesToSave,
    };

    try {
      const saved = await saveProgram(programDataToSave);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      onSave(saved); // Callback
    } catch (error) {
      console.error("Failed to save program:", error);
      // Handle error display (e.g., another toast or an error message area)
    }
  };

  const handleAddExercise = () => {
    append({
      name: "",
      sets: 3,
      reps: "8-12",
      restInterval: 60,
      localId: Math.random().toString(36).substr(2, 9),
    });
  };

  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmitHandler)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-light-card dark:bg-dark-card rounded-lg shadow-md space-y-6"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-light-text dark:text-dark-text"
        >
          Program Title
        </label>
        <input
          type="text"
          id="title"
          {...register("title", {
            validate: (value) => validateRequired(value, "Title"),
          })}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary sm:text-sm bg-transparent ${
            errors.title
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-light-text dark:text-dark-text"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description", {
            validate: (value) => validateRequired(value, "Description"),
          })}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary sm:text-sm bg-transparent ${
            errors.description
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <h4 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
          Exercises
        </h4>
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <motion.div
              key={field.id} // react-hook-form uses 'id' not 'localId' for key
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout // Important for smooth reordering/removal animation
              className="mb-4 p-3 border border-light-border dark:border-dark-border rounded-md relative"
            >
              <ExerciseInput
                index={index}
                control={control}
                register={register}
                errors={errors.exercises?.[index]} // Pass specific error for this exercise
                onRemove={() => (fields.length > 1 ? remove(index) : null)} // Prevent removing the last one, or handle empty state
                canRemove={fields.length > 1}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        <Button
          type="button"
          variant="secondary"
          onClick={handleAddExercise}
          leftIcon={<PlusCircleIcon className="h-5 w-5" />}
          className="mt-2"
        >
          Add Exercise
        </Button>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-light-border dark:border-dark-border">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {program?.id ? "Update Program" : "Save Program"}
        </Button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
            className="fixed bottom-5 right-5 p-4 bg-green-500 text-white rounded-lg shadow-lg"
          >
            Program saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default ProgramEditorForm;
