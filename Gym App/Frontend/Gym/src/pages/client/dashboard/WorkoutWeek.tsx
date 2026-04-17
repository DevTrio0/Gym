import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Clock,
  Dumbbell,
  TrendingUp,
  Play,
  Square,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  WorkoutSession,
  WEEKLY_WORKOUTS,
  INTENSITY_COLORS,
} from "@/constants/mockWorkouts";

const weeklyWorkouts: WorkoutSession[] = WEEKLY_WORKOUTS;
const intensityColors = INTENSITY_COLORS;

/** Smooth “fill” for each bar slice (green / red / orange) */
const SLOT_FILL_SPRING = {
  type: "spring" as const,
  stiffness: 42,
  damping: 24,
  mass: 0.95,
};

export default function WorkoutWeek() {
  const navigate = useNavigate();

  // Only one session can be active at a time (null = none)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([]);

  // Toast state for "Completed!" feedback
  const [toastWorkoutName, setToastWorkoutName] = useState<string | null>(null);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const completedCount = weeklyWorkouts.filter((w) =>
    completedWorkouts.includes(w.id),
  ).length;
  const totalWorkouts = weeklyWorkouts.length;
  const remainingCount = totalWorkouts - completedCount;
  const progressPercent =
    totalWorkouts > 0 ? (completedCount / totalWorkouts) * 100 : 0;
  const totalHours = (
    weeklyWorkouts.reduce((sum, w) => sum + w.duration, 0) / 60
  ).toFixed(1);

  /**
   * Days “skipped”: not completed, not active, but a later day in the week is
   * already completed or has the active session (user moved past without doing this day).
   */
  const skippedWorkoutIds = useMemo(() => {
    const ids = new Set<string>();
    let maxIdx = -1;
    weeklyWorkouts.forEach((w, i) => {
      if (completedWorkouts.includes(w.id) || activeSessionId === w.id) {
        maxIdx = Math.max(maxIdx, i);
      }
    });
    if (maxIdx < 0) return ids;
    for (let i = 0; i < maxIdx; i++) {
      const w = weeklyWorkouts[i];
      if (!completedWorkouts.includes(w.id) && activeSessionId !== w.id) {
        ids.add(w.id);
      }
    }
    return ids;
  }, [weeklyWorkouts, completedWorkouts, activeSessionId]);

  /** One track slice per day: green = done, red = skipped, orange = active session */
  const barSegments = useMemo(() => {
    return weeklyWorkouts.map((w, i) => {
      const done = completedWorkouts.includes(w.id);
      const active = activeSessionId === w.id;
      const skipped = skippedWorkoutIds.has(w.id) && !done && !active;
      let color: "green" | "red" | "orange" | null = null;
      if (done) color = "green";
      else if (skipped) color = "red";
      else if (active) color = "orange";
      return { id: w.id, index: i, color };
    });
  }, [weeklyWorkouts, completedWorkouts, activeSessionId, skippedWorkoutIds]);

  const barSegmentRound = useMemo(() => {
    const filled = barSegments
      .map((s) => s)
      .filter((s) => s.color !== null);
    const first = filled[0]?.index ?? -1;
    const last = filled[filled.length - 1]?.index ?? -1;
    return (i: number) => {
      if (first < 0) return "rounded-none";
      if (first === last && i === first) return "rounded-full";
      if (i === first) return "rounded-l-full rounded-r-none";
      if (i === last) return "rounded-r-full rounded-l-none";
      return "rounded-none";
    };
  }, [barSegments]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleStartSession = (workoutId: string) => {
    // Block if another session is already running
    if (activeSessionId !== null) return;
    setActiveSessionId(workoutId);
    localStorage.setItem("selectedWorkout", workoutId);
  };

  const handleFinishSession = (workoutId: string) => {
    const workout = weeklyWorkouts.find((w) => w.id === workoutId);

    // Mark completed
    if (!completedWorkouts.includes(workoutId)) {
      setCompletedWorkouts((prev) => [...prev, workoutId]);
    }
    setActiveSessionId(null);
    localStorage.removeItem("selectedWorkout");

    // Show toast
    if (workout) {
      setToastWorkoutName(workout.day);
      setTimeout(() => setToastWorkoutName(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* ── COMPLETION TOAST ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {toastWorkoutName && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -60, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-6 left-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-6 py-3.5 bg-dark-900 border border-primary-500/40 rounded-2xl shadow-2xl shadow-primary-600/20 backdrop-blur-xl">
              <div className="w-8 h-8 bg-primary-600/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Session Complete!</p>
                <p className="text-gray-400 text-xs">
                  {toastWorkoutName} workout finished 🎉
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors mb-8 group"
          >
            <motion.span whileHover={{ x: -3 }}>
              <ArrowLeft className="w-5 h-5" />
            </motion.span>
            <span>Back</span>
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-2">
              Your Workout Week
            </h1>
            <p className="text-gray-400 mb-6">Week of January 8 – 14, 2024</p>

            {/* Active session banner */}
            <AnimatePresence>
              {activeSessionId && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-primary-600/20 to-primary-500/10 border border-primary-500/40 rounded-xl overflow-hidden"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-primary-400"
                  />
                  <Zap className="w-4 h-4 text-primary-400" />
                  <p className="text-primary-300 text-sm font-semibold">
                    Session in progress —{" "}
                    <span className="text-white">
                      {weeklyWorkouts.find((w) => w.id === activeSessionId)?.day}
                    </span>
                    . Finish it before starting another.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Progress Section ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Progress Bar */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-300 font-semibold">
                      Weekly Progress
                    </span>
                  </div>
                  <motion.span
                    key={completedCount}
                    initial={{ scale: 1.3, color: "#4ade80" }}
                    animate={{ scale: 1, color: "#4ade80" }}
                    className="text-primary-400 font-bold"
                  >
                    {completedCount}/{totalWorkouts} Complete
                  </motion.span>
                </div>

                {/* Bar + dots: per-day slices — red = skipped slot, green = completed, orange = active session */}
                <div className="relative">
                  <div className="relative h-4 bg-dark-800 rounded-full overflow-hidden border border-dark-700">
                    {barSegments.map((seg) => {
                      if (!seg.color) return null;
                      const slotPct = 100 / totalWorkouts;
                      const left = (seg.index / totalWorkouts) * 100;
                      const round = barSegmentRound(seg.index);
                      const base =
                        "absolute inset-y-0 z-[2] origin-left will-change-transform shadow-md";
                      if (seg.color === "green") {
                        return (
                          <motion.div
                            key={`g-${seg.id}`}
                            role="presentation"
                            aria-hidden
                            initial={{ scaleX: 0, opacity: 0.92 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{
                              ...SLOT_FILL_SPRING,
                              delay: seg.index * 0.04,
                            }}
                            style={{
                              left: `${left}%`,
                              width: `${slotPct}%`,
                            }}
                            className={`${base} bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-400 shadow-lg shadow-primary-500/35 ${round}`}
                          >
                            <motion.div
                              animate={{ opacity: [0.12, 0.28, 0.12] }}
                              transition={{
                                duration: 2.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className={`absolute inset-0 bg-gradient-to-r from-transparent via-primary-300/30 to-transparent ${round}`}
                            />
                          </motion.div>
                        );
                      }
                      if (seg.color === "red") {
                        return (
                          <motion.div
                            key={`r-${seg.id}`}
                            role="presentation"
                            aria-hidden
                            initial={{ scaleX: 0, opacity: 0.92 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{
                              ...SLOT_FILL_SPRING,
                              delay: seg.index * 0.04,
                            }}
                            style={{
                              left: `${left}%`,
                              width: `${slotPct}%`,
                            }}
                            className={`${base} bg-gradient-to-r from-red-600 via-red-500 to-rose-500 shadow-[0_0_14px_-2px_rgba(248,113,113,0.45)] ${round}`}
                          />
                        );
                      }
                      return (
                        <motion.div
                          key={`o-${seg.id}`}
                          role="presentation"
                          aria-hidden
                          initial={{ scaleX: 0, opacity: 0.92 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{
                            ...SLOT_FILL_SPRING,
                            delay: seg.index * 0.04,
                          }}
                          style={{
                            left: `${left}%`,
                            width: `${slotPct}%`,
                          }}
                          className={`${base} z-[3] bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 shadow-[0_0_18px_-2px_rgba(251,146,60,0.55)] ${round}`}
                        />
                      );
                    })}
                  </div>

                  {weeklyWorkouts.map((w, i) => {
                    const done = completedWorkouts.includes(w.id);
                    const active = activeSessionId === w.id;
                    const skipped =
                      skippedWorkoutIds.has(w.id) && !done && !active;
                    const dotLeft = ((i + 1) / totalWorkouts) * 100;
                    return (
                      <div
                        key={w.id}
                        className="absolute flex flex-col items-center pointer-events-none"
                        style={{
                          left: `${dotLeft}%`,
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 20,
                        }}
                      >
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center isolate">
                          {/* Soft glow behind dot — green done / red skipped */}
                          {done && (
                            <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center">
                              <div
                                aria-hidden
                                className="h-[2.125rem] w-[2.125rem] rounded-full bg-primary-400/30 animate-completed-halo motion-reduce:animate-none [will-change:opacity]"
                              />
                            </div>
                          )}
                          {skipped && (
                            <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center">
                              <div
                                aria-hidden
                                className="h-[2.125rem] w-[2.125rem] rounded-full bg-red-500/25 animate-completed-halo motion-reduce:animate-none [will-change:opacity]"
                              />
                            </div>
                          )}

                          {/* Expanding ripple (orange active) */}
                          {active && (
                            <div
                              aria-hidden
                              className="pointer-events-none absolute inset-0 flex items-center justify-center"
                            >
                              <div className="h-5 w-5 rounded-full border-2 border-orange-400/95 animate-session-ring motion-reduce:animate-none transform-gpu [will-change:transform,opacity]" />
                            </div>
                          )}

                          {/* Green accent ring — completed */}
                          {done && (
                            <div className="pointer-events-none absolute inset-0 z-[8] flex items-center justify-center">
                              <div
                                aria-hidden
                                className="h-7 w-7 rounded-full border-2 border-primary-100/90 bg-transparent shadow-[0_0_16px_rgba(74,222,128,0.45)] animate-marker-ring motion-reduce:animate-none transform-gpu [will-change:transform,opacity]"
                              />
                            </div>
                          )}
                          {/* Red ring — skipped day */}
                          {skipped && (
                            <div className="pointer-events-none absolute inset-0 z-[8] flex items-center justify-center">
                              <div
                                aria-hidden
                                className="h-7 w-7 rounded-full border-2 border-red-300/95 bg-transparent shadow-[0_0_16px_rgba(248,113,113,0.5)] animate-marker-ring motion-reduce:animate-none transform-gpu [will-change:transform,opacity]"
                              />
                            </div>
                          )}
                          {active && (
                            <div className="pointer-events-none absolute inset-0 z-[8] flex items-center justify-center">
                              <div
                                aria-hidden
                                className="h-7 w-7 rounded-full border-2 border-white/90 bg-transparent shadow-[0_0_24px_rgba(251,146,60,0.65),0_0_8px_rgba(254,215,170,0.45),inset_0_0_8px_rgba(255,255,255,0.18)] ring-1 ring-orange-400/50 animate-marker-ring motion-reduce:animate-none transform-gpu [will-change:transform,opacity]"
                              />
                            </div>
                          )}

                          <div
                            className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 shadow-md transition-colors duration-300 ${
                              active
                                ? "animate-session-dot motion-reduce:animate-none transform-gpu [will-change:transform]"
                                : ""
                            } ${
                              done
                                ? "bg-primary-400 border-primary-100 shadow-[0_0_14px_rgba(74,222,128,0.65)]"
                                : active
                                  ? "bg-orange-400 border-white shadow-[0_0_16px_rgba(251,146,60,0.55)]"
                                  : skipped
                                    ? "bg-red-500 border-red-200 shadow-[0_0_14px_rgba(239,68,68,0.55)]"
                                    : "bg-dark-800 border-dark-600"
                            }`}
                          >
                            {done && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="w-2 h-2 rounded-full bg-white"
                              />
                            )}
                          </div>
                        </div>

                        <span
                          className={`absolute text-[10px] font-bold tracking-wider whitespace-nowrap transition-colors duration-300 ${
                            done
                              ? "text-primary-400"
                              : active
                                ? "text-orange-400"
                                : skipped
                                  ? "text-red-400"
                                  : "text-dark-500"
                          }`}
                          style={{ top: "calc(100% + 7px)" }}
                        >
                          {w.day.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="h-7" />
              </div>

              {/* % Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center p-4 bg-gradient-to-br from-primary-600/20 to-primary-500/10 border border-primary-500/30 rounded-xl"
              >
                <div className="text-center">
                  <motion.p
                    key={progressPercent}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-4xl font-bold text-primary-400"
                  >
                    {Math.round(progressPercent)}%
                  </motion.p>
                  <p className="text-gray-400 text-sm mt-1">Complete</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Weekly Schedule ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-12"
          >
            {weeklyWorkouts.map((workout, index) => {
              const isActive = activeSessionId === workout.id;
              const isCompleted = completedWorkouts.includes(workout.id);
              const isSkipped =
                skippedWorkoutIds.has(workout.id) &&
                !isCompleted &&
                !isActive;
              // Another session is running (not this one)
              const isBlocked =
                activeSessionId !== null &&
                activeSessionId !== workout.id;

              return (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.07,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="group"
                >
                  <div className="relative">
                    {/* Active glow */}
                    {isActive && (
                      <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-primary-600/40 to-primary-500/20 rounded-2xl blur-xl"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "mirror",
                        }}
                      />
                    )}

                    <Card
                      variant="glass"
                      className={`relative p-6 transition-all duration-300 border-2 ${
                        isActive
                          ? "border-primary-500 bg-gradient-to-r from-primary-600/15 to-primary-500/5 shadow-lg shadow-primary-500/25"
                          : isCompleted
                            ? "border-green-500/30 bg-dark-900/50 opacity-80"
                            : isSkipped
                              ? "border-red-500/35 bg-dark-900/50 hover:border-red-500/50"
                              : "border-dark-700 hover:border-primary-500/60 bg-gradient-to-br from-dark-900 to-dark-950 hover:shadow-xl hover:shadow-primary-600/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        {/* Left – Day & exercises */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-4">
                            {/* Icon + status ring */}
                            <div className="relative flex-shrink-0">
                              <motion.div
                                whileHover={!isBlocked ? { scale: 1.1 } : {}}
                                className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                                  isActive
                                    ? "bg-gradient-to-br from-primary-500/30 to-primary-600/20 border-primary-500/50"
                                    : isCompleted
                                      ? "bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30"
                                      : isSkipped
                                        ? "bg-gradient-to-br from-red-500/25 to-red-600/10 border-red-500/35"
                                        : "bg-gradient-to-br from-primary-500/20 to-primary-600/10 border-primary-500/30"
                                }`}
                              >
                                <Dumbbell
                                  className={`w-6 h-6 ${
                                    isCompleted
                                      ? "text-green-400"
                                      : isSkipped
                                        ? "text-red-400"
                                        : "text-primary-500"
                                  }`}
                                />
                              </motion.div>

                              <AnimatePresence>
                                {isCompleted && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <Check className="w-3.5 h-3.5 text-white" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <div>
                              <h3 className="text-xl font-bold text-white">
                                {workout.day}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {workout.date}
                              </p>
                            </div>

                            {/* In-progress label */}
                            {isActive && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="ml-1 px-2.5 py-1 bg-primary-600/20 border border-primary-500/40 text-primary-300 text-xs font-bold rounded-full"
                              >
                                🔥 In Progress
                              </motion.span>
                            )}
                            {isSkipped && !isActive && (
                              <span className="ml-1 px-2.5 py-1 bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold rounded-full">
                                Skipped
                              </span>
                            )}
                          </div>

                          {/* Exercises */}
                          <div className="ml-15 mb-2">
                            <p className="text-sm text-gray-400 mb-2">
                              Exercises:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {workout.exercises.map((exercise, idx) => (
                                <motion.span
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="px-3 py-1 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-full text-xs font-medium transition-colors"
                                >
                                  {exercise}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right – Details + CTA */}
                        <div className="flex flex-col items-end gap-4 min-w-max">
                          {/* Duration + Intensity */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-gray-300 mb-2">
                                <Clock className="w-4 h-4 text-primary-500" />
                                <span className="font-medium">
                                  {workout.duration}m
                                </span>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                  intensityColors[workout.intensity]
                                }`}
                              >
                                {workout.intensity}
                              </span>
                            </div>
                          </div>

                          {/* Coach */}
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Coach</p>
                            <p className="text-white font-semibold text-right">
                              {workout.coach}
                            </p>
                          </div>

                          {/* ── Action Button area ── */}
                          <AnimatePresence mode="wait">
                            {isCompleted ? (
                              /* Completed badge */
                              <motion.div
                                key="completed"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg text-sm font-semibold flex items-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Completed
                              </motion.div>
                            ) : isActive ? (
                              /* ── FINISH SESSION button ── */
                              <motion.div
                                key="finish"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col gap-2 items-end"
                              >
                                {/* In Progress badge */}
                                <motion.div
                                  animate={{ opacity: [1, 0.6, 1] }}
                                  transition={{ duration: 1.4, repeat: Infinity }}
                                  className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/15 border border-orange-500/40 rounded-full"
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.4, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="w-2 h-2 rounded-full bg-orange-400"
                                  />
                                  <span className="text-orange-300 text-xs font-bold tracking-wide">
                                    IN PROGRESS
                                  </span>
                                </motion.div>

                                <motion.button
                                  onClick={() =>
                                    handleFinishSession(workout.id)
                                  }
                                  whileHover={{ scale: 1.04 }}
                                  whileTap={{ scale: 0.96 }}
                                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-lg shadow-lg shadow-green-600/30 hover:shadow-green-500/40 transition-all"
                                >
                                  <Square className="w-4 h-4" />
                                  Finish Session
                                </motion.button>
                              </motion.div>
                            ) : (
                              /* ── START SESSION button ── */
                              <motion.div
                                key="start"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-end gap-1"
                              >
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={isBlocked}
                                  onClick={() =>
                                    handleStartSession(workout.id)
                                  }
                                  className={`flex items-center gap-2 ${
                                    isBlocked ? "opacity-40 cursor-not-allowed" : ""
                                  }`}
                                >
                                  <Play className="w-3.5 h-3.5" />
                                  Start Session
                                </Button>
                                {isBlocked && (
                                  <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-orange-400/80 text-xs text-right max-w-[120px]"
                                  >
                                    Finish active session first
                                  </motion.p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── Summary Stats ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Completed */}
            <motion.div whileHover={{ y: -5 }}>
              <Card
                variant="glass"
                className="p-6 text-center border-2 border-dark-700 hover:border-primary-500/40 transition-all"
              >
                <p className="text-gray-400 text-sm mb-2 font-medium">
                  Completed
                </p>
                <motion.p
                  key={completedCount}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-3xl font-bold text-primary-500"
                >
                  {completedCount}
                </motion.p>
              </Card>
            </motion.div>

            {/* Remaining */}
            <motion.div whileHover={{ y: -5 }}>
              <Card
                variant="glass"
                className="p-6 text-center border-2 border-dark-700 hover:border-orange-500/40 transition-all"
              >
                <p className="text-gray-400 text-sm mb-2 font-medium">
                  Remaining
                </p>
                <motion.p
                  key={remainingCount}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-3xl font-bold text-orange-400"
                >
                  {remainingCount}
                </motion.p>
              </Card>
            </motion.div>

            {/* Total Hours */}
            <motion.div whileHover={{ y: -5 }}>
              <Card
                variant="glass"
                className="p-6 text-center border-2 border-dark-700 hover:border-blue-500/40 transition-all"
              >
                <p className="text-gray-400 text-sm mb-2 font-medium">
                  Total Hours
                </p>
                <p className="text-3xl font-bold text-blue-400">{totalHours}</p>
              </Card>
            </motion.div>

            {/* Progress % */}
            <motion.div whileHover={{ y: -5 }}>
              <Card
                variant="glass"
                className="p-6 text-center border-2 border-dark-700 hover:border-green-500/40 transition-all"
              >
                <p className="text-gray-400 text-sm mb-2 font-medium">
                  Progress
                </p>
                <motion.p
                  key={Math.round(progressPercent)}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-3xl font-bold text-green-400"
                >
                  {Math.round(progressPercent)}%
                </motion.p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
