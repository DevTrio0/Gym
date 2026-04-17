import { useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ZapLogo3DProps = {
  size?: number;
  className?: string;
};

const BORDER = 2;

/**
 * FitHub mark — high presence: layered glow, energy ring, breathing scale,
 * rich shine & bolt pulse, stronger hover so users *feel* the logo.
 */
export default function ZapLogo3D({ size = 48, className }: ZapLogo3DProps) {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const uid = useId();
  const ringGradId = `logo-ring-${uid}`;

  const perspective = useMemo(() => Math.max(560, size * 18), [size]);
  const r = Math.max(10, size * 0.22);
  const vb = size + 14;
  const c = vb / 2;
  const ringR = size / 2 + 5;

  return (
    <div
      className={cn("relative shrink-0 cursor-default select-none overflow-visible", className)}
      style={{
        width: size,
        height: size,
        perspective: `${perspective}px`,
      }}
      onMouseEnter={() => {
        if (!reduceMotion) setHovered(true);
      }}
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const mult = hovered ? 1.35 : 1;
        setTilt({
          y: (px / rect.width - 0.5) * 18 * mult,
          x: (0.5 - py / rect.height) * 13 * mult,
        });
      }}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      aria-label="FitHub logo"
      role="img"
    >
      {/* Wide field — slow pulse; draws the eye from the corner */}
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-emerald-600/25 blur-2xl"
          animate={{
            opacity: hovered ? 0.62 : [0.28, 0.48, 0.32, 0.42, 0.28],
            scale: hovered ? 1.1 : [0.94, 1.08, 0.97, 1.04, 0.94],
          }}
          transition={
            hovered
              ? { type: "spring", stiffness: 400, damping: 28 }
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
          }
        />
      )}

      {/* Tight bright core glow */}
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-1 rounded-3xl bg-emerald-500/35 blur-md"
          animate={{
            opacity: hovered ? 0.88 : [0.45, 0.72, 0.5, 0.65, 0.45],
            scale: hovered ? 1.1 : [0.98, 1.06, 1, 1.04, 0.98],
          }}
          transition={
            hovered
              ? { type: "spring", stiffness: 420, damping: 26 }
              : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          }
        />
      )}

      {/* Outer SVG energy ring — one moving highlight (readable, not noisy) */}
      {!reduceMotion && (
        <svg
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 overflow-visible bg-transparent"
          width={vb}
          height={vb}
          aria-hidden
          style={{ background: "transparent" }}
        >
          <defs>
            <linearGradient id={ringGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          <motion.circle
            cx={c}
            cy={c}
            r={ringR}
            fill="none"
            stroke={`url(#${ringGradId})`}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeDasharray="32 118"
            initial={{ opacity: 0.85 }}
            animate={{
              strokeDashoffset: [0, -150],
              opacity: hovered ? 1 : [0.65, 0.95, 0.7, 0.9, 0.65],
            }}
            transition={{
              /* Smooth ease — feels like weight + momentum, not a robotic loop */
              strokeDashoffset: {
                duration: hovered ? 2.4 : 3.8,
                repeat: Infinity,
                ease: [0.45, 0.05, 0.35, 1],
              },
              opacity: hovered
                ? { duration: 0.25 }
                : { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </svg>
      )}

      {/* Lift + float — extra scale when hovered */}
      <motion.div
        className="relative h-full w-full"
        animate={
          reduceMotion
            ? { y: 0, scale: 1 }
            : {
                y: hovered ? -2 : [0, -3, 0, -2, 0],
                scale: hovered ? 1.1 : [1, 1.05, 1, 1.035, 1],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : hovered
              ? { type: "spring", stiffness: 380, damping: 22 }
              : { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={
            reduceMotion
              ? { rotateX: 0, rotateY: 0 }
              : { rotateX: tilt.x, rotateY: tilt.y }
          }
          transition={{ type: "spring", stiffness: hovered ? 320 : 260, damping: 24 }}
        >
          {/* Back depth */}
          <div
            className="absolute inset-0 rounded-2xl border border-white/12"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.22) 0%, rgba(22,163,74,0.08) 100%)",
              transform: "translateZ(-8px) scale(0.97)",
            }}
          />

          {/* Rotating green border — Framer spin: smooth linear momentum (real wheel / turntable) */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl"
            style={{ borderRadius: r }}
          >
            {reduceMotion ? (
              <div
                className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "linear-gradient(135deg, #15803d, #22c55e, #166534)",
                }}
              />
            ) : (
              <motion.div
                className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
                style={{
                  transformOrigin: "50% 50%",
                  background:
                    "conic-gradient(from 0deg, #14532d, #15803d, #22c55e, #4ade80, #16a34a, #14532d)",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: hovered ? 10.5 : 19,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}
          </div>

          {/* Inner card */}
          <div
            className={cn(
              "absolute z-[2] overflow-hidden rounded-2xl",
              hovered
                ? "shadow-[0_12px_40px_-4px_rgba(34,197,94,0.65),inset_0_1px_0_rgba(255,255,255,0.12)]"
                : "shadow-[0_10px_32px_-6px_rgba(34,197,94,0.5)]",
            )}
            style={{
              inset: BORDER,
              borderRadius: r - BORDER * 0.6,
              background:
                "linear-gradient(160deg, #4ade80 0%, #22c55e 35%, #16a34a 72%, #15803d 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              transform: "translateZ(10px)",
            }}
          >
            {/* Green-tinted gloss — no strong white (avoids “white box” flash) */}
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "linear-gradient(125deg, rgba(187,247,208,0.35) 0%, transparent 50%)",
              }}
            />

            {!reduceMotion && (
              <motion.div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    "linear-gradient(95deg, transparent 35%, rgba(220,252,231,0.35) 50%, transparent 65%)",
                }}
                animate={{ x: ["-130%", "130%"] }}
                transition={{
                  duration: hovered ? 2.6 : 3.6,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: hovered ? 1 : 2,
                }}
              />
            )}

            {/* Vignette for depth */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                boxShadow: "inset 0 -12px 24px rgba(0,0,0,0.12)",
              }}
            />

            <div className="flex h-full w-full items-center justify-center">
              <motion.div
                animate={
                  reduceMotion
                    ? {}
                    : {
                        scale: hovered
                          ? [1.08, 1.12, 1.08]
                          : [1, 1.1, 1, 1.06, 1],
                        filter: hovered
                          ? [
                              "drop-shadow(0 1px 2px rgba(0,0,0,0.35)) drop-shadow(0 0 12px rgba(34,197,94,0.85))",
                              "drop-shadow(0 1px 2px rgba(0,0,0,0.3)) drop-shadow(0 0 18px rgba(74,222,128,0.75))",
                              "drop-shadow(0 1px 2px rgba(0,0,0,0.35)) drop-shadow(0 0 12px rgba(34,197,94,0.85))",
                            ]
                          : [
                              "drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
                              "drop-shadow(0 0 10px rgba(34,197,94,0.55)) drop-shadow(0 0 16px rgba(74,222,128,0.35))",
                              "drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
                              "drop-shadow(0 0 8px rgba(34,197,94,0.45))",
                              "drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
                            ],
                      }
                }
                transition={{
                  duration: hovered ? 1.2 : 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Zap
                  className="text-white"
                  style={{
                    width: size * 0.48,
                    height: size * 0.48,
                  }}
                  strokeWidth={2.35}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
