// /src/components/Layout/Footer.tsx – Sticky footer with subtle hover/fade animations on links.
import React from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const footerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  const linkHover = {
    opacity: 0.7,
    transition: { duration: 0.2 },
  };

  return (
    <motion.footer
      variants={footerVariants}
      initial="initial"
      animate="animate"
      className="bg-brand-card/50 border-t border-brand-border text-brand-muted text-sm"
    >
      <div className="container mx-auto px-4 py-6 text-center md:flex md:justify-between md:items-center">
        <p className="mb-2 md:mb-0">
          © {year} Workout Tracker App. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4">
          <motion.a
            href="/privacy-policy"
            className="hover:text-brand-primary"
            whileHover={linkHover}
          >
            Privacy Policy
          </motion.a>
          <motion.a
            href="/terms-of-service"
            className="hover:text-brand-primary"
            whileHover={linkHover}
          >
            Terms of Service
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
