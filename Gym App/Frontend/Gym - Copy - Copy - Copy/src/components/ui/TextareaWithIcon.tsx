import { TextareaHTMLAttributes, forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextareaWithIconProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  icon: LucideIcon;
  label?: string;
  error?: string;
}

const TextareaWithIcon = forwardRef<HTMLTextAreaElement, TextareaWithIconProps>(
  ({ icon: Icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <div className="relative w-full">
        <motion.div
          animate={
            isFocused
              ? {
                  scale: 1.3,
                  rotate: 8,
                  color: "#22c55e",
                  textShadow: "0 0 12px rgba(34, 197, 94, 0.8)",
                }
              : {
                  scale: 1,
                  rotate: 0,
                  color: "rgb(107, 114, 128)",
                  textShadow: "none",
                }
          }
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 350,
            damping: 25,
          }}
          className="absolute left-4 top-4 w-5 h-5 flex items-center justify-center pointer-events-none z-10"
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        <motion.textarea
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
          className={cn(
            "w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-lg",
            "text-gray-100 placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent",
            "transition-all duration-100 pl-12 resize-none",
            props.className,
          )}
        />
      </div>
    );
  },
);

TextareaWithIcon.displayName = "TextareaWithIcon";

export default TextareaWithIcon;
