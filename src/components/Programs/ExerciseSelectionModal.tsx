import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Spinner from "../UI/Spinner";
import { MasterExercise } from "../../types/data";
import { getMasterExercises } from "../../services/masterExerciseService";
import { useQuery } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface ExerciseSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExercisesSelected: (selectedExercises: MasterExercise[]) => void;
  alreadySelectedIds?: string[];
}

const ExerciseSelectionModal: React.FC<ExerciseSelectionModalProps> = ({
  isOpen = false,
  onClose,
  onExercisesSelected,
  alreadySelectedIds = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedExercises, setSelectedExercises] = useState<MasterExercise[]>(
    []
  );

  const {
    data: masterExercises = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["masterExercises"],
    queryFn: getMasterExercises,
    // Since this is static data, we can tell React Query to cache it forever.
    staleTime: Infinity,
    // The query will only run when the modal is open.
    enabled: isOpen,
  });

  // Reset local state when the modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedExercises([]);
    }
  }, [isOpen]);

  // === CHANGE 3: Derive the filtered list using useMemo ===
  const filteredMasterExercises = useMemo(() => {
    if (!searchTerm) {
      return masterExercises;
    }
    const lowerTerm = searchTerm.toLowerCase();
    // Your component's filtering logic is already great, so we reuse it.
    return masterExercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(lowerTerm) ||
        exercise.bodyPart.toLowerCase().includes(lowerTerm) ||
        exercise.category.toLowerCase().includes(lowerTerm)
    );
  }, [masterExercises, searchTerm]);

  const handleSelectExercise = (exercise: MasterExercise) => {
    setSelectedExercises((prev) =>
      prev.find((ex) => ex.id === exercise.id)
        ? prev.filter((ex) => ex.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const handleSubmitSelection = () => {
    onExercisesSelected(selectedExercises);
  };

  // This render function is now cleaner as it only depends on the derived list and query states.
  const renderExerciseList = () => {
    if (isLoading) {
      return (
        <div className="flex-grow flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex-grow flex justify-center items-center">
          <p className="text-error text-center">{error.message}</p>
        </div>
      );
    }
    if (filteredMasterExercises.length === 0) {
      return (
        <p className="text-center text-brand-text-muted py-10">
          No exercises found. Try a different search.
        </p>
      );
    }

    return (
      <div className="flex-grow overflow-y-auto space-y-2 pr-1.5 -mr-1.5">
        {filteredMasterExercises.map((exercise) => {
          const isCurrentlySelected = selectedExercises.some(
            (ex) => ex.id === exercise.id
          );
          const isAlreadyInProgram = alreadySelectedIds.includes(exercise.id);

          return (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              layout
              className={`p-3 border rounded-lg cursor-pointer transition-all duration-150 flex justify-between items-center ${
                isAlreadyInProgram
                  ? "bg-brand-border/20 opacity-50 cursor-not-allowed"
                  : "border-brand-border/70 hover:border-brand-primary hover:bg-brand-primary/5"
              } ${
                isCurrentlySelected
                  ? "!border-brand-primary ring-1 ring-brand-primary bg-brand-primary/10"
                  : ""
              }`}
              onClick={() =>
                !isAlreadyInProgram && handleSelectExercise(exercise)
              }
              aria-disabled={isAlreadyInProgram}
              aria-selected={isCurrentlySelected}
            >
              <div>
                <h4 className="font-semibold text-brand-text">
                  {exercise.name}
                </h4>
                <p className="text-xs text-brand-text-muted">
                  {exercise.category} • {exercise.bodyPart}
                  {exercise.equipment && ` • ${exercise.equipment.join(", ")}`}
                </p>
              </div>
              {isAlreadyInProgram ? (
                <span className="text-xs text-brand-text-muted italic ml-2">
                  In Program
                </span>
              ) : isCurrentlySelected ? (
                <CheckCircleIcon className="h-5 w-5 text-brand-primary ml-2" />
              ) : (
                <div className="h-5 w-5 border-2 border-brand-border rounded-full group-hover:border-brand-primary ml-2 flex-shrink-0"></div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Exercises from Library"
      size="3xl"
      preventCloseOnBackdropClick
      hideDefaultFooter
      customFooter={
        <>
          <Button variant="ghost" onClick={onClose} size="md">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitSelection}
            disabled={selectedExercises.length === 0}
            size="md"
          >
            Add{" "}
            {selectedExercises.length > 0
              ? `(${selectedExercises.length}) Exercise${
                  selectedExercises.length > 1 ? "s" : ""
                }`
              : "Exercise(s)"}
          </Button>
        </>
      }
      bodyClassName="pt-2 pb-0"
    >
      <div className="space-y-3 flex flex-col h-[calc(65vh)] sm:h-[calc(70vh)]">
        <div className="relative flex-shrink-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises (e.g., Bench Press, Legs, Barbell)"
            className="w-full px-4 py-2.5 border border-brand-border rounded-lg bg-brand-card text-brand-text focus:ring-1 focus:ring-brand-primary focus:border-brand-primary pl-10"
            aria-label="Search exercises"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-brand-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        {renderExerciseList()}
      </div>
    </Modal>
  );
};

export default ExerciseSelectionModal;
