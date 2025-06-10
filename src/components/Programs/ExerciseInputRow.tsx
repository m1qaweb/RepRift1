// /src/components/Programs/ExerciseInputRow.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  UseFormRegister,
  DeepRequired,
  FieldErrorsImpl,
} from "react-hook-form";
import {
  XCircleIcon,
  ArrowPathIcon,
  HashtagIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { ProgramExerciseFormFields } from "./ProgramEditorForm";
import Button from "../UI/Button";

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
    return errors?.[fieldName]?.message;
  };

  const InputField = React.forwardRef<
    HTMLInputElement,
    {
      name: keyof Omit<
        ProgramExerciseFormFields,
        "name" | "masterExerciseId" | "localId"
      >;
      icon: React.ComponentType<any>;
      placeholder: string;
      [key: string]: any;
    }
  >(({ name, icon: Icon, placeholder, ...props }, ref) => {
    const hasError = !!getErrorForField(name);
    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon
            className={`h-4 w-4 ${
              hasError ? "text-error" : "text-brand-text-muted"
            }`}
          />
        </div>
        <input
          ref={ref}
          name={name}
          {...props}
          className={`w-full appearance-none rounded-lg border bg-brand-background/50 py-2.5 pl-9 pr-2 text-sm text-brand-text shadow-sm transition-colors placeholder:text-brand-text-muted/60 focus:outline-none focus:ring-1 
          ${
            hasError
              ? "border-error/50 ring-error/50 focus:border-error focus:ring-error"
              : "border-brand-border/20 ring-brand-primary/50 focus:border-brand-primary focus:ring-brand-primary"
          }`}
          placeholder={placeholder}
        />
        {hasError && (
          <div className="absolute -bottom-4 right-0 text-xs text-error">
            {getErrorForField(name)}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="rounded-2xl bg-brand-card/30 p-4 border border-brand-border/10 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h5 className="font-semibold text-base text-brand-primary truncate pr-2">
          {exerciseData.name}
        </h5>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-brand-text-muted hover:bg-error/10 hover:text-error"
            title="Remove Exercise"
          >
            <XCircleIcon className="h-6 w-6" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-5">
        <InputField
          icon={ArrowPathIcon}
          placeholder="Sets"
          type="number"
          defaultValue={exerciseData.sets}
          {...register(`exercises.${index}.sets` as const, {
            required: "Sets?",
            valueAsNumber: true,
            min: { value: 1, message: ">0" },
          })}
        />
        <InputField
          icon={HashtagIcon}
          placeholder="Reps (e.g. 8-12)"
          type="text"
          defaultValue={exerciseData.reps}
          {...register(`exercises.${index}.reps` as const, {
            required: "Reps?",
          })}
        />
        <InputField
          icon={ScaleIcon}
          placeholder="Weight (kg)"
          type="number"
          defaultValue={exerciseData.weight}
          {...register(`exercises.${index}.weight` as const, {
            required: "Weight?",
            valueAsNumber: true,
            min: { value: 0, message: "≥0" },
          })}
        />
      </div>
    </div>
  );
};

export default React.memo(ExerciseInputRow);
