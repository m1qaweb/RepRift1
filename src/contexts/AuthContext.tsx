// /src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { User, fakeLogin, fakeSignup, fakeLogout } from "../utils/fakeApi";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; pass: string }) => Promise<void>;
  signup: (details: {
    name: string;
    email: string;
    pass: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedProfileData: Partial<User>) => Promise<void>; // <<< NEW FUNCTION
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
        localStorage.removeItem("authUser");
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (credentials: { email: string; pass: string }) => {
    // ... (login logic - remains the same, but consider removing direct navigation from here)
    setLoading(true);
    try {
      const loggedInUser = await fakeLogin(credentials.email, credentials.pass);
      setUser(loggedInUser);
      localStorage.setItem("authUser", JSON.stringify(loggedInUser));
      // navigate("/dashboard"); // Often better to let the calling component handle navigation
    } catch (error) {
      /* ... */ throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (details: {
    name: string;
    email: string;
    pass: string;
  }) => {
    // ... (signup logic - remains the same, but consider removing direct navigation from here)
    setLoading(true);
    try {
      await fakeSignup(details.name, details.email, details.pass);
      // navigate("/login");
    } catch (error) {
      /* ... */ throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // ... (logout logic - navigation after state update is fine here)
    setLoading(true);
    try {
      await fakeLogout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("authUser");
      navigate("/login");
      setLoading(false);
    }
  };

  const updateUser = async (updatedProfileData: Partial<User>) => {
    if (!user) {
      console.error("Cannot update user: no user is currently logged in.");
      throw new Error("User not authenticated for update.");
    }
    try {
      const newUserData = { ...user, ...updatedProfileData };
      setUser(newUserData); // Update AuthContext's internal state
      localStorage.setItem("authUser", JSON.stringify(newUserData)); // Update localStorage
      console.log(
        "AuthContext: User updated and saved to localStorage",
        newUserData
      );
    } catch (error) {
      console.error("Failed to update user profile in AuthContext:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUser /* <<< ADDED HERE >>> */,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
