import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Spinner from "../UI/Spinner";
import { MasterExercise } from "../../types/data";
import { getMasterExercises } from "../../services/masterExerciseService";
import { useQuery } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  PlusIcon,
  ExclamationTriangleIcon,
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
    isError,
  } = useQuery({
    queryKey: ["masterExercises"],
    queryFn: getMasterExercises,
    // Since this is static data, we can tell React Query to cache it forever.
    staleTime: Infinity,
    // The query will only run when the modal is open.
    enabled: isOpen,
  });

  // Reset local state when the modal closes
  useEffect(() => {
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
    onClose();
  };

  // This render function is now cleaner as it only depends on the derived list and query states.
  const renderExerciseList = () => {
    if (isLoading) {
      return (
        <div className="flex-grow flex justify-center items-center p-8">
          <Spinner size="lg" />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex-grow flex flex-col justify-center items-center text-center p-8">
          <ExclamationTriangleIcon className="h-10 w-10 text-error mb-3" />
          <p className="font-semibold text-error">Could not load exercises.</p>
          <p className="text-sm text-brand-text-muted">
            Please try again later.
          </p>
        </div>
      );
    }
    if (filteredMasterExercises.length === 0) {
      return (
        <div className="flex-grow flex justify-center items-center text-center p-8">
          <div>
            <MagnifyingGlassIcon className="h-12 w-12 text-brand-primary/20 mx-auto mb-4" />
            <p className="font-semibold text-brand-text">No Exercises Found</p>
            <p className="text-sm text-brand-text-muted">
              Try a different search term.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar-thin -mr-2">
        <AnimatePresence>
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
                exit={{ opacity: 0, x: 10, transition: { duration: 0.15 } }}
                layout
                className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 flex justify-between items-center border
                ${
                  isAlreadyInProgram
                    ? "bg-brand-background/30 opacity-60 cursor-not-allowed border-transparent"
                    : "border-brand-border/10 hover:border-brand-primary/50 hover:bg-brand-primary/10"
                } ${
                  isCurrentlySelected
                    ? "!border-brand-primary !bg-brand-primary/10 ring-1 ring-brand-primary"
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
                    {exercise.category} &middot; {exercise.bodyPart}
                    {exercise.equipment &&
                      ` &middot; ${exercise.equipment.join(", ")}`}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {isAlreadyInProgram ? (
                    <span className="text-xs text-brand-text-muted/80 italic">
                      In Program
                    </span>
                  ) : (
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-200
                      ${
                        isCurrentlySelected
                          ? "bg-brand-primary text-white"
                          : "bg-brand-background/60 border border-brand-border/20 group-hover:border-brand-primary"
                      }`}
                    >
                      {isCurrentlySelected ? (
                        <CheckCircleIcon className="h-4 w-4" />
                      ) : (
                        <PlusIcon className="h-4 w-4 text-brand-text-muted group-hover:text-brand-primary" />
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Exercises"
      size="3xl"
      preventCloseOnBackdropClick
      panelClassName="dark:bg-brand-card/80 bg-brand-card-light/95 backdrop-blur-xl"
      hideDefaultFooter
      customFooter={
        <div className="flex justify-between items-center p-4 bg-brand-background/50 rounded-b-lg">
          <p className="text-sm text-brand-text-muted">
            {selectedExercises.length} selected
          </p>
          <div className="flex gap-3">
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
              {selectedExercises.length > 0 && `(${selectedExercises.length})`}
            </Button>
          </div>
        </div>
      }
    >
      <div className="p-4 space-y-4 flex flex-col h-[65vh] sm:h-[70vh]">
        <div className="relative flex-shrink-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-brand-text-muted" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises..."
            className="w-full appearance-none rounded-lg border bg-brand-background/50 py-2.5 pl-10 pr-4 text-base text-brand-text shadow-sm transition-colors placeholder:text-brand-text-muted/60 focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary"
            aria-label="Search exercises"
          />
        </div>
        {renderExerciseList()}
      </div>
    </Modal>
  );
};

export default ExerciseSelectionModal;
