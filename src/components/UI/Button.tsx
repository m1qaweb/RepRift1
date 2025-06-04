// /src/components/UI/Button.tsx
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

// Define your custom props for the button
interface CustomButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode; // Icons are ReactNode
  rightIcon?: React.ReactNode; // Icons are ReactNode
  isLoading?: boolean;
  // 'children' for this component will be the typical React.ReactNode,
  // which is simpler than MotionProps['children'].
  // We will pass this explicitly to motion.button.
  children?: React.ReactNode;
}

// Use HTMLMotionProps which correctly merges HTML attributes and MotionProps
// for the specified HTML element (e.g., 'button')
type ButtonProps = CustomButtonProps &
  Omit<HTMLMotionProps<"button">, keyof CustomButtonProps>;
// We Omit CustomButtonProps from HTMLMotionProps<'button'> to avoid collision if names are same
// e.g., if CustomButtonProps had 'style' and HTMLMotionProps also has 'style'.
// For children, HTMLMotionProps<'button'> also has a `children` prop that matches MotionProps.

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children, // This children is now React.ReactNode from CustomButtonProps
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      isLoading = false,
      className,
      whileHover,
      whileTap,
      transition,
      disabled, // explicitly get disabled from props
      ...restMotionProps // These are the remaining HTMLMotionProps
    },
    ref
  ) => {
    const baseStyles =
      "font-semibold rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-150 ease-in-out inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-light-primary text-white hover:bg-blue-600 dark:bg-dark-primary dark:hover:bg-blue-500 focus-visible:ring-light-primary dark:focus-visible:ring-dark-primary",
      secondary:
        "bg-light-secondary/20 text-light-secondary hover:bg-light-secondary/30 dark:bg-dark-secondary/20 dark:text-dark-secondary dark:hover:bg-dark-secondary/30 focus-visible:ring-light-secondary dark:focus-visible:ring-dark-secondary",
      danger:
        "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-500",
      ghost:
        "bg-transparent text-light-primary hover:bg-light-primary/10 dark:text-dark-primary dark:hover:bg-dark-primary/10 focus-visible:ring-light-primary dark:focus-visible:ring-dark-primary",
    };
    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const fmWhileHover = whileHover ?? {
      scale: disabled || isLoading ? 1 : 1.05,
    };
    const fmWhileTap = whileTap ?? {
      scale: disabled || isLoading ? 1 : 0.98,
    };
    const fmTransition = transition ?? {
      type: "spring",
      stiffness: 400,
      damping: 17,
    };

    // The children passed to motion.button must be consistent
    // We reconstruct the children here to include icons
    const motionButtonChildren = isLoading ? (
      <svg /* ... spinner SVG ... */>
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
    ) : (
      <>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    );

    return (
      <motion.button
        ref={ref} // Forward the ref
        whileHover={fmWhileHover}
        whileTap={fmWhileTap}
        transition={fmTransition}
        {...restMotionProps} // Spread other motion/HTML props
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

Button.displayName = "Button"; // Good practice for forwardRef components
export default Button;
