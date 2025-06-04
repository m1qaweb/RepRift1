// /src/components/Programs/ProgramCard.tsx – Displays a program's summary.
import React from "react";
import { motion } from "framer-motion";
import Card from "../UI/Card"; // Your UI Card
import { Program } from "../../utils/fakeApi";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface ProgramCardProps {
  program: Program;
  onEditClick?: (programId: string) => void; // For handling edit action
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onEditClick }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <motion.div variants={cardVariants}>
      {" "}
      {/* Animation handled by parent list if staggered */}
      <Card className="flex flex-col justify-between h-full hover:shadow-lg transition-shadow">
        <div>
          <div className="flex justify-between items-start mb-2">
            <Link to={`/programs/${program.id}`}>
              <h3 className="text-xl font-semibold text-light-primary dark:text-dark-primary hover:underline">
                {program.title}
              </h3>
            </Link>
            {onEditClick && (
              <motion.button
                onClick={() => onEditClick(program.id)}
                className="p-1 text-light-secondary dark:text-dark-secondary hover:text-light-primary dark:hover:text-dark-primary"
                whileHover={{ rotate: 15, scale: 1.1 }}
                title="Edit Program"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </motion.button>
            )}
          </div>
          <p className="text-sm text-light-secondary dark:text-dark-secondary mb-3 h-16 overflow-hidden">
            {program.description.length > 100
              ? program.description.substring(0, 97) + "..."
              : program.description}
          </p>
          {program.exercises && program.exercises.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-light-text dark:text-dark-text mb-1">
                Exercises Preview:
              </p>
              <ul className="list-disc list-inside text-xs text-light-secondary dark:text-dark-secondary space-y-0.5">
                {program.exercises.slice(0, 2).map((ex) => (
                  <li key={ex.id}>{ex.name}</li>
                ))}
                {program.exercises.length > 2 && <li>...and more</li>}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-auto pt-3 border-t border-light-border dark:border-dark-border">
          <Link to={`/programs/${program.id}`}>
            <motion.button
              className="w-full text-sm font-medium text-light-primary dark:text-dark-primary hover:underline"
              whileHover={{ x: 2 }}
            >
              View Details →
            </motion.button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProgramCard;
