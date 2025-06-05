// /src/components/AnimatedLogo.tsx
import React from "react";
import { motion } from "framer-motion";

interface AnimatedLogoProps {
  text: string;
  baseLetterClassName?: string;
  containerClassName?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  text,
  baseLetterClassName = "text-4xl sm:text-5xl font-bold text-brand-primary cursor-default",
  containerClassName = "",
}) => {
  const letters = Array.from(text);

  const logoContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.12,
      },
    },
  };

  const letterAnimVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: 30 + Math.random() * 40,
      x: (i - text.length / 2) * (8 + Math.random() * 15),
      scale: 0.3 + Math.random() * 0.4,
      rotateX:
        Math.random() > 0.5
          ? 70 + Math.random() * 40
          : -70 - Math.random() * 40,
      rotateY: (Math.random() - 0.5) * (120 + Math.random() * 60),
      filter: "blur(6px)",
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 10 + Math.random() * 6,
        stiffness: 90 + Math.random() * 60,
        delay: Math.random() * 0.25,
        opacity: { duration: 0.25, ease: "easeIn" },
        filter: { delay: 0.05, duration: 0.35, ease: "easeOut" },
      },
    }),
  };

  const letterHoverEffect = {
    y: -10,
    scale: 1.15,
    textShadow: "0px 0px 15px rgb(var(--color-primary-rgb)/0.7)",
    color: "rgb(var(--color-primary-rgb))",
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 9,
    },
  };

  return (
    <motion.div
      className={`flex justify-center items-baseline ${containerClassName}`}
      variants={logoContainerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}-${Math.random()}`}
          custom={index}
          variants={letterAnimVariants}
          whileHover={letterHoverEffect}
          className={`inline-block ${baseLetterClassName}`}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedLogo;
