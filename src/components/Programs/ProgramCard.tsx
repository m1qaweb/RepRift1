// /src/components/Programs/ProgramCard.tsx
import React, { useState, memo } from "react";
import { motion } from "framer-motion";
import { Program } from "../../types/data";
import {
  PencilSquareIcon,
  TrashIcon,
  BoltIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Button from "../UI/Button";

interface ProgramCardProps {
  program: Program;
  onEditClick?: (programId: string) => void;
  onDeleteClick?: (programId: string, programTitle: string) => void;
}

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onEditClick,
  onDeleteClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const totalExercises = program.exercises?.length ?? 0;

  return (
    <motion.div
      variants={cardVariants}
      className="relative h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/programs/${program.id}`} className="block h-full">
        <div className="h-full bg-brand-card/50 dark:bg-brand-card/40 backdrop-blur-lg rounded-xl shadow-lg border border-brand-border/20 group transition-all duration-300 ease-in-out overflow-hidden hover:border-brand-primary/50 hover:shadow-brand-primary/10">
          <div className="relative p-5 flex flex-col h-full">
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-primary transition-colors duration-300 truncate">
                {program.title}
              </h3>
              <p className="text-sm text-brand-text-muted mt-2 h-10 overflow-hidden line-clamp-2">
                {program.description || "No description provided."}
              </p>

              <div className="mt-4 text-xs font-medium text-brand-text-muted flex items-center">
                <BoltIcon className="h-4 w-4 mr-1.5 text-brand-accent/80" />
                <span>
                  {totalExercises} Exercise{totalExercises !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border/20 flex items-center justify-between text-sm font-medium">
              <span className="text-brand-primary">View Program</span>
              <ChevronRightIcon className="h-5 w-5 text-brand-primary/70 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
      <motion.div
        className="absolute top-3 right-3 flex items-center space-x-1"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {onEditClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              onEditClick(program.id);
            }}
            className="bg-brand-background/50 hover:bg-brand-background/80 text-brand-text-muted hover:text-brand-primary"
            title="Edit Program"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </Button>
        )}
        {onDeleteClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              onDeleteClick(program.id, program.title);
            }}
            className="bg-brand-background/50 hover:bg-brand-background/80 text-brand-text-muted hover:text-error"
            aria-label={`Delete program: ${program.title}`}
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};
export default React.memo(ProgramCard);
