import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  X,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// Workout types and specialties for coaches
const workoutSpecialties = [
  "Strength Training",
  "Cardio Session",
  "Yoga & Flexibility",
  "HIIT Training",
  "CrossFit",
  "Boxing Training",
  "Personal Training",
  "Weight Loss Program",
];

const workoutLevels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const workoutLocations = ["Studio A", "Studio B", "Studio C", "Studio D", "Main Hall"];
const workoutDurations = ["45 mins", "50 mins", "60 mins", "75 mins", "90 mins"];
const workoutTimes = [
  "7:00 AM",
  "8:30 AM",
  "10:00 AM",
  "12:00 PM",
  "2:00 PM",
  "4:00 PM",
  "6:00 PM",
  "7:30 PM",
];

// Generate realistic workouts from coaches
const generateWorkoutsFromCoaches = (coaches: any[]) => {
  let workoutId = 1;
  const workouts = [];

  coaches.forEach((coach, coachIndex) => {
    // Generate 3 workout sessions per coach using THEIR specialization
    for (let i = 0; i < 3; i++) {
      // Use coach's actual specialization, or fallback to a default
      const specialty = coach.specialization || "Personal Training";
      const level = workoutLevels[(coachIndex + i) % workoutLevels.length];
      const location = workoutLocations[(coachIndex + i) % workoutLocations.length];
      const duration = workoutDurations[(coachIndex + i) % workoutDurations.length];
      const time = workoutTimes[(coachIndex * 2 + i) % workoutTimes.length];

      workouts.push({
        id: workoutId,
        name: specialty, // Now using coach's actual specialization
        coach: coach.name,
        coachId: coach._id,
        coachEmail: coach.email,
        coachSpecialization: specialty, // Store specialization separately too
        time,
        date: i === 0 ? "Today" : i === 1 ? "Tomorrow" : "In 2 Days",
        duration,
        level,
        location,
      });
      workoutId++;
    }
  });

  return workouts;
};



