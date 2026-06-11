import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98]",
        secondary: "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md active:scale-[0.98]",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:scale-[0.98]",
        outline: "border-border bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent/50 hover:shadow-md active:scale-[0.98]",
        green: "border-transparent bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:shadow-md active:scale-[0.98]",
        success: "border-transparent bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:shadow-md active:scale-[0.98]",
        warning: "border-transparent bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 hover:shadow-md active:scale-[0.98]",
        info: "border-transparent bg-info text-info-foreground shadow-sm hover:bg-info/90 hover:shadow-md active:scale-[0.98]",
        muted: "border-transparent bg-muted text-muted-foreground shadow-sm hover:bg-muted/80 hover:shadow-md active:scale-[0.98]",
        gradient: "border-transparent bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-sm hover:shadow-md active:scale-[0.98] hover:from-primary/90 hover:to-secondary/90",
        ghost: "border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
      },
      size: {
        sm: "px-2 py-0.5 text-xs gap-1",
        default: "px-2.5 py-1 text-xs gap-1.5",
        lg: "px-3 py-1.5 text-sm gap-2",
        xl: "px-4 py-2 text-base gap-2.5"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

