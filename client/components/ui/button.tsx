import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default:
          "bg-accent-gradient text-primary-foreground font-medium text-lg shadow hover:bg-accent-gradient-hover",
        destructive:
          "bg-destructive text-destructive-foreground font-medium text-lg shadow-sm hover:bg-destructive/80",
        success:
          "bg-green text-destructive-foreground font-medium text-lg shadow-sm",
        fail:
          "bg-destructive text-destructive-foreground font-medium text-lg shadow-sm",
        outline:
          "border text-card-foreground bg-card font-medium text-lg shadow-sm hover:border-destructive",
        secondary:
          "bg-secondary text-secondary-foreground font-medium text-lg shadow-sm hover:bg-secondary/70",
        ghost: "font-medium text-lg hover:bg-background",
        primary: "bg-primary text-primary-foreground font-medium text-lg shadow hover:bg-primary/90",
        link: "text-muted-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 rounded-md px-4 text-lg font-bold",
        sm: "h-8 rounded-md px-4 text-sm font-normal",
        lg: "h-10 rounded-md px-4 text-lg font-bold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
