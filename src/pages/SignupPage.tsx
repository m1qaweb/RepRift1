// /src/pages/SignupPage.tsx
import React from "react";
import { motion } from "framer-motion";
import SignupForm from "../components/Auth/SignupForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/UI/Spinner";
import AnimatedLogo from "../components/UI/AnimatedLogo";
const SignupPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-background text-brand-text p-4">
        <Spinner size="lg" />
        <p className="mt-4 text-sm">Initializing session...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <AnimatedLogo
            text="RepRift"
            baseLetterClassName="text-4xl sm:text-5xl font-bold text-brand-primary cursor-default"
          />
          <motion.p
            className="text-sm text-brand-text-muted mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.5 + 0.12 * "RepRift".length,
                duration: 0.4,
              },
            }}
          >
            Create your account to get started.
          </motion.p>
        </div>
        <SignupForm />
      </motion.div>
    </div>
  );
};

export default SignupPage;
