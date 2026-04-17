import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  LogOut,
  User,
  UserPlus,
  Users,
  Lock,
  Unlock,
  BarChart3,
  CreditCard,
  TrendingUp,
  Package,
  Users2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import ZapLogo3D from "@/components/graphics/ZapLogo3D";
import GymHeroAnimation from "@/components/graphics/GymHeroAnimation";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "@/lib/api";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await getProfile(token);
        if (response.status === 'success') {
          setUser(response.user);
        } else {
          // Fallback to stored user data
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          setUser(storedUser || { name: 'Admin', role: 'admin', email: 'admin@example.com' });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Fallback to stored user data
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser || { name: 'Admin', role: 'admin', email: 'admin@example.com' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const displayUser = user || { name: 'Admin', role: 'admin', email: 'admin@example.com' };

  const actions = [
    {
      id: "add-coach",
      label: "Add Coach",
      icon: UserPlus,
      color: "from-blue-600 to-cyan-600",
      path: "/admin/add-coach",
    },
    {
      id: "add-client",
      label: "Add Client",
      icon: Users,
      color: "from-green-600 to-emerald-600",
      path: "/admin/add-client",
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      color: "from-orange-600 to-red-600",
      path: "/admin/reports",
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      color: "from-purple-600 to-pink-600",
      path: "/admin/payments",
    },
    {
      id: "profits",
      label: "Profits",
      icon: TrendingUp,
      color: "from-yellow-600 to-orange-600",
      path: "/admin/profits",
    },
    {
      id: "subscription",
      label: "Manage Plans",
      icon: Package,
      color: "from-indigo-600 to-blue-600",
      path: "/admin/subscription",
    },
    {
      id: "clients-count",
      label: "Clients Count",
      icon: Users2,
      color: "from-teal-600 to-cyan-600",
      path: "/admin/clients-count",
    },
    {
      id: "deactivate-account",
      label: "Deactivate Account",
      icon: Lock,
      color: "from-red-600 to-pink-600",
      path: "/admin/deactivate-account",
    },
    {
      id: "reactivate-account",
      label: "Reactivate Account",
      icon: Unlock,
      color: "from-green-600 to-teal-600",
      path: "/admin/reactivate-account",
    },
  ];

  const handleLogout = () => {
    // TODO: Connect to backend logout API
    navigate("/login");
  };

  const bgImage = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1920&q=60";

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-clip bg-dark-900">
      {/* bg-dark-900 matches #root — avoids darker dark-950 band at scroll end */}
      {/* Background Image - Gym/Equipment from Unsplash */}
      <div
        className="absolute inset-0 min-h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Dark overlay - strong so content is clearly visible */}
      <div className="absolute inset-0 bg-dark-900/88" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-dark-900/92" />
      {/* Gradient orbs — scale/opacity only (no translateY) so #root scroll height isn’t inflated */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.55, 0.85, 0.55],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.12, 1, 1.12],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-dark-800 backdrop-blur-lg bg-dark-900/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Left - App Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <ZapLogo3D size={48} />
              <div>
                <h2 className="text-2xl font-bold">
                  <span className="text-primary-500">Fit</span>
                  <span className="text-white">Hub</span>
                  <span className="text-gray-400"> Admin</span>
                </h2>
                <p className="text-xs text-gray-400">Admin Portal</p>
              </div>
            </motion.div>

            {/* Right - User Menu */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              {/* User Profile Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium text-sm hidden sm:inline">
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
                  className="absolute right-0 top-full mt-2 w-48 bg-dark-900 border border-dark-700 rounded-lg shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-dark-700">
                    <p className="text-white font-semibold text-sm">
                      {displayUser?.name}
                    </p>
                    <p className="text-gray-400 text-xs">Admin Account</p>
                  </div>
                  <div className="p-2">
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-dark-800 rounded-lg transition-colors"
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

        <main className="pb-10">
          {/* overflow-hidden: decorative blurs don’t extend scroll area */}
          <section className="container relative mx-auto overflow-hidden px-4 py-20">
            {/* Breathing glows — no Y motion (avoids extra scroll / black band at end) */}
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.45, 0.7, 0.45],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-600/10 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.08, 1, 1.08],
                opacity: [0.4, 0.65, 0.4],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
              className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl"
            />

            <div className="relative z-10 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                  className="inline-block mb-6"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary-600/10 rounded-full border border-primary-600/20">
                    <Flame className="w-4 h-4 text-primary-500" />
                    <span className="text-sm text-primary-400">
                      Admin Management Portal
                    </span>
                  </div>
                </motion.div>

                {/* Same Lottie dumbbell hero as client welcome */}
                <motion.div
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 16 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: easeOut }}
                  className="mb-8 flex min-h-0 justify-center overflow-hidden"
                >
                  <GymHeroAnimation
                    size={240}
                    className="max-w-[min(90vw,280px)] shrink-0"
                  />
                </motion.div>

                <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  Welcome,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                    {user?.name || "Admin"}
                  </span>
                  !
                </h1>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Manage your platform, coaches, clients, and subscriptions all
                  in one place. Monitor performance and drive growth.
                </p>

                {/* Action Cards Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
                  {actions.map((action) => {
                    const IconComponent = action.icon;
                    const isSelected = selectedAction === action.id;
                    return (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.button
                          onClick={() => setSelectedAction(action.id)}
                          className={`w-full h-full p-5 rounded-xl border-2 transition-all duration-300 group ${
                            isSelected
                              ? "border-primary-500 bg-primary-600/10 shadow-lg shadow-primary-600/30"
                              : "border-dark-700 bg-dark-900/50 hover:border-primary-500/50"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex flex-col items-center gap-3 h-full justify-center">
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
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                                isSelected
                                  ? `bg-gradient-to-br ${action.color} shadow-lg shadow-primary-600/50`
                                  : "bg-dark-800"
                              }`}
                            >
                              <IconComponent
                                className={`w-7 h-7 transition-colors ${
                                  isSelected
                                    ? "text-white"
                                    : "text-gray-400 group-hover:text-primary-500"
                                }`}
                              />
                            </motion.div>
                            <h3 className="font-semibold text-sm text-white">
                              {action.label}
                            </h3>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full mt-1 bg-primary-500"
                              />
                            )}
                          </div>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>

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
