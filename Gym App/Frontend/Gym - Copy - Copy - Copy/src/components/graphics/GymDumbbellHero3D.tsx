import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

type GymDumbbellHero3DProps = {
  size?: number; // px
  className?: string;
};

export default function GymDumbbellHero3D({
  size = 80,
  className,
}: GymDumbbellHero3DProps) {
  const reduceMotion = useReducedMotion();

  const perspective = useMemo(() => Math.max(700, size * 20), [size]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      }}
      className={cn("inline-block relative", className)}
    >
      <div
        style={{
          width: size,
          height: size,
          perspective: `${perspective}px`,
        }}
        className="relative"
      >
        <motion.div
          style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}
          animate={
            reduceMotion
              ? { rotateX: 0, rotateY: 0, y: 0 }
              : {
                  rotateY: [-12, 12, -12],
                  rotateX: [7, -4, 7],
                  y: [0, -8, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          {/* Back/depth layer */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(16,185,129,0.08) 55%, rgba(255,255,255,0.04) 100%)",
              transform: "translateZ(-14px) scale(0.98)",
              border: "1px solid rgba(255,255,255,0.10)",
              filter: "saturate(1.05)",
            }}
          />

          {/* Main “metal” panel */}
          <div
            className="absolute inset-0 rounded-3xl shadow-2xl shadow-primary-500/60 ring-2 ring-white/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.98) 0%, rgba(22,163,74,0.95) 55%, rgba(20,83,45,0.94) 100%)",
              border: "1px solid rgba(255,255,255,0.14)",
              transform: "translateZ(14px)",
            }}
          />

          {/* Shine sweep */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{ transform: "translateZ(16px)" }}
          >
            <motion.div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)",
              }}
              initial={{ x: "-80%" }}
              animate={reduceMotion ? undefined : { x: ["-80%", "80%"] }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 3.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            />
          </div>

          {/* Dumbbell icon */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: "translateZ(26px)" }}
          >
            <Dumbbell className="w-[42%] h-[42%] text-white drop-shadow" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

