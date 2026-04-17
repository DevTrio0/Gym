import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Video,
  Dumbbell,
  CreditCard,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { getSubscriptionPlans } from "@/lib/api";

interface ExtendedPlan {
  id: string;
  name: string;
  price: number;
  monthlyPrice: number;
  duration: number;
  billingPeriod: string;
  features: string[];
  description: string;
  category: "online" | "gym";
  isRecommended: boolean;
  savings: number;
}

const PLAN_TYPES = {
  online: {
    icon: Video,
    color: "primary" as const,
    glowColor: "from-primary-600/30 to-primary-500/10",
  },
  gym: {
    icon: Dumbbell,
    color: "orange" as const,
    glowColor: "from-orange-600/30 to-orange-500/10",
  },
};

const COLOR_CLASSES = {
  primary: {
    borderHover: "group-hover:border-primary-500/60",
    shadowHover: "group-hover:shadow-primary-600/30",
    accentLight: "from-primary-500/5",
    badgeBg: "from-primary-600 to-primary-500 shadow-primary-600/40",
    iconWrapper: "from-primary-600/40 to-primary-500/20 group-hover:from-primary-600/60 group-hover:to-primary-500/40 shadow-primary-600/20",
    iconColor: "text-primary-400",
    durationBorder: "border-primary-500/20",
    durationText: "text-primary-400",
    priceSub: "text-primary-400",
    checkBg: "from-primary-600/40 to-primary-500/20 border-primary-500/30 shadow-primary-600/20",
    checkIcon: "text-primary-300",
    btnShadow: "shadow-primary-600/30",
    btnVariant: "primary" as const,
  },
  orange: {
    borderHover: "group-hover:border-orange-500/60",
    shadowHover: "group-hover:shadow-orange-600/30",
    accentLight: "from-orange-500/5",
    badgeBg: "from-orange-600 to-orange-500 shadow-orange-600/40",
    iconWrapper: "from-orange-600/40 to-orange-500/20 group-hover:from-orange-600/60 group-hover:to-orange-500/40 shadow-orange-600/20",
    iconColor: "text-orange-400",
    durationBorder: "border-orange-500/20",
    durationText: "text-orange-400",
    priceSub: "text-orange-400",
    checkBg: "from-orange-600/40 to-orange-500/20 border-orange-500/30 shadow-orange-600/20",
    checkIcon: "text-orange-300",
    btnShadow: "shadow-orange-600/30",
    btnVariant: "orange" as const,
  },
};

interface PlanCardProps {
  plan: ExtendedPlan;
  type: "online" | "gym";
  index: number;
  onPayment: (planId: string) => void;
}

