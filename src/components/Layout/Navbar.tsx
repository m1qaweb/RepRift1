// /src/components/Layout/Navbar.tsx – responsive navbar with Framer Motion animations
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "../UI/Button"; // Your Button component
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface NavItemProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void; // For mobile menu close
}

const NavItem: React.FC<NavItemProps> = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 
       ${
         isActive
           ? "text-light-primary dark:text-dark-primary"
           : "text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary"
       }`
    }
  >
    {({ isActive }) => (
      <>
        {children}
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-light-primary dark:bg-dark-primary"
            layoutId="underline" // layoutId enables shared layout animation
            initial={false}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
      </>
    )}
  </NavLink>
);

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    // Navigation handled by AuthContext or redirect here if necessary
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navLinks = user
    ? [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/programs", label: "Programs" },
        { path: "/log-workout", label: "Log Workout" },
        { path: "/history", label: "History" },
        { path: "/analytics", label: "Analytics" },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-40 bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Nav */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <motion.h1
                className="text-2xl font-bold text-light-primary dark:text-dark-primary"
                whileHover={{
                  scale: 1.05,
                  textShadow: "0px 0px 4px rgba(96, 165, 250, 0.5)",
                }}
              >
                Workout
                <span className="text-light-text dark:text-dark-text">App</span>
              </motion.h1>{" "}
              {/* Replace with actual logo if available */}
            </Link>
            <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-4">
              {navLinks.map((link) => (
                <NavItem key={link.path} to={link.path}>
                  {link.label}
                </NavItem>
              ))}
            </div>
          </div>

          {/* Right side icons and User menu */}
          <div className="flex items-center">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              whileHover={{ scale: 1.1, rotate: theme === "dark" ? -15 : 15 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === "dark" ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-slate-700" />
              )}
            </motion.button>

            {user ? (
              <div className="ml-3 relative">
                {/* This could be a dropdown menu for profile, settings, logout */}
                <Button
                  variant="ghost"
                  onClick={() => navigate("/profile")}
                  className="mr-2"
                  leftIcon={<UserCircleIcon className="h-5 w-5" />}
                >
                  Profile
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2 ml-4">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </div>
            )}
            {/* Mobile menu button */}
            <div className="ml-2 md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-primary"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu (uses Sidebar.tsx animation style) */}
      <AnimatePresence>
        {mobileMenuOpen &&
          user && ( // Show menu only if user logged in and menu open
            <motion.div
              id="mobile-menu"
              className="md:hidden fixed inset-0 z-30 pt-16 bg-light-card dark:bg-dark-card shadow-lg" // pt-16 to offset navbar height
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <NavItem
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="block px-3 py-2">{link.label}</span>
                  </NavItem>
                ))}
              </div>
              {user && (
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center px-5">
                    <UserCircleIcon className="h-8 w-8 text-light-secondary dark:text-dark-secondary mr-3" />
                    <div>
                      <div className="text-base font-medium text-light-text dark:text-dark-text">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-light-secondary dark:text-dark-secondary">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Your Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
