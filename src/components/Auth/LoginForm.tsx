// /src/components/Auth/LoginForm.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../UI/Button";
import { Link } from "react-router-dom";
import InputField from "./InputField";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { validateEmail } from "../../utils/validators";

type Inputs = {
  email: string;
  pass: string;
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: rhfIsSubmitting }, // Renamed
  } = useForm<Inputs>({ mode: "onTouched" });

  const { login, loading: authContextLoading } = useAuth(); // Destructure context loading
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setApiError(null);
    try {
      await login(data);
      // AuthContext.login handles navigation to /dashboard on success
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials and try again."
      );
    }
  };

  const isLoading = rhfIsSubmitting || authContextLoading; // Combined loading state

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-md mx-auto p-6 sm:p-8
                 bg-brand-card/80 dark:bg-brand-card/70
                 backdrop-blur-lg
                 rounded-2xl
                 border border-brand-border/30
                 shadow-xl dark:shadow-[0_10px_30px_-10px_rgb(var(--color-primary-rgb)/0.25)]"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-brand-text">
        Welcome Back
      </h2>
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-3 bg-error/10 border border-error/30 text-error text-sm rounded-md" // Text size sm
          role="alert"
        >
          {apiError}
        </motion.div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
        <InputField
          id="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          leadingIcon={<AtSymbolIcon />}
          register={register("email", {
            required: "Email is required",
            validate: validateEmail,
          })}
          error={errors.email?.message}
        />
        <InputField
          id="pass"
          label="Password"
          type="password"
          autoComplete="current-password"
          leadingIcon={<LockClosedIcon />}
          register={register("pass", { required: "Password is required" })}
          error={errors.pass?.message}
        />
        <div className="pt-5">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading} // Use combined loading state
            size="lg"
          >
            Login
          </Button>
        </div>
      </form>
      <p className="mt-10 text-center text-sm text-brand-text-muted">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-brand-primary hover:text-brand-primary/80 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;
