import React from "react";
import { motion } from "framer-motion";
import {
  ArrowTrendingUpIcon,
  FireIcon,
  ClockIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    name: "Volume Increase",
    stat: "12.5%",
    icon: ArrowTrendingUpIcon,
    changeType: "increase",
  },
  {
    name: "Avg. Duration",
    stat: "58 min",
    icon: ClockIcon,
    changeType: "neutral",
  },
  {
    name: "Active Streak",
    stat: "16 days",
    icon: FireIcon,
    changeType: "increase",
  },
  {
    name: "PRs This Month",
    stat: "4",
    icon: TrophyIcon,
    changeType: "increase",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const QuickStats: React.FC = () => {
  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      animate="visible"
    >
      {stats.map((item) => (
        <motion.div
          key={item.name}
          variants={cardVariants}
          className="bg-brand-card rounded-2xl shadow-lg p-5"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <item.icon
                className="h-6 w-6 text-brand-text-muted"
                aria-hidden="true"
              />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-brand-text-muted truncate">
                  {item.name}
                </dt>
                <dd>
                  <div className="text-lg font-bold text-brand-text">
                    {item.stat}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuickStats;
