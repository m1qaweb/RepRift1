// /src/components/Auth/LoginForm.tsx – User login form with animated labels.
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../UI/Button"; // Your Button component
import { Link } from "react-router-dom";

type Inputs = {
  email: string;
  pass: string; // Using "pass" as in AuthContext, normally "password"
};

const FloatingLabelInput: React.FC<{
  id: string;
  label: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any; // from react-hook-form
  error?: string;
  isFocused: boolean;
  value: string;
  onFocus: () => void;
  onBlur: () => void;
}> = ({
  id,
  label,
  type,
  register: rhfRegister, // Renamed to avoid conflict with local register if any
  error,
  isFocused,
  value,
  onFocus,
  onBlur,
}) => {
  const labelVariants = {
    unfocused: {
      y: value ? -20 : 0,
      scale: value ? 0.85 : 1,
      opacity: value ? 1 : 0.7,
      color: error
        ? "#EF4444"
        : value
        ? "rgb(var(--color-text-primary))"
        : "rgb(var(--color-text-secondary))",
    },
    focused: {
      y: -20,
      scale: 0.85,
      opacity: 1,
      color: error ? "#EF4444" : "rgb(var(--color-primary))",
    },
  };
  const isFilled = value && value.length > 0;

  return (
    <div className="relative mb-6">
      <motion.label
        htmlFor={id}
        className="absolute left-3 origin-top-left pointer-events-none"
        variants={labelVariants}
        initial={false} // Start from current state based on `isFocused` or `isFilled`
        animate={isFocused || isFilled ? "focused" : "unfocused"}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          transformOrigin: "0 0",
          top: "0.75rem",
        }}
      >
        {label}
      </motion.label>
      <input
        id={id}
        type={type}
        {...rhfRegister(id)} // Use renamed prop
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full px-3 pt-5 pb-2 border rounded-md bg-transparent appearance-none
                    ${
                      error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:border-light-primary dark:focus:border-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary"
                    }
                    text-light-text dark:text-dark-text placeholder-transparent`}
        placeholder={label}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

const LoginForm: React.FC = () => {
  const {
    register, // This is the hook from useForm
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const emailValue = watch("email", "");
  const passwordValue = watch("pass", "");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setApiError(null);
    try {
      await login(data);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-10 p-8 bg-light-card dark:bg-dark-card rounded-xl shadow-2xl"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-light-text dark:text-dark-text">
        Login
      </h2>
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"
          role="alert"
        >
          {apiError}
        </motion.div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FloatingLabelInput
          id="email"
          label="Email"
          type="email"
          register={register} // Pass the register function from useForm
          error={errors.email?.message}
          isFocused={focusedField === "email"}
          value={emailValue}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
        />

        <FloatingLabelInput
          id="pass"
          label="Password"
          type="password"
          register={register} // Pass the register function from useForm
          error={errors.pass?.message}
          isFocused={focusedField === "pass"}
          value={passwordValue}
          onFocus={() => setFocusedField("pass")}
          onBlur={() => setFocusedField(null)}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          isLoading={isSubmitting}
        >
          Login
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-light-secondary dark:text-dark-secondary">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-light-primary dark:text-dark-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;
