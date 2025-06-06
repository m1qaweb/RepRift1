// /src/pages/InitialSetupPage.tsx (Fully Corrected)
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/UI/Button";
import InputField from "../components/Auth/InputField";
import Spinner from "../components/UI/Spinner";
import { getISOStringFromDate } from "../utils/dateUtils";
import { saveBodyMetric } from "../utils/API";
import { User } from "../utils/API";
import {
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

type SetupFormInputs = {
  heightCm: string;
  weightKg: string;
};

const InitialSetupPage: React.FC = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SetupFormInputs>({ mode: "onTouched" });

  useEffect(() => {
    if (!authLoading && (!user || user.initialSetupCompleted)) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // A simple helper function to calculate BMI.
  const calculateBMI = (weight: number, height: number): number | undefined => {
    if (height > 0)
      return parseFloat((weight / (height / 100) ** 2).toFixed(1));
    return undefined;
  };

  const onSubmit: SubmitHandler<SetupFormInputs> = async (data) => {
    if (!user) {
      setError("Session expired. Please log in again.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const height = parseFloat(data.heightCm);
    const weight = parseFloat(data.weightKg);

    if (isNaN(height) || height <= 0) {
      setError("Please enter a valid height.");
      setIsSubmitting(false);
      return;
    }
    if (isNaN(weight) || weight <= 0) {
      setError("Please enter a valid weight.");
      setIsSubmitting(false);
      return;
    }

    try {
      const profileUpdateData: Partial<User> = {
        heightCm: height,
        initialSetupCompleted: true,
      };
      await updateUser(profileUpdateData);

      // <<< THE FIX: Save a complete first metric including the calculated BMI >>>
      await saveBodyMetric({
        date: getISOStringFromDate(new Date()),
        weightKg: weight,
        bmi: calculateBMI(weight, height), // Calculate and save initial BMI
        userId: user.id,
      });

      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-background text-brand-text p-4">
        <Spinner size="lg" />
        <p className="mt-4 text-sm">Loading your session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-background via-brand-card/5 to-brand-accent/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-lg bg-brand-card p-8 sm:p-10 rounded-xl shadow-2xl border border-brand-border/20"
      >
        <div className="text-center mb-8">
          <ArrowTrendingUpIcon className="h-16 w-16 text-brand-primary mx-auto mb-4 opacity-80" />
          <h1 className="text-3xl font-bold text-brand-text mb-2">
            Welcome to RepRift!
          </h1>
          <p className="text-brand-text-muted text-sm">
            Let's get some basic information to personalize your experience and
            track your progress effectively.
          </p>
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-error/10 border border-error/30 text-error text-sm rounded-md"
            role="alert"
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            id="heightCm"
            label="Your Height"
            type="number"
            placeholder="e.g., 175"
            register={register("heightCm", {
              required: "Height is required.",
              min: { value: 50, message: "Height must be at least 50 cm." },
              max: { value: 300, message: "Height seems too high." },
              valueAsNumber: true,
            })}
            error={formErrors.heightCm?.message}
            leadingIcon={
              <InformationCircleIcon className="h-5 w-5 text-brand-text-muted" />
            }
          />
          <p className="-mt-4 text-xs text-brand-text-muted/80 pl-1">
            Enter your height in centimeters (cm).
          </p>
          <InputField
            id="weightKg"
            label="Your Current Weight"
            type="number"
            placeholder="e.g., 70.5"
            register={register("weightKg", {
              required: "Weight is required.",
              min: { value: 20, message: "Weight must be at least 20 kg." },
              max: { value: 300, message: "Weight seems too high." },
              valueAsNumber: true,
            })}
            error={formErrors.weightKg?.message}
            leadingIcon={
              <InformationCircleIcon className="h-5 w-5 text-brand-text-muted" />
            }
          />
          <p className="-mt-4 text-xs text-brand-text-muted/80 pl-1">
            Enter your weight in kilograms (kg).
          </p>
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting || authLoading}
              size="lg"
              rightIcon={<ArrowRightIcon className="h-5 w-5" />}
            >
              Save & Get Started
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default InitialSetupPage;
