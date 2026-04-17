import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "onDrag"
  | "onDragEnd"
  | "onDragStart"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop"
> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "orange";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 glow-primary",
      secondary:
        "bg-dark-800 text-gray-100 hover:bg-dark-700 border border-dark-700",
      outline:
        "border-2 border-primary-600 text-primary-500 hover:bg-primary-600/10",
      ghost: "text-gray-300 hover:bg-dark-800 hover:text-white",
      orange:
        "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.07, ease: "easeOut" }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading}
        {...(props as any)}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export default Button;
