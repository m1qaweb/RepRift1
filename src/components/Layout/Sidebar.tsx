// /src/components/Layout/Sidebar.tsx – Responsive sidebar with slide-in/out animations.
// This is often integrated with the Navbar for mobile views, or as a persistent desktop sidebar.
// The example Navbar.tsx shows a full-screen mobile menu.
// If you need a separate, always-visible desktop sidebar, this component would be structured differently.

import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
// Example Icons (replace with your actual icon set e.g. Heroicons)
import {
  ChartBarIcon,
  CogIcon,
  FolderIcon,
  HomeIcon,
  UserCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void; // Typically for mobile overlay close
}

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "Programs", path: "/programs", icon: FolderIcon },
  { name: "Log Workout", path: "/log-workout", icon: DocumentTextIcon },
  { name: "History", path: "/history", icon: CalendarIcon },
  { name: "Analytics", path: "/analytics", icon: ChartBarIcon },
  { name: "Profile", path: "/profile", icon: UserCircleIcon },
  { name: "Settings", path: "/settings", icon: CogIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  // This example is more suited for a mobile overlay sidebar.
  // For a persistent desktop sidebar, `isOpen` might control width (collapsed/expanded).
  if (!isOpen) return null; // Simplified, controlled by parent (e.g., Navbar for mobile)

  return (
    <>
      {/* Overlay for mobile */}
      <motion.div
        className="fixed inset-0 bg-black/30 z-30 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate="open"
        exit="closed"
        className="fixed top-0 left-0 h-full w-64 bg-light-card dark:bg-dark-card shadow-xl z-40 p-5 overflow-y-auto"
        aria-label="Sidebar"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-light-primary dark:text-dark-primary">
            WorkoutApp
          </h2>
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-2">
                <NavLink
                  to={item.path}
                  onClick={onClose} // Close sidebar on mobile after navigation
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg group transition-colors duration-150
                    ${
                      isActive
                        ? "bg-light-primary/10 text-light-primary dark:bg-dark-primary/20 dark:text-dark-primary"
                        : "text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3 text-light-secondary dark:text-dark-secondary group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors" />
                  <span className="text-sm font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
