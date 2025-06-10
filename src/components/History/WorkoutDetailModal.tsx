import React from "react";
import { WorkoutLog } from "../../types/data";
import Modal from "../UI/Modal";
import { formatDate as formatDateUtil } from "../../utils/dateUtils";
import {
  ClockIcon,
  FireIcon,
  ListBulletIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: WorkoutLog | null;
}

const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  isOpen,
  onClose,
  log,
}) => {
  if (!log) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Workout Details">
      <div className="space-y-4 text-brand-text">
        <div className="text-center -mt-2">
          <h4 className="text-lg font-bold text-brand-primary">
            {log.programTitle}
          </h4>
          <p className="text-sm text-brand-text-muted">
            {formatDateUtil(log.date, "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        <div className="flex justify-center items-center gap-6 text-sm bg-brand-background/40 p-3 rounded-lg">
          {log.durationMinutes && (
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-5 w-5 text-brand-text-muted" />{" "}
              {log.durationMinutes} min
            </span>
          )}
          {log.caloriesBurned && (
            <span className="flex items-center gap-1.5">
              <FireIcon className="h-5 w-5 text-brand-text-muted" />{" "}
              {log.caloriesBurned} kcal
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h5 className="font-semibold flex items-center gap-2 text-sm text-brand-text-muted">
            <ListBulletIcon className="h-5 w-5" />
            Completed Exercises
          </h5>
          {log.completedExercises.length > 0 ? (
            <div className="max-h-60 overflow-y-auto pr-2 bg-brand-background/40 rounded-lg p-3 space-y-2">
              {log.completedExercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="text-sm flex justify-between items-center"
                >
                  <span>{ex.exerciseName}</span>
                  <span className="font-medium bg-brand-background/50 px-2 py-0.5 rounded">
                    {ex.sets.filter((s) => s.completed).length}/{ex.sets.length}{" "}
                    sets
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-brand-text-muted italic text-sm p-3 bg-brand-background/40 rounded-lg">
              No specific exercises were tracked for this session.
            </p>
          )}
        </div>

        {log.notes && (
          <div className="space-y-2">
            <h5 className="font-semibold flex items-center gap-2 text-sm text-brand-text-muted">
              <PencilIcon className="h-5 w-5" />
              Notes
            </h5>
            <p className="text-sm bg-brand-background/40 rounded-lg p-3 text-brand-text-muted">
              {log.notes}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WorkoutDetailModal;
