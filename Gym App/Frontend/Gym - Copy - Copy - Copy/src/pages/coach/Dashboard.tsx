import { motion, useReducedMotion } from "framer-motion";
import { LogOut, User, Users, Dumbbell, Zap, TrendingUp, Flame, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "@/lib/api";
import Button from "@/components/ui/Button";
import ZapLogo3D from "@/components/graphics/ZapLogo3D";
import GymHeroAnimation from "@/components/graphics/GymHeroAnimation";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function CoachDashboard() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await getProfile(token);
        if (response.status === "success") {
          setUser(response.user);
        } else {
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          setUser(stored || { name: "Coach", role: "coach", email: "coach@example.com" });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(stored || { name: "Coach", role: "coach", email: "coach@example.com" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-dark-900">Loading...</div>;
  }

  const displayUser = user || { name: "Coach", role: "coach", email: "coach@example.com" };

  const actions = [
    { id: "manage-clients", label: "Manage Clients", icon: Users, color: "from-blue-600 to-cyan-600", path: "/coach/my-clients", description: "View & manage client assignments" },
    { id: "create-workouts", label: "Create Workouts", icon: Dumbbell, color: "from-orange-600 to-red-600", path: "/coach/add-training", description: "Design training plans" },
    { id: "nutrition-plans", label: "Nutrition Plans", icon: Zap, color: "from-purple-600 to-pink-600", path: "/coach/add-diet", description: "Create diet & meal plans" },
    { id: "track-progress", label: "Track Progress", icon: TrendingUp, color: "from-green-600 to-emerald-600", path: "/coach/client-notes", description: "Monitor client achievements" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const bgImage = "/images/gym-hero-bg.jpg";

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-dark-900">
      {/* Photo + overlays — gym mood, readable UI, green brand tint */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden
        />
        {/* Darken + slate wash so text pops */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-dark-950/90 via-dark-900/88 to-dark-950/95"
          aria-hidden
        />
        {/* Subtle green tie-in with primary brand */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_40%,rgba(34,197,94,0.14)_0%,transparent_55%)] mix-blend-soft-light"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_50%_45%,rgba(15,23,42,0.4)_0%,transparent_50%)]"
          aria-hidden
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-[38%] h-[min(70vh,560px)] w-[min(92vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-primary-600/10"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full min-w-0">
        {/* Header — solid bar so left/right match the page (no frosted "strip") */}
        <header className="sticky top-0 z-50 w-full border-b border-dark-800/80 bg-dark-900/90 shadow-none backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6">
            {/* Left - App Logo */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="flex items-center gap-3"
            >
              <ZapLogo3D size={48} />
            </motion.div>

            {/* Right - User Menu */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: easeOut, delay: 0.05 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg border border-transparent bg-dark-800 text-white transition-colors hover:bg-dark-700"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-sm hidden sm:inline">
                    {displayUser?.name}
                  </span>
                </motion.button>

                {/* Dropdown Menu */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={
                    showUserMenu
                      ? { opacity: 1, y: 0, scale: 1 }
                      : {
                          opacity: 0,
                          y: 10,
                          scale: 0.95,
                          pointerEvents: "none",
                        }
                  }
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50 bg-dark-900 border border-dark-700 shadow-xl"
                >
                  <div className="p-4 border-b border-dark-700">
                    <p className="font-semibold text-sm text-white">{displayUser?.name}</p>
                    <p className="text-xs text-gray-400">{displayUser?.email}</p>
                    <div className="mt-4 pt-4 border-t border-dark-600">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Current Activity
                      </p>
                      <p className="text-xs italic text-gray-500">Managing clients & plans</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 transition-colors hover:bg-dark-800"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main — full width; only inner columns use max-w */}
        <main className="w-full pb-10">
          <section className="relative w-full px-4 py-20 sm:px-6">
            <div className="relative z-10 mx-auto w-full max-w-4xl">
              {/* Greeting — staggered fade-up (no splash screen; feels like a normal page settling in) */}
              <motion.div
                className="text-center mb-16"
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                variants={
                  reduceMotion
                    ? undefined
                    : {
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.08,
                          },
                        },
                      }
                }
              >
                <motion.div
                  variants={
                    reduceMotion
                      ? undefined
                      : {
                          hidden: { opacity: 0, y: 14 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5, ease: easeOut },
                          },
                        }
                  }
                  className="inline-block mb-6"
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-primary-600/10 border-primary-600/20">
                    <Flame className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-medium text-primary-400">
                      Coaching Excellence Awaits
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  variants={
                    reduceMotion
                      ? undefined
                      : {
                          hidden: { opacity: 0, y: 16 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.55, ease: easeOut },
                          },
                        }
                  }
                  className="mb-8 flex min-h-0 justify-center overflow-hidden"
                >
                  <GymHeroAnimation
                    size={240}
                    className="max-w-[min(90vw,280px)] shrink-0"
                  />
                </motion.div>

                <motion.h1
                  variants={
                    reduceMotion
                      ? undefined
                      : {
                          hidden: { opacity: 0, y: 12 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5, ease: easeOut },
                          },
                        }
                  }
                  className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-white"
                >
                  Hey,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                    {displayUser?.name}
                  </span>
                  !
                </motion.h1>
                <motion.p
                  variants={
                    reduceMotion
                      ? undefined
                      : {
                          hidden: { opacity: 0, y: 10 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.45, ease: easeOut },
                          },
                        }
                  }
                  className="text-xl mb-8 max-w-2xl mx-auto text-gray-400"
                >
                  Lead your clients to success with expert guidance. Create personalized workouts, nutrition plans, and monitor progress all in one place.
                </motion.p>

                {/* Action Cards Grid */}
                <motion.div
                  className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
                  initial={reduceMotion ? false : "hidden"}
                  animate="visible"
                  variants={
                    reduceMotion
                      ? undefined
                      : {
                          hidden: {},
                          visible: {
                            transition: {
                              staggerChildren: 0.07,
                              delayChildren: 0.2,
                            },
                          },
                        }
                  }
                >
                  {actions.map((action) => {
                    const IconComponent = action.icon;
                    const isSelected = selectedAction === action.id;
                    return (
                      <motion.div
                        key={action.id}
                        variants={
                          reduceMotion
                            ? undefined
                            : {
                                hidden: { opacity: 0, y: 16 },
                                visible: {
                                  opacity: 1,
                                  y: 0,
                                  transition: { duration: 0.42, ease: easeOut },
                                },
                              }
                        }
                        whileHover={reduceMotion ? undefined : { y: -8 }}
                      >
                        <motion.button
                          onClick={() => setSelectedAction(action.id)}
                          className={`w-full h-full p-6 rounded-xl border-2 transition-all duration-300 group ${
                            isSelected
                              ? "border-primary-500 bg-primary-500/15 shadow-lg shadow-primary-500/25"
                              : "border-dark-700 bg-dark-900/50 shadow-sm hover:border-primary-500/50 hover:shadow-md"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex flex-col items-center gap-4 h-full justify-center">
                            {/* Icon Container */}
                            <motion.div
                              animate={
                                isSelected
                                  ? { scale: 1.1, rotate: 5 }
                                  : { scale: 1, rotate: 0 }
                              }
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                                isSelected
                                  ? `bg-gradient-to-br ${action.color} shadow-lg`
                                  : "bg-dark-800"
                              }`}
                            >
                              <IconComponent
                                className={`w-8 h-8 transition-colors ${
                                  isSelected
                                    ? "text-white"
                                    : "text-gray-400 group-hover:text-primary-500"
                                }`}
                              />
                            </motion.div>

                            {/* Label */}
                            <div>
                              <h3 className="font-semibold text-lg text-white">
                                {action.label}
                              </h3>
                            </div>

                            {/* Selection Indicator */}
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-primary-500 rounded-full mt-2"
                              />
                            )}
                          </div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Continue Button */}
                {selectedAction && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12"
                  >
                    <Button
                      onClick={() => {
                        const selectedActionObj = actions.find(
                          (a) => a.id === selectedAction,
                        );
                        navigate(selectedActionObj?.path || "/");
                      }}
                      variant="primary"
                      className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold group"
                    >
                      <span>
                        Continue to{" "}
                        {actions.find((a) => a.id === selectedAction)?.label}
                      </span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
