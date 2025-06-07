// /src/components/Programs/ProgramCard.tsx
import React from "react";
import Button from "../UI/Button";
import { motion } from "framer-motion";
import Card from "../UI/Card";
import { Program } from "../../types/data";
import {
  PencilSquareIcon,
  EyeIcon,
  BoltIcon,
  TrashIcon, // Import TrashIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface ProgramCardProps {
  program: Program;
  onEditClick?: (programId: string) => void;
  onDeleteClick?: (programId: string, programTitle: string) => void; // MODIFIED: Add onDeleteClick, pass title for confirmation
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onEditClick,
  onDeleteClick,
}) => {
  const cardHoverEffect = { y: -5 };
  const totalExercises = program.exercises.length;

  return (
    <Card
      className="flex flex-col justify-between h-full group transition-all duration-300 ease-in-out"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={cardHoverEffect}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/programs/${program.id}`} className="flex-grow min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-brand-primary group-hover:text-[rgb(var(--color-primary-rgb)/0.8)] transition-colors truncate pr-2">
              {program.title}
            </h3>
          </Link>
          {/* Action Icons Container */}
          <div className="flex items-center flex-shrink-0 space-x-1">
            {onEditClick && (
              <motion.button
                onClick={() => onEditClick(program.id)}
                className="p-1.5 text-brand-text-muted hover:text-brand-primary"
                whileHover={{ rotate: 10, scale: 1.15 }}
                title="Edit Program"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </motion.button>
            )}
            {onDeleteClick && ( // MODIFIED: Add Delete Button
              <motion.button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering link if card itself is a link area
                  onDeleteClick(program.id, program.title);
                }}
                className="p-1.5 text-brand-text-muted hover:text-error" // Error color for delete
                whileHover={{ scale: 1.15 }}
                title="Delete Program"
              >
                <TrashIcon className="h-5 w-5" />
              </motion.button>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-brand-text-muted mb-4 h-12 sm:h-16 overflow-hidden line-clamp-3 sm:line-clamp-4">
          {program.description || "No description provided."}
        </p>
        {totalExercises > 0 && (
          <div className="mb-4 text-xs">
            <div className="flex items-center text-brand-text-muted mb-1">
              <BoltIcon className="h-3.5 w-3.5 mr-1.5 text-brand-accent" />
              <span className="font-medium text-brand-text">
                {totalExercises}
              </span>{" "}
              Exercises
            </div>
            <ul className="list-none space-y-0.5 pl-5">
              {program.exercises.slice(0, 2).map((ex) => (
                <li key={ex.id} className="text-brand-text-muted truncate">
                  {ex.name}
                </li>
              ))}
              {program.exercises.length > 2 && (
                <li className="text-brand-text-muted/70 italic">...and more</li>
              )}
            </ul>
          </div>
        )}
        {totalExercises === 0 && (
          <p className="text-xs text-brand-text-muted/70 mb-4 italic">
            No exercises in this program yet.
          </p>
        )}
      </div>
      <div className="mt-auto pt-3 border-t border-brand-border/70 p-4">
        <Link to={`/programs/${program.id}`} className="block">
          <Button
            variant="ghost"
            size="sm"
            className="w-full group/button"
            rightIcon={
              <EyeIcon className="h-4 w-4 text-brand-primary/80 group-hover/button:text-brand-primary transition-colors" />
            }
          >
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};
export default ProgramCard;
