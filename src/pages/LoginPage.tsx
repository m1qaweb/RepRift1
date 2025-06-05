// /src/pages/LoginPage.tsx
import React from "react";
import { motion } from "framer-motion";
import LoginForm from "../components/Auth/LoginForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/UI/Spinner";
import AnimatedLogo from "../components/UI/AnimatedLogo";

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();

  const pageContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

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
    <div
      className="min-h-screen flex flex-col items-center justify-center 
                   bg-gradient-to-br from-brand-background via-brand-background to-[rgb(var(--color-primary-rgb)/0.05)] 
                   p-4 overflow-hidden"
    >
      <motion.div
        variants={pageContainerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <AnimatedLogo text="RepRift" />
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
            Log in to continue your journey.
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <LoginForm />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
