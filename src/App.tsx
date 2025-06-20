// /src/App.tsx - Root component with router and context providers.
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WorkoutProvider } from "./contexts/WorkoutContext";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // These are some sensible defaults for production apps
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      refetchOnWindowFocus: false, // Prevents refetching just because a user clicks away and back
      retry: 2, // If a query fails, retry it 2 more times
    },
  },
});

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProgramsListPage = lazy(() => import("./pages/ProgramsListPage"));
const ProgramDetailPage = lazy(() => import("./pages/ProgramDetailPage"));
const WorkoutLogPage = lazy(() => import("./pages/WorkoutLogPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const FFMICalculatorPage = lazy(() => import("./pages/FFMICalculatorPage"));
const InitialSetupPage = lazy(() => import("./pages/InitialSetupPage"));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-border"></div>
  </div>
);

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <PageLoader />;
  }

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (
      user &&
      !user.initialSetupCompleted &&
      location.pathname !== "/initial-setup"
    ) {
      return (
        <Navigate to="/initial-setup" state={{ from: location }} replace />
      );
    }
    return children;
  };

  const PageLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    return (
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-grow"
      >
        {children}
      </motion.div>
    );
  };

  const AppRoutesInner: React.FC = () => {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={
              <PageLayout>
                <LoginPage />
              </PageLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <PageLayout>
                <SignupPage />
              </PageLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <DashboardPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/programs"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <ProgramsListPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/programs/:programId"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <ProgramDetailPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/log-workout"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <WorkoutLogPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <HistoryPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <AnalyticsPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <ProfilePage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <SettingsPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ffmi-calculator"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <FFMICalculatorPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/initial-setup"
            element={
              <ProtectedRoute>
                <PageLayout>
                  <InitialSetupPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-background text-brand-text transition-colors duration-300">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Suspense fallback={<PageLoader />}>
          <AppRoutesInner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

interface ProtectedRouteProps {
  children: JSX.Element;
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <WorkoutProvider>
            <AppContent />
          </WorkoutProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
