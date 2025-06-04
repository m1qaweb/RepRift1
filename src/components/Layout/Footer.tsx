// /src/components/Layout/Footer.tsx – Sticky footer with subtle hover/fade animations on links.
import React from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const footerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }, // Slight delay for content load
  };

  const linkHover = {
    opacity: 0.7,
    transition: { duration: 0.2 },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="initial"
      animate="animate" // Animate when it mounts (usually with the page)
      className="bg-light-card/50 dark:bg-dark-card/50 border-t border-light-border dark:border-dark-border text-light-secondary dark:text-dark-secondary text-sm"
    >
      <div className="container mx-auto px-4 py-6 text-center md:flex md:justify-between md:items-center">
        <p className="mb-2 md:mb-0">
          © {year} Workout Tracker App. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4">
          <motion.a
            href="/privacy-policy" // Replace with actual links or Link components
            className="hover:text-light-primary dark:hover:text-dark-primary"
            whileHover={linkHover}
          >
            Privacy Policy
          </motion.a>
          <motion.a
            href="/terms-of-service"
            className="hover:text-light-primary dark:hover:text-dark-primary"
            whileHover={linkHover}
          >
            Terms of Service
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};
// Note: For a "sticky" footer that stays at the bottom of the viewport even if content is short,
// the parent layout (e.g., in App.tsx) needs to be structured correctly (e.g., using flexbox: flex flex-col min-h-screen, with main content area having flex-grow).
// This is already set up in the App.tsx template.

export default Footer;
