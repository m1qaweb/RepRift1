// /src/components/Layout/Navbar.tsx (Key Theming Adjustments)
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "../UI/Button";
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// NavItem Component (retained from previous version)
interface NavItemProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}
const NavItem: React.FC<NavItemProps> = ({ to, children, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative px-2.5 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-150 block
         whitespace-nowrap 
         ${
           isActive
             ? "text-brand-primary"
             : "text-brand-text hover:text-brand-primary"
         }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && (
            <motion.div
              className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-brand-primary"
              layoutId="underline-navbar-shared"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};

// getPageTitle (retained from previous version)
const getPageTitle = (pathname: string): string => {
  const cleanPath = pathname === "/" ? pathname : pathname.replace(/\/$/, "");
  if (
    cleanPath.startsWith("/programs/") &&
    cleanPath.split("/").length > 2 &&
    cleanPath !== "/programs"
  ) {
    return "Program Details";
  }
  if (cleanPath.startsWith("/log-workout")) return "Log Workout";
  switch (cleanPath) {
    case "/":
      return "Dashboard";
    case "/dashboard":
      return "Dashboard";
    case "/programs":
      return "Programs";
    case "/history":
      return "History";
    case "/analytics":
      return "Analytics";
    case "/ffmi-calculator":
      return "FFMI Calculator";
    case "/profile":
      return "My Account"; // Updated for consistency
    case "/login":
      return "Login";
    case "/signup":
      return "Sign Up";
    default:
      const pathSegments = cleanPath.substring(1).split("/");
      const firstSegment = pathSegments[0].replace(/-/g, " ");
      return (
        firstSegment
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") || "Page"
      );
  }
};

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // useNavigate and useLocation are not strictly needed at this top level after refactor,
  // but if you add more direct navigation calls, they are useful.
  // For NavLink and Link, they handle navigation context internally.
  const location = useLocation();
  const [currentPageTitle, setCurrentPageTitle] = useState<string>(
    getPageTitle(location.pathname)
  );

  useEffect(() => {
    setCurrentPageTitle(getPageTitle(location.pathname));
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false); // Also ensure mobile menu closes on logout
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navLinksDefinition = user
    ? [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/programs", label: "Programs" },
        { path: "/history", label: "History" },
        { path: "/analytics", label: "Analytics" },
        // { path: "/ffmi-calculator", label: "FFMI Calc" }, // Optionally keep or move to profile/tools
      ]
    : [];

  const appLogoTextShadow = `0px 1px 3px rgb(var(--color-primary-rgb)/0.15)`;

  // Fallback avatar generator (similar to ProfilePage but for smaller size)
  const generateNavbarAvatarUrl = (name?: string, size: number = 32) => {
    const initial = name
      ? encodeURIComponent(name.charAt(0).toUpperCase())
      : "U";
    return `https://ui-avatars.com/api/?name=${initial}&background=rgb(var(--color-primary-rgb))&color=rgb(var(--color-background-rgb))&size=${size}&font-size=0.45&bold=true&format=svg`;
  };

  return (
    <nav className="sticky top-0 z-[60] bg-brand-card/85 dark:bg-brand-card/90 backdrop-blur-xl shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-grow min-w-0">
            <Link to={user ? "/dashboard" : "/"} className="flex-shrink-0">
              <motion.h1
                className="text-xl sm:text-2xl font-bold text-brand-primary"
                whileHover={{ scale: 1.03, textShadow: appLogoTextShadow }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
              >
                Rep<span className="text-brand-text">Rift</span>
              </motion.h1>
            </Link>
            {user && (
              <div className="hidden sm:flex items-center ml-2 sm:ml-3 overflow-hidden">
                <ChevronRightIcon className="h-4 w-4 text-brand-text-muted flex-shrink-0" />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={currentPageTitle}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.2, ease: "circOut" }}
                    className="ml-1.5 sm:ml-2 text-sm font-medium text-brand-text truncate max-w-[100px] md:max-w-[150px] lg:max-w-[200px]"
                    title={currentPageTitle}
                  >
                    {currentPageTitle}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex items-baseline space-x-1 lg:space-x-2 ml-4">
              {navLinksDefinition.map((link) => (
                <NavItem key={link.path} to={link.path}>
                  {link.label}
                </NavItem>
              ))}
            </div>

            <div className="flex items-center flex-shrink-0 ml-2 sm:ml-3">
              <motion.button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full text-brand-text-muted hover:bg-brand-secondary/10 hover:text-brand-primary focus-visible:text-brand-primary transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
                aria-label={
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                whileHover={{
                  scale: 1.12,
                  rotate: theme === "dark" ? -25 : 25,
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {theme === "dark" ? (
                  <SunIcon className="h-5 w-5 text-brand-text" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-brand-text" />
                )}
              </motion.button>

              {user ? (
                <div className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center p-1 rounded-full hover:bg-brand-secondary/10 transition-colors group"
                    title="My Account"
                  >
                    {user.avatarUrl ? (
                      <motion.img
                        key={user.avatarUrl} // Key to force re-render if URL changes
                        src={user.avatarUrl}
                        alt={user.name || "User Avatar"}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-transparent group-hover:border-brand-primary transition-colors"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    ) : (
                      <img // Fallback using ui-avatars
                        src={generateNavbarAvatarUrl(user.name, 32)}
                        alt={user.name || "User Avatar"}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                      />
                    )}
                    {user.name && (
                      <span className="ml-1.5 hidden lg:inline text-xs font-medium text-brand-text group-hover:text-brand-primary transition-colors">
                        {user.name.split(" ")[0]} {/* Display first name */}
                      </span>
                    )}
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleLogout}
                    className="!py-1.5 !px-2.5" // Custom padding
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                    {/* Removed text for cleaner look, icon is clear */}
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-1.5 ml-2">
                  <Link to="/login">
                    {" "}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-brand-text-muted hover:text-brand-primary"
                    >
                      Login
                    </Button>{" "}
                  </Link>
                  <Link to="/signup">
                    {" "}
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>{" "}
                  </Link>
                </div>
              )}

              {user && ( // Mobile menu toggle button
                <div className="ml-1 sm:ml-2 md:hidden">
                  <button
                    onClick={toggleMobileMenu}
                    className="p-1.5 rounded-md text-brand-text hover:bg-brand-secondary/10 hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary"
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu"
                  >
                    <span className="sr-only">Open main menu</span>
                    <AnimatePresence initial={false} mode="sync">
                      {mobileMenuOpen ? (
                        <motion.div
                          key="xmark"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <XMarkIcon className="block h-6 w-6" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="bars3"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Bars3Icon className="block h-6 w-6" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && user && (
          <motion.div
            id="mobile-menu"
            className="md:hidden fixed inset-x-0 top-16 z-[55] bg-brand-card border-t border-brand-border shadow-lg overflow-y-auto max-h-[calc(100vh-4rem)] custom-scrollbar-thin"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{
              type: "tween",
              ease: [0.4, 0, 0.2, 1],
              duration: 0.35,
            }}
          >
            <div className="px-4 py-3 border-b border-brand-border/50">
              <span className="text-sm font-medium text-brand-text">
                {currentPageTitle}
              </span>
            </div>

            <div className="px-2 py-3 space-y-1 sm:px-3">
              {navLinksDefinition.map((link) => (
                <NavItem
                  key={`mobile-${link.path}`}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="block px-3 py-2.5 text-base">
                    {link.label}
                  </span>
                </NavItem>
              ))}
            </div>

            <div className="pt-4 pb-3 border-t border-brand-border">
              <Link // Make the entire user block clickable to go to profile
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-5 mb-3 hover:bg-brand-secondary/10 dark:hover:bg-brand-secondary/20 rounded-md py-2 mx-2 transition-colors"
              >
                {user.avatarUrl ? (
                  <motion.img
                    key={user.avatarUrl}
                    src={user.avatarUrl}
                    alt={user.name || "User Avatar"}
                    className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  />
                ) : (
                  <img // Fallback for mobile
                    src={generateNavbarAvatarUrl(user.name, 40)}
                    alt={user.name || "User Avatar"}
                    className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <div className="text-base font-medium text-brand-text truncate">
                    {user.name || "User"}
                  </div>
                  <div className="text-sm font-medium text-brand-text-muted truncate">
                    {user.email}
                  </div>
                </div>
              </Link>

              <div className="px-2 space-y-1">
                {/* Removed settings link from here, profile now contains settings */}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-3 text-base font-medium text-brand-text hover:bg-brand-secondary/10 dark:hover:bg-brand-secondary/20 rounded-md transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
