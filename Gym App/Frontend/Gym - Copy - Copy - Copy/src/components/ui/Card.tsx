import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient";
  hover?: boolean;
}

export default function Card({
  children,
  className,
  variant = "default",
  hover = false,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    default: "bg-dark-900 border border-dark-800",
    glass: "glass",
    gradient:
      "bg-gradient-to-br from-dark-900 to-dark-800 border border-primary-900/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("rounded-xl p-6 relative", variants[variant], className)}
      style={{
        boxShadow:
          isHovered && hover
            ? "0 0 40px 15px rgba(34, 197, 94, 0.3), 0 0 80px 25px rgba(34, 197, 94, 0.15), inset 0 0 20px rgba(34, 197, 94, 0.1)"
            : "none",
      }}
      onMouseEnter={() => {
        if (hover) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (hover) setIsHovered(false);
      }}
    >
      {children}
    </motion.div>
  );
}
