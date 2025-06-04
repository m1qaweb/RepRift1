// /src/contexts/AuthContext.tsx - Manages user authentication state.
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { User, fakeLogin, fakeSignup, fakeLogout } from "../utils/fakeApi"; // Assuming fakeApi provides these

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // To track initial auth state loading
  const navigate = useNavigate();

  useEffect(() => {
    // Check for persisted user session (e.g., from localStorage) on initial load
    const checkUserSession = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
        localStorage.removeItem("authUser"); // Clear corrupted data
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (credentials: { email: string; pass: string }) => {
    setLoading(true);
    try {
      const loggedInUser = await fakeLogin(credentials.email, credentials.pass);
      setUser(loggedInUser);
      localStorage.setItem("authUser", JSON.stringify(loggedInUser));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null); // Ensure user is null on failed login
      localStorage.removeItem("authUser");
      throw error; // Re-throw for the form to handle
    } finally {
      setLoading(false);
    }
  };

  const signup = async (details: {
    name: string;
    email: string;
    pass: string;
  }) => {
    setLoading(true);
    try {
      await fakeSignup(details.name, details.email, details.pass);
      navigate("/login"); // Redirect to login after successful signup
    } catch (error) {
      console.error("Signup failed:", error);
      throw error; // Re-throw for the form to handle
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fakeLogout();
      setUser(null);
      localStorage.removeItem("authUser");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if fakeLogout fails, we should clear local state
      setUser(null);
      localStorage.removeItem("authUser");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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
