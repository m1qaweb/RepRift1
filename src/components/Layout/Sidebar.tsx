// /src/components/Layout/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  CogIcon,
  FolderIcon,
  HomeIcon,
  UserCircleIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "Programs", path: "/programs", icon: FolderIcon },
  { name: "Log Workout", path: "/log-workout", icon: DocumentTextIcon },
  { name: "History", path: "/history", icon: CalendarDaysIcon },
  { name: "Analytics", path: "/analytics", icon: ChartBarIcon },
  { name: "Profile", path: "/profile", icon: UserCircleIcon },
  { name: "Settings", path: "/settings", icon: CogIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 30,
        duration: 0.3,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 30,
        duration: 0.3,
      },
    },
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="sidebar-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            aria-hidden="true"
          />
          <motion.aside
            key="sidebar-panel"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 h-full w-64 sm:w-72
                       bg-brand-card text-brand-text
                       shadow-2xl z-40 p-5
                       overflow-y-auto custom-scrollbar-thin 
                       flex flex-col"
            aria-label="Sidebar"
          >
            <div className="mb-8 flex-shrink-0">
              <NavLink to="/" onClick={onClose} className="inline-block">
                <h2 className="text-2xl font-bold text-brand-primary hover:text-brand-primary/80 transition-colors">
                  RepRift
                </h2>
              </NavLink>
            </div>

            <nav className="flex-grow">
              <ul className="space-y-1.5">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center py-2.5 px-3 rounded-lg group transition-colors duration-150 ease-in-out
                           ${
                             isActive
                               ? "bg-brand-primary text-[var(--color-background)] shadow-sm"
                               : "text-brand-text hover:bg-brand-secondary/10 dark:hover:bg-brand-secondary/20"
                           }`
                        }
                      >
                        {({ isActive }) => {
                          const iconClassName = `
                       h-5 w-5 mr-3 flex-shrink-0 transition-colors duration-150 ease-in-out
                       ${
                         isActive
                           ? "text-[var(--color-background)]"
                           : "text-brand-text-muted group-hover:text-brand-primary"
                       }
                     `;
                          return (
                            <>
                              <IconComponent
                                className={iconClassName}
                                aria-hidden="true"
                              />
                              <span className="text-sm font-medium">
                                {item.name}
                              </span>
                            </>
                          );
                        }}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
