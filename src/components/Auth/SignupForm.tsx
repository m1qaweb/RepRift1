// /src/components/Auth/SignupForm.tsx – User registration form with animated labels.
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../UI/Button";
import {
  // These are all used
  validateEmail,
  validatePassword,
  validateRequired,
} from "../../utils/validators"; // Assumes validators.ts is fixed to return string | true
import { Link } from "react-router-dom";

type Inputs = {
  name: string;
  email: string;
  pass: string; // Using "pass", normally "password"
  confirmPassword?: string;
};

// Assuming InputField component remains the same as you provided
const InputField: React.FC<{
  id: string;
  label: string;
  type: string;
  register: any; // This is the invocation like register("name", options)
  error?: string;
  placeholder?: string;
}> = ({ id, label, type, register, error, placeholder }) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...register} // Spread the register invocation
      placeholder={placeholder || label}
      className={`w-full px-3 py-2 border rounded-md bg-transparent
                  ${
                    error
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:border-light-primary dark:focus:border-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary"
                  }
                  text-light-text dark:text-dark-text`}
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

const SignupForm: React.FC = () => {
  const {
    register, // This is the main register function from useForm
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const { signup } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const passwordValue = watch("pass");

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-10 p-8 bg-light-card dark:bg-dark-card rounded-xl shadow-2xl"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-light-text dark:text-dark-text">
        Create Account
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
        <InputField
          id="name"
          label="Full Name"
          type="text"
          // Pass the invocation of register
          register={register("name", {
            validate: (value) => validateRequired(value, "Full Name"),
          })}
          error={errors.name?.message}
        />
        <InputField
          id="email"
          label="Email"
          type="email"
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
          register={register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) =>
              value === passwordValue || "Passwords do not match",
          })}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          isLoading={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-light-secondary dark:text-dark-secondary">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-light-primary dark:text-dark-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </motion.div>
  );
};

export default SignupForm;
