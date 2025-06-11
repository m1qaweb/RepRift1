import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  title?: string;
  actions?: React.ReactNode;
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

/**
 * A modern glass-morphism card with subtle blur, gradient glow and hover lift.
 */
const GlassCard: React.FC<GlassCardProps> = ({
  title,
  actions,
  children,
  className = "",
  fullHeight = false,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 40px -12px rgba(0,0,0,0.35)" }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-lg ${
        fullHeight ? "h-full" : ""
      } ${className}`}
    >
      {/* Animated accent gradient */}
      <div className="pointer-events-none absolute -inset-px rounded-[inherit] bg-gradient-to-br from-brand-primary/40 via-brand-primary/0 to-brand-primary/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Neon hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-0 ring-brand-primary/40 transition group-hover:ring-2" />

      {(title || actions) && (
        <header className="flex items-center justify-between px-6 py-4">
          {title && (
            <h3 className="text-lg font-semibold text-brand-text-light tracking-tight">
              {title}
            </h3>
          )}
          {actions && <div>{actions}</div>}
        </header>
      )}

      <main className={`px-6 pb-6 ${title ? "pt-0" : "pt-6"}`}>{children}</main>
    </motion.div>
  );
};

export default GlassCard;
