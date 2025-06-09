// /src/components/UI/Button.tsx
import React from "react";
import { motion } from "framer-motion";

// 1. Basic props for the custom button styling
interface CustomButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "black";
  size?: "sm" | "md" | "lg" | "icon";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// 2. Make the component's props generic and extendable
type PolymorphicButtonProps<C extends React.ElementType> = CustomButtonProps & {
  as?: C;
} & Omit<React.ComponentPropsWithoutRef<C>, keyof CustomButtonProps>;

// 3. Define the component with a generic, defaulting to 'button'
const Button = <C extends React.ElementType = "button">({
  as,
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading = false,
  className,
  disabled,
  ...restProps
}: PolymorphicButtonProps<C>) => {
  // 4. Use the "as" prop to determine the component, default to "button"
  const Component = as || "button";

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
      "bg-transparent text-brand-text-muted hover:bg-brand-primary/10 focus-visible:ring-brand-primary !shadow-none",
    outline:
      "bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10 focus-visible:ring-brand-primary",
  };

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-4 py-1.5 text-sm",
    lg: "px-5 py-2 text-base",
    icon: "p-2",
  };

  const whileHover =
    restProps.whileHover ??
    (disabled || isLoading ? {} : { scale: 1.03, y: -1 });
  const whileTap =
    restProps.whileTap ?? (disabled || isLoading ? {} : { scale: 0.97 });
  const transition = restProps.transition ?? {
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

  // 5. Create a motion version of the dynamic component
  const MotionComponent = motion(Component as React.ElementType);

  return (
    <MotionComponent
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition}
      {...restProps}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        className || ""
      }`}
      disabled={disabled || isLoading}
    >
      {motionButtonChildren}
    </MotionComponent>
  );
};

export default Button;
