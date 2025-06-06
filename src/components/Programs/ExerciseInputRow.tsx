// /src/components/Programs/ExerciseInputRow.tsx (Corrected & Memoized)
import React from "react";
import { motion } from "framer-motion";
import {
  UseFormRegister,
  DeepRequired,
  FieldErrorsImpl,
} from "react-hook-form";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { ProgramExerciseFormFields } from "./ProgramEditorForm";

interface ExerciseInputRowProps {
  exerciseData: ProgramExerciseFormFields;
  index: number;
  register: UseFormRegister<any>;
  errors?: Partial<FieldErrorsImpl<DeepRequired<ProgramExerciseFormFields>>>;
  onRemove: () => void;
  canRemove: boolean;
}

const ExerciseInputRow: React.FC<ExerciseInputRowProps> = ({
  exerciseData,
  index,
  register,
  errors,
  onRemove,
  canRemove,
}) => {
  const getErrorForField = (
    fieldName: keyof Omit<
      ProgramExerciseFormFields,
      "name" | "masterExerciseId" | "localId"
    >
  ) => {
    // This function logic is correct as-is
    return errors?.[fieldName]?.message;
  };

  const inputClass = (hasErr: boolean) =>
    `w-full text-sm px-2 py-1.5 border rounded-md bg-brand-card/60 text-brand-text 
     focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary 
     placeholder-brand-text-muted/70
     ${hasErr ? "border-error animate-pulse-red" : "border-brand-border"}`;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h5 className="font-medium text-brand-text pr-2">
          {index + 1}. {exerciseData.name}
        </h5>
        <div className="flex items-center space-x-1">
          {canRemove && (
            <motion.button
              type="button"
              onClick={onRemove}
              className="p-1 text-error hover:text-error/80"
              title="Remove Exercise"
            >
              <XCircleIcon className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-x-3 gap-y-2 items-start pl-4">
        {/* All JSX below this point is functionally correct and does not need changes */}
        <div>
          <label htmlFor={`exercises.${index}.sets`} className="sr-only">
            Sets
          </label>
          <input
            id={`exercises.${index}.sets`}
            type="number"
            placeholder="Sets"
            defaultValue={exerciseData.sets}
            {...register(`exercises.${index}.sets` as const, {
              required: "Sets?",
              valueAsNumber: true,
              min: { value: 1, message: ">0" },
            })}
            className={inputClass(!!getErrorForField("sets"))}
          />
          {getErrorForField("sets") && (
            <p className="text-xs text-error mt-0.5">
              {getErrorForField("sets")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`exercises.${index}.reps`} className="sr-only">
            Reps
          </label>
          <input
            id={`exercises.${index}.reps`}
            placeholder="Reps (e.g., 8-12)"
            defaultValue={exerciseData.reps}
            {...register(`exercises.${index}.reps` as const, {
              required: "Reps?",
            })}
            className={inputClass(!!getErrorForField("reps"))}
          />
          {getErrorForField("reps") && (
            <p className="text-xs text-error mt-0.5">
              {getErrorForField("reps")}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor={`exercises.${index}.restInterval`}
            className="sr-only"
          >
            Rest (sec)
          </label>
          <input
            id={`exercises.${index}.restInterval`}
            type="number"
            placeholder="Rest (s)"
            defaultValue={exerciseData.restInterval}
            {...register(`exercises.${index}.restInterval` as const, {
              required: "Rest?",
              valueAsNumber: true,
              min: { value: 0, message: "≥0" },
            })}
            className={inputClass(!!getErrorForField("restInterval"))}
          />
          {getErrorForField("restInterval") && (
            <p className="text-xs text-error mt-0.5">
              {getErrorForField("restInterval")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// THE FIX: Wrap the component in React.memo to prevent unnecessary re-renders.
// This is a critical performance optimization for components in a list.
export default React.memo(ExerciseInputRow);
