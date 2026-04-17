import { useCallback, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Dumbbell } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type GymHeroAnimationProps = {
  className?: string;
  size?: number;
  interactiveTilt?: boolean;
};

const MAX_TILT = 11;

/** Green tint on the original `/lottie/dumbbell.lottie` artwork */
const brandTintFilter =
  "brightness(0) saturate(100%) invert(58%) sepia(67%) saturate(456%) hue-rotate(88deg) brightness(96%) contrast(91%)";

export default function GymHeroAnimation({
  className,
  size = 280,
  interactiveTilt = true,
}: GymHeroAnimationProps) {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactiveTilt || reduceMotion) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        x: py * -2 * MAX_TILT,
        y: px * 2 * MAX_TILT,
      });
    },
    [interactiveTilt, reduceMotion],
  );

  const onPointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  if (reduceMotion) {
    return (
      <div
        className={cn(
          "mx-auto flex items-center justify-center text-primary-500",
          className,
        )}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <Dumbbell className="h-[55%] w-[55%]" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto flex cursor-default items-center justify-center overflow-hidden rounded-full",
        interactiveTilt && "pointer-events-auto",
        className,
      )}
      style={{ width: size, height: size, perspective: 900 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-hidden="true"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.28) 0%, rgba(34,197,94,0.06) 45%, transparent 65%)",
        }}
        animate={{ opacity: [0.85, 1, 0.85], scale: [0.96, 1.02, 0.96] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="pointer-events-none absolute inset-[8%] rounded-full border border-primary-500/25 shadow-[0_0_40px_-8px_rgba(34,197,94,0.35)]"
      />

      {/* Tilt from center; Lottie scales from center so bars read as coming from inside the circle */}
      <motion.div
        className="relative z-[1] flex min-h-0 h-full w-full origin-center items-center justify-center p-[10%] [transform-style:preserve-3d]"
        animate={{
          rotateX: interactiveTilt ? tilt.x : 0,
          rotateY: interactiveTilt ? tilt.y : 0,
        }}
        transition={{ type: "spring", stiffness: 90, damping: 28, mass: 0.8 }}
        style={{ filter: brandTintFilter }}
      >
        <motion.div
          className="flex h-full min-h-0 w-full max-h-full max-w-full origin-center items-center justify-center overflow-hidden"
          initial={{ scale: 0.88, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "50% 50%", lineHeight: 0 }}
        >
          <DotLottieReact
            src="/lottie/dumbbell.lottie"
            loop
            autoplay
            mode="forward"
            speed={1}
            layout={{ fit: "contain", align: [0.5, 0.5] }}
            className="block h-full max-h-full w-full max-w-full object-contain"
            style={{
              transformOrigin: "center center",
              display: "block",
            }}
            backgroundColor="transparent"
            useFrameInterpolation
            renderConfig={{
              autoResize: true,
              freezeOnOffscreen: true,
            }}
          />
        </motion.div>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-[10%] rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50"
        aria-hidden
      />
    </div>
  );
}
