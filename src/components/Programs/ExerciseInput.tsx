// /src/components/Programs/ExerciseInput.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Control,
  UseFormRegister,
  DeepRequired,
  FieldErrorsImpl,
} from "react-hook-form";
import { XCircleIcon } from "@heroicons/react/24/solid";

// Define the shape of a single exercise's data for the form
// This should match the structure within ProgramFormInputs['exercises'][number]
// but without 'localId' perhaps if localId isn't a field to validate
export interface SingleExerciseFormFields {
  id?: string; // Optional if not always present or not directly a form field
  name: string;
  sets: number;
  reps: string;
  restInterval: number;
  // localId is used for keys but not typically for validation errors for localId itself
}

interface ExerciseInputProps {
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>; // Control type can be more specific if ProgramFormInputs is imported
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>; // UseFormRegister can also be more specific

  // UPDATED TYPE for errors prop:
  // This type precisely describes the errors for the fields of a single exercise
  errors?: Partial<FieldErrorsImpl<DeepRequired<SingleExerciseFormFields>>>;

  onRemove: () => void;
  canRemove: boolean;
}

const ExerciseInput: React.FC<ExerciseInputProps> = ({
  index,
  register,
  errors,
  onRemove,
  canRemove,
}) => {
  const errorShake = {
    /* ... as before ... */
  };

  // Adjusted helper to correctly type fieldName based on SingleExerciseFormFields
  const hasError = (fieldName: keyof SingleExerciseFormFields): boolean => {
    // The `errors` object might not exist if there are no errors.
    // If it exists, it might not have an entry for `fieldName`.
    return !!(errors && errors[fieldName]);
  };

  const getErrorMessage = (
    fieldName: keyof SingleExerciseFormFields
  ): string | undefined => {
    return errors?.[fieldName]?.message;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
      <motion.div
        className="md:col-span-4"
        // Use the new hasError helper
        animate={hasError("name") ? "animate" : "initial"}
        variants={errorShake}
      >
        <label htmlFor={`exercises.${index}.name`} className="sr-only">
          Exercise Name
        </label>
        <input
          id={`exercises.${index}.name`}
          placeholder="Exercise Name"
          {...register(`exercises.${index}.name`, {
            required: "Name is required",
          })}
          className={`w-full text-sm px-2 py-1.5 border rounded-md bg-transparent ${
            hasError("name")
              ? "border-red-500 animate-pulse-red"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {/* Use the new getErrorMessage helper */}
        {hasError("name") && (
          <p className="text-xs text-red-500 mt-0.5">
            {getErrorMessage("name")}
          </p>
        )}
      </motion.div>

      <motion.div
        className="md:col-span-2"
        animate={hasError("sets") ? "animate" : "initial"}
        variants={errorShake}
      >
        <label htmlFor={`exercises.${index}.sets`} className="sr-only">
          Sets
        </label>
        <input
          id={`exercises.${index}.sets`}
          type="number"
          placeholder="Sets"
          {...register(`exercises.${index}.sets`, {
            required: "Sets?",
            valueAsNumber: true,
            min: { value: 1, message: ">0" },
          })}
          className={`w-full text-sm px-2 py-1.5 border rounded-md bg-transparent ${
            hasError("sets")
              ? "border-red-500 animate-pulse-red"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {hasError("sets") && (
          <p className="text-xs text-red-500 mt-0.5">
            {getErrorMessage("sets")}
          </p>
        )}
      </motion.div>

      <motion.div
        className="md:col-span-2"
        animate={hasError("reps") ? "animate" : "initial"}
        variants={errorShake}
      >
        <label htmlFor={`exercises.${index}.reps`} className="sr-only">
          Reps
        </label>
        <input
          id={`exercises.${index}.reps`}
          placeholder="Reps (e.g., 8-12)"
          {...register(`exercises.${index}.reps`, { required: "Reps?" })}
          className={`w-full text-sm px-2 py-1.5 border rounded-md bg-transparent ${
            hasError("reps")
              ? "border-red-500 animate-pulse-red"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {hasError("reps") && (
          <p className="text-xs text-red-500 mt-0.5">
            {getErrorMessage("reps")}
          </p>
        )}
      </motion.div>

      <motion.div
        className="md:col-span-3"
        animate={hasError("restInterval") ? "animate" : "initial"}
        variants={errorShake}
      >
        <label htmlFor={`exercises.${index}.restInterval`} className="sr-only">
          Rest (sec)
        </label>
        <input
          id={`exercises.${index}.restInterval`}
          type="number"
          placeholder="Rest (sec)"
          {...register(`exercises.${index}.restInterval`, {
            required: "Rest?",
            valueAsNumber: true,
            min: { value: 0, message: ">=0" },
          })}
          className={`w-full text-sm px-2 py-1.5 border rounded-md bg-transparent ${
            hasError("restInterval")
              ? "border-red-500 animate-pulse-red"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {hasError("restInterval") && (
          <p className="text-xs text-red-500 mt-0.5">
            {getErrorMessage("restInterval")}
          </p>
        )}
      </motion.div>

      {canRemove && (
        <div className="md:col-span-1 flex items-center justify-end md:justify-center">
          <motion.button
            type="button"
            onClick={onRemove}
            className="p-1 text-red-500 hover:text-red-700"
            whileHover={{ scale: 1.1 }}
            title="Remove Exercise"
          >
            <XCircleIcon className="h-5 w-5" />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ExerciseInput;
