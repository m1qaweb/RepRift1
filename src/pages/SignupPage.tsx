// /src/pages/SignupPage.tsx – Page for user registration.
import React from "react";
import SignupForm from "../components/Auth/SignupForm"; // The SignupForm component
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SignupPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-128px)]">
        <p>Loading...</p>
      </div>
    );
  }

  // If user is already logged in, redirect them from signup page
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {" "}
      {/* Adjust min-h */}
      <SignupForm />
    </div>
  );
};

export default SignupPage;
