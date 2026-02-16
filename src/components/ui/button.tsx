import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // A.X.I.O. Custom Variants - Cyan Theme
        cyan: "bg-gradient-to-r from-[hsl(175,70%,50%)] via-[hsl(220,60%,55%)] to-[hsl(260,60%,65%)] text-[hsl(220,15%,4%)] font-semibold shadow-[0_4px_20px_hsl(175,70%,50%,0.3),0_4px_20px_hsl(260,60%,65%,0.2)] hover:shadow-[0_6px_30px_hsl(175,70%,50%,0.45),0_6px_30px_hsl(260,60%,65%,0.3)] hover:-translate-y-0.5 active:translate-y-0",
        cyanOutline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(175,70%,50%,0.2),0_0_20px_hsl(260,60%,65%,0.15)]",
        premium: "bg-gradient-to-r from-[hsl(160,80%,65%)] via-[hsl(175,70%,50%)] to-[hsl(260,60%,65%)] text-[hsl(220,15%,4%)] font-bold shadow-[0_4px_25px_hsl(175,70%,50%,0.35),0_4px_25px_hsl(260,60%,65%,0.25)] hover:shadow-[0_8px_35px_hsl(175,70%,50%,0.5),0_8px_35px_hsl(260,60%,65%,0.4)] hover:-translate-y-1 active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
