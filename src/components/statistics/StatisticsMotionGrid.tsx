import { cn } from "@/lib/utils";
import { motion, type MotionProps } from "framer-motion";
import { type ReactNode } from "react";

interface StatisticsMotionGridProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export function StatisticsMotionGrid({ children, className, ...motionProps }: StatisticsMotionGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className={cn(className)}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
