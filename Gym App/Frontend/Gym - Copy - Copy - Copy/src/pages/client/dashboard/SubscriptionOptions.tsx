import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, RefreshCw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function SubscriptionOptions() {
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

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
      label: "Renew or Change",
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
        <header className="border-b border-dark-800 backdrop-blur-lg bg-dark-900/50">
          <div className="container mx-auto px-4 py-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBack}
              className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </motion.button>
            <h1 className="text-4xl font-bold text-white">Subscriptions</h1>
            <p className="text-gray-400 mt-2">
              Choose your subscription plan: Online Coaching or Real Gym
            </p>
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

            <div className="relative z-10 max-w-3xl mx-auto">
              {/* Action Cards Grid */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className={`w-full p-8 flex flex-col items-center justify-center gap-6 rounded-2xl border-2 transition-all duration-300 group min-h-[260px] ${
                          isSelected
                            ? "border-primary-500 bg-primary-600/10 shadow-xl shadow-primary-600/30"
                            : "border-dark-700 bg-dark-900/50 hover:border-primary-500/50"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Icon Container */}
                        <motion.div
                          animate={
                            isSelected
                              ? { scale: 1.05, rotate: 5 }
                              : { scale: 1, rotate: 0 }
                          }
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                            isSelected
                              ? `bg-gradient-to-br ${action.color} shadow-lg shadow-primary-600/40`
                              : "bg-dark-800 group-hover:bg-dark-700"
                          }`}
                        >
                          <IconComponent
                            className={`w-10 h-10 transition-colors ${
                              isSelected
                                ? "text-white"
                                : "text-gray-400 group-hover:text-primary-500"
                            }`}
                          />
                        </motion.div>

                        {/* Label & Indicator Container */}
                        <div className="flex flex-col items-center justify-center flex-grow">
                          <h3 className="text-white font-bold text-xl text-center">
                            {action.label}
                          </h3>
                          {/* Selection Indicator */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2.5 h-2.5 bg-primary-500 rounded-full mt-3"
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