function PlanCard({ plan, type, index, onPayment }: PlanCardProps) {
  const typeConfig = PLAN_TYPES[type];
  const Icon = typeConfig.icon;
  const colors = COLOR_CLASSES[typeConfig.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="group h-full"
    >
      <div className="relative h-full">
        {/* Animated Glow Background */}
        <motion.div
          className={`absolute -inset-0.5 bg-gradient-to-br ${typeConfig.glowColor} rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />

        {/* Card */}
        <div className={`relative bg-gradient-to-br from-dark-900 to-dark-950 border-2 border-dark-700 ${colors.borderHover} rounded-2xl p-8 h-full flex flex-col backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl shadow-dark-950/50 group-hover:shadow-xl ${colors.shadowHover}`}>
          {/* Interior Glow Light */}
          <motion.div
            className={`absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-br ${typeConfig.glowColor} rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity duration-500`}
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />

          {/* Accent Light - Right Side */}
          <motion.div
            className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${colors.accentLight} to-transparent rounded-full blur-3xl pointer-events-none`}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Recommended Badge */}
          {plan.isRecommended && (
            <motion.div
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                delay: index * 0.08 + 0.2,
              }}
              className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`flex items-center gap-2 bg-gradient-to-r ${colors.badgeBg} text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl`}
              >
                <Zap className="w-3 h-3" />
                Recommended
              </motion.div>
            </motion.div>
          )}

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: 8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`w-16 h-16 bg-gradient-to-br ${colors.iconWrapper} rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-lg`}
            >
              <Icon className={`w-8 h-8 ${colors.iconColor}`} />
            </motion.div>

            {/* Plan Name & Description */}
            <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{plan.description}</p>

            {/* Duration Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08 + 0.1 }}
              className={`inline-block mb-6 px-3 py-1 bg-dark-800/60 border ${colors.durationBorder} rounded-lg`}
            >
              <span className={`${colors.durationText} text-xs font-semibold uppercase`}>
                {plan.billingPeriod}
              </span>
            </motion.div>

            {/* Price Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 + 0.15 }}
              className="mb-8 pb-8 border-b border-dark-700"
            >
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-white">
                  ${plan.price.toFixed(2)}
                </span>
                <span className="text-gray-400 text-sm">
                  /{plan.billingPeriod}
                </span>
              </div>
              <p className={`${colors.priceSub} text-xs font-semibold`}>
                ${plan.monthlyPrice.toFixed(2)}/month
              </p>
              {plan.savings > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-500 text-xs font-bold mt-2"
                >
                  Save ${plan.savings.toFixed(2)}
                </motion.p>
              )}
            </motion.div>

            {/* Features */}
            <div className="mb-8 flex-1">
              <p className="text-gray-500 text-xs uppercase font-bold mb-4 tracking-wider">
                Included:
              </p>
              <ul className="space-y-2.5">
                {plan.features.map((feature: string, idx: number) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 + idx * 0.04 }}
                    className="flex items-start gap-3 text-gray-300 text-sm"
                  >
                    <motion.div
                      whileHover={{ scale: 1.25, rotate: 10 }}
                      className={`w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0 bg-gradient-to-br ${colors.checkBg} rounded-full border shadow-lg`}
                    >
                      <Check className={`w-3 h-3 ${colors.checkIcon}`} />
                    </motion.div>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Payment Button */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button
                variant={colors.btnVariant}
                onClick={() => onPayment(plan.id)}
                className={`w-full py-3 font-bold flex items-center justify-center gap-2 group/btn text-base shadow-lg ${colors.btnShadow}`}
              >
                <motion.div
                  animate={{ y: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <CreditCard className="w-5 h-5" />
                </motion.div>
                <span>Choose & Pay Now</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SubscriptionSelectPlan() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<ExtendedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlinePlans, setOnlinePlans] = useState<ExtendedPlan[]>([]);
  const [gymPlans, setGymPlans] = useState<ExtendedPlan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await getSubscriptionPlans();
        const plansData = response.plans || [];
        setPlans(plansData);
        
        // Separate plans by category
        setOnlinePlans(plansData.filter((p: ExtendedPlan) => p.category === 'online'));
        setGymPlans(plansData.filter((p: ExtendedPlan) => p.category === 'gym'));
      } catch (error) {
        console.error('Failed to load plans:', error);
        setPlans([]);
        setOnlinePlans([]);
        setGymPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

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

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-dark-800 backdrop-blur-lg bg-dark-900/50">
          <div className="container mx-auto px-4 py-4">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => navigate("/client/welcome/subscription")}
              className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-lg">Loading amazing plans for you...</p>
            </div>
          ) : plans.length === 0 ? (
             <div className="text-center py-20">
                <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">No Plans Available</h2>
                <p className="text-gray-400">Please check back later or contact support.</p>
             </div>
          ) : (
            <>
          {/* Online Plans */}
          {onlinePlans.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
              className="mb-24"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-14"
              >
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-br from-primary-600/30 to-primary-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20"
                >
                  <Video className="w-7 h-7 text-primary-500" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold text-white">
                      Online Coaching
                    </h2>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-br from-primary-600/40 to-primary-500/20 border border-primary-500/40 rounded-full min-w-fit px-3 py-1 text-sm font-bold text-primary-400 shadow-lg shadow-primary-600/20"
                    >
                      {onlinePlans.length} plans
                    </motion.span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Practice from anywhere, anytime
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {onlinePlans.map((plan, idx) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    type="online"
                    index={idx}
                    onPayment={(id) =>
                      navigate("/client/welcome/subscription/payment", {
                        state: { planId: id },
                      })
                    }
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Gym Plans */}
          {gymPlans.length > 0 && (
            <motion.section
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, type: "spring", stiffness: 80 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="flex items-center gap-4 mb-14"
                      >
                        <motion.div
                          whileHover={{ scale: 1.12 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="w-12 h-12 bg-gradient-to-br from-orange-600/30 to-orange-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20"
                        >
                          <Dumbbell className="w-7 h-7 text-orange-500" />
                        </motion.div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-bold text-white">Real Gym</h2>
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="bg-gradient-to-br from-orange-600/40 to-orange-500/20 border border-orange-500/40 rounded-full min-w-fit px-3 py-1 text-sm font-bold text-orange-400 shadow-lg shadow-orange-600/20"
                            >
                              {gymPlans.length} plans
                            </motion.span>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">
                            Train with equipment and trainers
                          </p>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gymPlans.map((plan, idx) => (
                          <PlanCard
                            key={plan.id}
                            plan={plan}
                            type="gym"
                            index={idx}
                            onPayment={(id) =>
                              navigate("/client/welcome/subscription/payment", {
                                state: { planId: id },
                              })
                            }
                          />
                        ))}
                      </div>
                    </motion.section>
                  )}
                </>
              )}
            </main>
      </div>
    </div>
  );
}
