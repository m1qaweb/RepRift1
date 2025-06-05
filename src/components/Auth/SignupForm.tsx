// /src/components/Auth/SignupForm.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../UI/Button";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "../../utils/validators";
import { Link } from "react-router-dom";
import InputField from "./InputField";
import {
  UserIcon,
  AtSymbolIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

type Inputs = {
  name: string;
  email: string;
  pass: string;
  confirmPassword?: string;
};

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ mode: "onTouched" });
  const { signup } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const passwordValue = watch("pass", "");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setApiError(null);
    if (data.pass !== data.confirmPassword) {
      setApiError("Passwords do not match.");
      return;
    }
    try {
      await signup({ name: data.name, email: data.email, pass: data.pass });
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again."
      );
    }
  };

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
        Create Account
      </h2>
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-md"
          role="alert"
        >
          {apiError}
        </motion.div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
        <InputField
          id="name"
          label="Full Name"
          type="text"
          autoComplete="name"
          leadingIcon={<UserIcon />}
          register={register("name", {
            validate: (value) => validateRequired(value, "Full Name"),
          })}
          error={errors.name?.message}
        />
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
          autoComplete="new-password"
          leadingIcon={<LockClosedIcon />}
          register={register("pass", {
            required: "Password is required",
            validate: validatePassword,
          })}
          error={errors.pass?.message}
        />
        <InputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          leadingIcon={<LockClosedIcon />}
          register={register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) =>
              value === passwordValue || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />
        <div className="pt-5">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
            size="lg"
          >
            Sign Up
          </Button>
        </div>
      </form>
      <p className="mt-10 text-center text-sm text-brand-text-muted">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-brand-primary hover:text-brand-primary/80 hover:underline"
        >
          Login
        </Link>
      </p>
    </motion.div>
  );
};

export default SignupForm;
