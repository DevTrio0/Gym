import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, RefreshCw, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const actions = [
    {
      id: "select-plan",
      label: "Select a Plan",
      icon: ShoppingCart,
      color: "from-blue-600 to-cyan-600",
      path: "/client/welcome/subscription/select-plan",
    },
    {
      id: "renew-or-change",
      label: "Change or Renew",
      icon: RefreshCw,
      color: "from-orange-600 to-red-600",
      path: "/client/welcome/subscription/renew-or-change",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-dark-800 backdrop-blur-lg bg-dark-900/50">
          <div className="container mx-auto px-4 py-4">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => navigate("/client/welcome")}
              className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-20 relative">
            {/* Animated decorative elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative z-10 max-w-4xl mx-auto">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Subscriptions
                </h1>
                <p className="text-xl text-gray-400">
                  Choose your subscription plan: Online Coaching or Real Gym
                </p>
              </motion.div>

              {/* Action Cards Grid */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {actions.map((action) => {
                  const IconComponent = action.icon;
                  const isSelected = selectedAction === action.id;
                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ y: -10 }}
                    >
                      <motion.button
                        onClick={() => setSelectedAction(action.id)}
                        className={`w-full p-12 rounded-2xl border-2 transition-all duration-300 group min-h-96 flex flex-col items-center justify-center ${
                          isSelected
                            ? "border-primary-500 bg-primary-600/10 shadow-2xl shadow-primary-600/40"
                            : "border-dark-700 bg-dark-900/50 hover:border-primary-500/50"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex flex-col items-center gap-8 h-full justify-center">
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
                            className={`w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                              isSelected
                                ? `bg-gradient-to-br ${action.color} shadow-2xl shadow-primary-600/60`
                                : "bg-dark-800 group-hover:bg-dark-700"
                            }`}
                          >
                            <IconComponent
                              className={`w-14 h-14 transition-colors ${
                                isSelected
                                  ? "text-white"
                                  : "text-gray-400 group-hover:text-primary-500"
                              }`}
                            />
                          </motion.div>

                          {/* Label */}
                          <div>
                            <h3 className="text-white font-bold text-2xl text-center">
                              {action.label}
                            </h3>
                          </div>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3 h-3 bg-primary-500 rounded-full mt-4"
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
                  className="mt-12 flex justify-center"
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
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
