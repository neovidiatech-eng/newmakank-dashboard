import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

interface ExpandableButtonProps
  extends Omit<ButtonProps, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  icon: React.ReactNode;
  label?: string;
}

// 1. Create a Motion-enabled version of the Shadcn Button
const MotionButton = motion(Button);

const ExpandableButton = React.forwardRef<HTMLButtonElement, ExpandableButtonProps>(
  ({ icon, label, className, variant = "default", size, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <MotionButton
        ref={ref}
        // 2. Use 'layout' to smooth out the container resizing
        layout
        // 3. Use Framer's hover events (more stable than onMouseEnter)
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          // 4. Ensure overflow is hidden and hit interaction is standard
          "relative overflow-hidden px-3 rounded-3xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        aria-label={props["aria-label"] ?? label}
        variant={variant}
        size={size}
        {...props}
      >
        {/* We wrap the icon in a layout element so it moves smoothly if needed */}
        <motion.span layout="position" className="flex items-center">
          {icon}
        </motion.span>

        <AnimatePresence mode="wait">
          {isHovered && label && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: 1,
                width: "auto",
                transition: { duration: 0.3, ease: "easeOut" } // smooth easing
              }}
              exit={{
                opacity: 0,
                width: 0,
                transition: { duration: 0.2, ease: "easeIn" }
              }}
              // 5. Vital: prevent text wrapping causing height jumps
              className="whitespace-nowrap overflow-hidden"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </MotionButton>
    );
  }
);

ExpandableButton.displayName = "ExpandableButton";

export { ExpandableButton };

