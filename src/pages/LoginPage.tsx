// /src/pages/LoginPage.tsx – Page for user login.
import React from "react";
import LoginForm from "../components/Auth/LoginForm"; // The LoginForm component
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p>Loading...</p>
      </div>
    ); // 128px for navbar and footer approx
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {" "}
      {/* Adjust min-h for nav/footer */}
      <LoginForm />
    </div>
  );
};

export default LoginPage;