export default function BookWorkout() {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState<any[]>([]);
  const [availableWorkouts, setAvailableWorkouts] = useState<any[]>([]);
  const [loadingCoaches, setLoadingCoaches] = useState(true);
  const [bookedWorkoutIds, setBookedWorkoutIds] = useState<number[]>([]);
  const [pendingBookId, setPendingBookId] = useState<number | null>(null);
  const [showBookSuccess, setShowBookSuccess] = useState(false);
  const [cancelConfirmId, setCancelConfirmId] = useState<number | null>(null);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch coaches from the backend
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoadingCoaches(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("You must be logged in to book a workout");
        }
        
        const response = await fetch("http://localhost:5000/client/dashboard/coaches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ Coaches fetch error:", response.status, errorData);
          
          if (response.status === 403) {
            throw new Error("⛔ Only clients can book workouts. Please log in as a client, not a coach.");
          } else if (response.status === 401) {
            throw new Error("Your session has expired. Please log in again.");
          } else {
            throw new Error(`Failed to fetch coaches: ${errorData.message || response.statusText}`);
          }
        }

        const data = await response.json();
        console.log(`📋 Backend returned ${data.coaches ? data.coaches.length : 0} total coaches`);
        
        if (!data.coaches || !Array.isArray(data.coaches)) {
          throw new Error("Invalid coaches data format from server");
        }
        
        // Include all coaches (removed status filter to show all available coaches)
        // This allows clients to book with any coach regardless of status
        setCoaches(data.coaches);

        // Generate workouts from coaches
        const workouts = generateWorkoutsFromCoaches(data.coaches);
        setAvailableWorkouts(workouts);
        setError("");
      } catch (err) {
        console.error("Error fetching coaches:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load available coaches";
        setError(errorMessage);
        setAvailableWorkouts([]);
      } finally {
        setLoadingCoaches(false);
      }
    };

    fetchCoaches();
  }, []);

  const handleBookWorkout = async (workoutId: number, coachId: string) => {
    setPendingBookId(workoutId);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      
      // Call the API to book workout with coach assignment
      const response = await fetch("http://localhost:5000/client/dashboard/book-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workoutId,
          coachId,
          agree: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setShowBookSuccess(true);
      setTimeout(() => {
        handleCloseBookSuccess();
      }, 2500);
    } catch (err) {
      console.error("Booking error:", err);
      setError(err instanceof Error ? err.message : "Booking failed");
      setPendingBookId(null);
    }
  };

  const handleCloseBookSuccess = () => {
    setShowBookSuccess(false);
    if (pendingBookId !== null) {
      setBookedWorkoutIds((prev) => [...prev, pendingBookId]);
      setPendingBookId(null);
    }
  };

  // ── Cancel handlers ────────────────────────────────────────────────────────

  const handleCancelRequest = (workoutId: number) => {
    setCancelConfirmId(workoutId);
  };

  const handleDismissCancel = () => {
    setCancelConfirmId(null);
  };

  const handleConfirmCancel = () => {
    if (cancelConfirmId !== null) {
      setBookedWorkoutIds((prev) =>
        prev.filter((id) => id !== cancelConfirmId),
      );

      // Remove from localStorage if it's the stored booked workout
      const stored = localStorage.getItem("bookedWorkout");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id === cancelConfirmId) {
          localStorage.removeItem("bookedWorkout");
        }
      }

      setCancelConfirmId(null);
      setShowCancelSuccess(true);
    }
  };

  const handleCloseCancelSuccess = () => {
    setShowCancelSuccess(false);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const cancelWorkout = availableWorkouts.find((w) => w.id === cancelConfirmId);

  // DEBUG: Log component render
  typeof window !== 'undefined' && console.log('BookWorkout component rendered', {
    workoutsCount: availableWorkouts.length,
    bookedCount: bookedWorkoutIds.length,
    showBookSuccess
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden flex flex-col">
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

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors mb-8 group w-fit"
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
            <h1 className="text-5xl font-bold text-white mb-3">
              Book a Workout
            </h1>
            <p className="text-gray-400 text-lg">
              {loadingCoaches
                ? "Loading available coaches..."
                : `Choose from ${availableWorkouts.length} sessions with our ${coaches.length} expert coaches`}
            </p>
          </motion.div>

          {/* Loading State */}
          {loadingCoaches && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-6"
              >
                <Loader className="w-12 h-12 text-primary-500" />
              </motion.div>
              <p className="text-gray-400 text-lg">Loading coaches from database...</p>
            </motion.div>
          )}

          {/* ── BOOK SUCCESS MODAL ─────────────────────────────────────────── */}
          <AnimatePresence>
            {showBookSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="bg-dark-900 border border-dark-800 rounded-2xl p-10 text-center max-w-md w-full shadow-2xl relative overflow-hidden"
                >
                  {/* Top accent line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="absolute top-0 left-0 right-0 h-1 bg-primary-500 origin-left"
                  />

                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1.3, 1], opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center mb-6"
                  >
                    <div className="relative w-20 h-20 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center border border-primary-500/20 shadow-lg shadow-primary-500/20">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg"
                      />
                      <CheckCircle2 className="w-10 h-10 relative z-10" />
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    Workout Booked!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 mb-8"
                  >
                    Your appointment has been successfully confirmed.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="primary"
                      onClick={handleCloseBookSuccess}
                      className="w-full py-3 font-semibold"
                    >
                      Got it!
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CANCEL CONFIRM MODAL ───────────────────────────────────────── */}
          <AnimatePresence>
            {cancelConfirmId !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="bg-dark-900 border border-dark-800 rounded-2xl p-10 text-center max-w-md w-full shadow-2xl relative overflow-hidden"
                >
                  {/* Top accent line – red */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="absolute top-0 left-0 right-0 h-1 bg-red-500 origin-left"
                  />

                  {/* Close (×) button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDismissCancel}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-dark-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>

                  {/* Warning icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1.2, 1] }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-center mb-6"
                  >
                    <div className="relative w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-500/20">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-red-500/20 rounded-full blur-lg"
                      />
                      <XCircle className="w-10 h-10 relative z-10" />
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    Cancel Appointment?
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 mb-2"
                  >
                    Are you sure you want to cancel
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-white font-semibold text-lg mb-8"
                  >
                    {cancelWorkout?.name}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                  >
                    {/* Keep it */}
                    <Button
                      variant="secondary"
                      onClick={handleDismissCancel}
                      className="flex-1 py-3 font-semibold"
                    >
                      Keep it
                    </Button>

                    {/* Yes, Cancel */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleConfirmCancel}
                      className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold rounded-lg shadow-lg shadow-red-600/30 hover:shadow-red-500/40 transition-all"
                    >
                      Yes, Cancel
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CANCEL SUCCESS MODAL ───────────────────────────────────────── */}
          <AnimatePresence>
            {showCancelSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="bg-dark-900 border border-dark-800 rounded-2xl p-10 text-center max-w-md w-full shadow-2xl relative overflow-hidden"
                >
                  {/* Top accent line – red */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="absolute top-0 left-0 right-0 h-1 bg-red-500 origin-left"
                  />

                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1.3, 1], opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center mb-6"
                  >
                    <div className="relative w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center border border-red-500/20 shadow-lg shadow-red-500/20">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-red-500/20 rounded-full blur-lg"
                      />
                      <XCircle className="w-10 h-10 relative z-10" />
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    Appointment Cancelled
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 mb-8"
                  >
                    Your appointment has been successfully cancelled. You can
                    book a new session anytime.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      variant="secondary"
                      onClick={handleCloseCancelSuccess}
                      className="w-full py-3 font-semibold"
                    >
                      Got it
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── ERROR MESSAGE ──────────────────────────────────────────────── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* ── NO COACHES MESSAGE ──────────────────────────────────────────── */}
          {!loadingCoaches && availableWorkouts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <User className="w-16 h-16 text-gray-600 mb-4 opacity-50" />
              <h3 className="text-2xl font-bold text-white mb-2">No Coaches Available</h3>
              <p className="text-gray-400 max-w-md">
                There are no active coaches available at the moment. Please check back later.
              </p>
            </motion.div>
          )}

          {/* ── WORKOUTS GRID ──────────────────────────────────────────────── */}
          {!loadingCoaches && availableWorkouts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
            {availableWorkouts.map((workout, index) => {
              const isBooked = bookedWorkoutIds.includes(workout.id);

              return (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{ y: -12 }}
                  className="group h-full"
                >
                  <div className="relative h-full">
                    {/* Animated Glow Background */}
                    <motion.div
                      className={`absolute -inset-0.5 bg-gradient-to-br ${
                        isBooked
                          ? "from-primary-600/20 to-primary-500/10"
                          : "from-primary-600/30 to-primary-500/10"
                      } rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`}
                      animate={{ scale: [1, 1.08, 1], opacity: [0, 0.5, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "mirror",
                      }}
                    />

                    {/* Card */}
                    <Card
                      variant="glass"
                      className={`relative p-8 h-full flex flex-col gap-6 border-2 ${
                        isBooked
                          ? "border-primary-500/40"
                          : "border-dark-700 group-hover:border-primary-500/60"
                      } bg-gradient-to-br from-dark-900 to-dark-950 backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl shadow-dark-950/50 group-hover:shadow-xl group-hover:shadow-primary-600/30`}
                    >
                      {/* Interior Glow Light */}
                      <motion.div
                        className="absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-br from-primary-600/30 to-primary-500/10 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity duration-500"
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />

                      <div className="relative z-10">
                        {/* Header */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.1 }}
                          className="flex items-start justify-between gap-2"
                        >
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-3">
                              {workout.name}
                            </h3>
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                delay: index * 0.1 + 0.15,
                              }}
                              className="inline-block px-3 py-1 bg-primary-600/20 border border-primary-500/30 text-primary-400 text-sm rounded-full font-semibold"
                            >
                              {workout.level}
                            </motion.span>
                          </div>

                          {/* Booked badge in top-right */}
                          {isBooked && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 260 }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600/20 border border-primary-500/40 text-primary-400 rounded-full text-xs font-bold shrink-0"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Booked</span>
                            </motion.div>
                          )}
                        </motion.div>

                        {/* Details */}
                        <div className="space-y-3 flex-1 mt-6">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.15 }}
                            className="flex items-center gap-3 text-gray-300"
                          >
                            <motion.div whileHover={{ scale: 1.2 }}>
                              <User className="w-5 h-5 text-primary-500" />
                            </motion.div>
                            <div className="flex flex-col">
                              <span className="font-semibold">{workout.coach}</span>
                              <span className="text-xs text-primary-400 font-medium">Specialization: {workout.coachSpecialization}</span>
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="flex items-center gap-3 text-gray-300"
                          >
                            <motion.div whileHover={{ scale: 1.2 }}>
                              <Clock className="w-5 h-5 text-primary-500" />
                            </motion.div>
                            <span>
                              {workout.duration} • {workout.time}
                            </span>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.25 }}
                            className="flex items-center gap-3 text-gray-300"
                          >
                            <motion.div whileHover={{ scale: 1.2 }}>
                              <Calendar className="w-5 h-5 text-primary-500" />
                            </motion.div>
                            <span>{workout.date}</span>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="flex items-center gap-3 text-gray-300"
                          >
                            <motion.div whileHover={{ scale: 1.2 }}>
                              <MapPin className="w-5 h-5 text-primary-500" />
                            </motion.div>
                            <span>{workout.location}</span>
                          </motion.div>
                        </div>

                        {/* CTA area */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.35 }}
                          className="mt-8"
                        >
                          {isBooked ? (
                            /* ── Booked state: info row + cancel button ── */
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2 px-4 py-3 bg-primary-600/10 border border-primary-500/30 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" />
                                <span className="text-primary-300 text-sm font-medium">
                                  Appointment confirmed for{" "}
                                  <span className="font-bold">
                                    {workout.date}
                                  </span>{" "}
                                  at{" "}
                                  <span className="font-bold">
                                    {workout.time}
                                  </span>
                                </span>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCancelRequest(workout.id)}
                                className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/40 hover:border-red-500/70 text-red-400 hover:text-red-300 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/cancel"
                              >
                                <motion.div
                                  animate={{ rotate: [0, 5, -5, 0] }}
                                  transition={{
                                    duration: 0.4,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                  }}
                                >
                                  <XCircle className="w-4 h-4" />
                                </motion.div>
                                <span>Cancel Appointment</span>
                              </motion.button>
                            </div>
                          ) : (
                            /* ── Unbooked state: Book Now button ── */
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                variant="primary"
                                className="w-full py-3 font-bold text-base shadow-lg hover:shadow-xl transition-all"
                                onClick={() => handleBookWorkout(workout.id, workout.coachId)}
                                disabled={pendingBookId === workout.id}
                              >
                                {pendingBookId === workout.id
                                  ? "Booking..."
                                  : "Book Now"}
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
