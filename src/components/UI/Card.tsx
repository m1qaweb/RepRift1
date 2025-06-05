// /src/components/UI/Card.tsx
import React from "react";
import { motion, MotionProps } from "framer-motion";

interface CardProps extends Omit<MotionProps, "children"> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  initial,
  animate,
  whileHover,
  hoverEffect = true,
}) => {
  return (
    <motion.div
      className={`bg-brand-card shadow-brand rounded-lg p-4 md:p-6 ${
        className || ""
      } ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      initial={initial === false ? undefined : initial || { opacity: 0, y: 15 }}
      animate={animate === false ? undefined : animate || { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={
        hoverEffect && !onClick
          ? whileHover ?? {
              y: -4,
              boxShadow:
                "0 12px 20px -3px rgb(var(--color-primary-rgb) / 0.1), 0 6px 10px -4px rgb(var(--color-primary-rgb) / 0.08)",
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
};

export default Card;
