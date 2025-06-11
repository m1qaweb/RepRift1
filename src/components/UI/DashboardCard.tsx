import React, { ReactElement } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  icon?: ReactElement;
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  fullHeight?: boolean;
}

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, children, className, actions, fullHeight = false }) => {
  return (
    <motion.div
      variants={itemVariant}
      className={`bg-brand-surface border border-brand-border/5 rounded-2xl shadow-lg flex flex-col ${fullHeight ? 'h-full' : ''} ${className}`}
    >
      {(title || icon || actions) && (
        <header className="flex items-center justify-between p-4 border-b border-brand-border/5">
            <div className="flex items-center gap-3">
            {icon && (
                <div className="text-brand-primary">
                {React.cloneElement(icon, { className: 'h-5 w-5' })}
                </div>
            )}
            <h3 className="text-md font-semibold text-brand-text-light">{title}</h3>
            </div>
            {actions && <div>{actions}</div>}
        </header>
      )}
      <main className="p-4 flex-grow">{children}</main>
    </motion.div>
  );
};

export default DashboardCard; 