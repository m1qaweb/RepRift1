// /src/App.tsx - Root component with router and context providers.
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router, // Using BrowserRouter alias
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";

// Layout components
import Navbar from "./components/Layout/Navbar";
// import Sidebar from "./components/Layout/Sidebar"; // Keep commented if not used or integrated differently
import Footer from "./components/Layout/Footer";

// Page Components (Lazy Loaded)
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

// A simple loading spinner for lazy loaded components
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-light-primary dark:border-dark-primary"></div>
  </div>
);

// --- Components that need Router context CANNOT be defined outside a Router ancestor ---
// --- So, they need to be either children of <Router> or they need to be wrapped ---
// --- We will move ProtectedRoute and PageLayout into AppContent to ensure they are inside <Router> ---

// This component will contain everything that needs router context
const AppContent: React.FC = () => {
  // Hooks like useAuth and useLocation can be used here because AppContent will be inside Router and AuthProvider
  const { user, loading: authLoading } = useAuth(); // Moved useAuth here to use in ProtectedRoute
  const location = useLocation(); // Moved useLocation here for PageLayout and AppRoutes

  // Define ProtectedRoute here, so it has access to useAuth and useLocation
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // useAuth() is already called above
    // useLocation() is already called above

    if (authLoading) {
      return <PageLoader />;
    }
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  // Define PageLayout here, so it has access to useLocation
  const PageLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    // useLocation() is already called above for this component too
    return (
      <motion.div
        key={location.pathname} // Use the location from the AppContent scope
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

  // AppRoutes definition stays largely the same but now uses PageLayout and ProtectedRoute defined above
  const AppRoutesInner: React.FC = () => {
    // useLocation() from AppContent scope is available for AnimatePresence
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text transition-colors duration-300">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<PageLoader />}>
          <AppRoutesInner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

// Prop type for ProtectedRoute (can be here or imported)
interface ProtectedRouteProps {
  children: JSX.Element;
}

const App: React.FC = () => {
  return (
    <Router>
      {" "}
      {/* Router is the outermost component providing context */}
      <ThemeProvider>
        {" "}
        {/* ThemeProvider can be inside or outside AuthProvider based on preference */}
        <AuthProvider>
          {" "}
          {/* AuthProvider needs to be inside Router if it uses useNavigate */}
          <AppContent />{" "}
          {/* All components using router hooks are now descendants of Router */}
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
