// /src/components/UI/Card.tsx - A simple card component with drop-shadow and hover lift animation.
import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  initial?: object;
  animate?: object;
  hoverEffect?: boolean; // Added prop to control hover effect
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  initial,
  animate,
  hoverEffect = true,
}) => {
  return (
    <motion.div
      className={`bg-light-card dark:bg-dark-card shadow-lg rounded-lg p-4 md:p-6 ${
        className || ""
      } ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      initial={initial || { opacity: 0, y: 20 }} // Default initial animation
      animate={animate || { opacity: 1, y: 0 }} // Default animate state
      transition={{ duration: 0.3, ease: "easeInOut" }}
      whileHover={
        hoverEffect && !onClick
          ? {
              y: -5,
              boxShadow:
                "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)",
            }
          : {}
      } // Lift effect
    >
      {children}
    </motion.div>
  );
};

export default Card;
