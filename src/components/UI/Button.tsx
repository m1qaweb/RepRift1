// /src/components/UI/Button.tsx
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CustomButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "black";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
}

type ButtonProps = CustomButtonProps &
  Omit<HTMLMotionProps<"button">, keyof CustomButtonProps>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      isLoading = false,
      className,
      whileHover,
      whileTap,
      transition,
      disabled,
      ...restMotionProps
    },
    ref
  ) => {
    const baseStyles =
      "font-semibold rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-brand-background transition-colors duration-150 ease-in-out inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed";

    const primaryButtonForcedTextColor = "text-white";
    const dangerButtonTextColor = "text-white";

    const variantStyles = {
      primary: `bg-black ${primaryButtonForcedTextColor} hover:bg-gray-800 focus-visible:ring-brand-primary`,

      black: `bg-black ${primaryButtonForcedTextColor} hover:bg-gray-800 focus-visible:ring-brand-primary dark:hover:bg-gray-700`,

      secondary:
        "bg-brand-secondary/20 text-brand-secondary hover:bg-brand-secondary/30 focus-visible:ring-brand-secondary",
      danger: `bg-error ${dangerButtonTextColor} hover:bg-error/85 focus-visible:ring-error`,
      ghost:
        "bg-transparent text-brand-primary hover:bg-brand-primary/10 focus-visible:ring-brand-primary",
      outline:
        "bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10 focus-visible:ring-brand-primary",
    };

    const sizeStyles = {
      sm: "px-2.5 py-1 text-xs",
      md: "px-4 py-1.5 text-sm",
      lg: "px-5 py-2 text-base",
    };

    const fmWhileHover =
      whileHover ?? (disabled || isLoading ? {} : { scale: 1.03, y: -1 });
    const fmWhileTap =
      whileTap ?? (disabled || isLoading ? {} : { scale: 0.97 });
    const fmTransition = transition ?? {
      type: "spring",
      stiffness: 400,
      damping: 17,
    };

    let spinnerColorClass = "text-brand-primary";

    if (variant === "primary" || variant === "black")
      spinnerColorClass = primaryButtonForcedTextColor;
    if (variant === "danger") spinnerColorClass = dangerButtonTextColor;

    if (variant === "secondary") spinnerColorClass = "text-brand-secondary";

    const motionButtonChildren = isLoading ? (
      <div className="animate-spin">
        <svg
          className={`h-5 w-5 ${spinnerColorClass}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    ) : (
      <>
        {leftIcon && <span className="mr-2 -ml-0.5">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2 -mr-0.5">{rightIcon}</span>}
      </>
    );

    return (
      <motion.button
        ref={ref}
        whileHover={fmWhileHover}
        whileTap={fmWhileTap}
        transition={fmTransition}
        {...restMotionProps}
        className={`${baseStyles} ${variantStyles[variant]} ${
          sizeStyles[size]
        } ${className || ""}`}
        disabled={disabled || isLoading}
      >
        {motionButtonChildren}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
