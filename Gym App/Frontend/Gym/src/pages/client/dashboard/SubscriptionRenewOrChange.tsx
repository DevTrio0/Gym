import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Video,
  Dumbbell,
  Check,
  LucideIcon,
  Zap,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface Subscription {
  id?: string;
  name: string;
  price: string | number;
  nextRenewal?: string;
  autoRenew?: boolean;
  status?: string;
  type?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number | string;
  period?: string;
  description?: string;
  features: string[];
  recommended?: boolean;
  icon?: LucideIcon;
  type?: string;
  durationDays?: number;
}

// Online Coaching Plans
const onlineCoachingPlans: Plan[] = [
  {
    id: "online-basic",
    name: "Starter Online",
    price: "29.99",
    period: "/month",
    description: "Start your fitness journey",
    features: [
      "2 video coaching sessions/week",
      "Workout templates",
      "Basic progress tracking",
    ],
    icon: Video,
    type: "Online Coaching",
    durationDays: 7,
  },
  {
    id: "online-pro",
    name: "Pro Online",
    price: "49.99",
    period: "/month",
    description: "Advanced online coaching",
    features: [
      "Unlimited video coaching",
      "Custom meal plans",
      "24/7 support",
      "Performance analytics",
    ],
    icon: Video,
    recommended: true,
    type: "Online Coaching",
    durationDays: 30,
  },
  {
    id: "online-elite",
    name: "Elite Online",
    price: "79.99",
    period: "/month",
    description: "Premium online experience",
    features: [
      "Unlimited 1-on-1 sessions",
      "Full nutrition planning",
      "Priority support",
      "Monthly reviews",
      "Exclusive content",
    ],
    icon: Video,
    type: "Online Coaching",
    durationDays: 90,
  },
];

// Real Gym Plans
const realGymPlans: Plan[] = [
  {
    id: "gym-basic",
    name: "Gym Starter",
    price: "39.99",
    period: "/month",
    description: "Gym access only",
    features: ["24/7 gym access", "All equipment available", "Locker access"],
    icon: Dumbbell,
    type: "Real Gym",
    durationDays: 14,
  },
  {
    id: "gym-pro",
    name: "Gym Pro",
    price: "59.99",
    period: "/month",
    description: "Gym + coaching sessions",
    features: [
      "24/7 gym access",
      "2 coaching sessions/week",
      "Locker access",
      "Progress tracking",
    ],
    icon: Dumbbell,
    recommended: true,
    type: "Real Gym",
    durationDays: 60,
  },
  {
    id: "gym-elite",
    name: "Gym Elite",
    price: "89.99",
    period: "/month",
    description: "Full gym experience",
    features: [
      "24/7 gym access",
      "Unlimited coaching",
      "Personal locker",
      "Nutrition planning",
      "Class membership",
    ],
    icon: Dumbbell,
    type: "Real Gym",
    durationDays: 365,
  },
];

const allPlans = [...onlineCoachingPlans, ...realGymPlans];

export default function SubscriptionRenewOrChange() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // Initialize subscription from localStorage using initializer function
  const [currentSubscription] = useState<Subscription | null>(() => {
    const saved = localStorage.getItem("currentSubscription");
    if (saved) {
      const subscription = JSON.parse(saved);
      return subscription;
    }
    return {
      name: "No Active Plan",
      price: "$0.00",
      status: "Inactive",
      nextRenewal: "N/A",
    };
  });

  const [autoRenew, setAutoRenew] = useState(() => {
    const saved = localStorage.getItem("currentSubscription");
    if (saved) {
      const subscription = JSON.parse(saved);
      return subscription.autoRenew !== false;
    }
    return true;
  });

  const handleAutoRenewToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (currentSubscription?.name !== "No Active Plan") {
        const newAutoRenewState = !autoRenew;
        setAutoRenew(newAutoRenewState);

        // Update localStorage to persist the change
        const saved = localStorage.getItem("currentSubscription");
        if (saved) {
          const subscription = JSON.parse(saved);
          subscription.autoRenew = newAutoRenewState;
          localStorage.setItem(
            "currentSubscription",
            JSON.stringify(subscription),
          );
        }
      }
    },
    [autoRenew, currentSubscription?.name],
  );

  const handleChangePlan = (planId: string) => {
    // Save selected plan for payment
    const planDetails = allPlans.find((p) => p.id === planId);
    if (planDetails) {
      localStorage.setItem(
        "selectedPlan",
        JSON.stringify({
          id: planDetails.id,
          name: planDetails.name,
          price:
            typeof planDetails.price === "string"
              ? planDetails.price.replace("$", "")
              : planDetails.price,
          period: planDetails.period || "/month",
          description: planDetails.description,
          type: planDetails.type,
          durationDays: planDetails.durationDays || 30,
        }),
      );
      navigate("/client/welcome/subscription/payment");
    }
  };

  const handleRenew = () => {
    // Save current plan for renewal
    if (currentSubscription && currentSubscription.name !== "No Active Plan") {
      localStorage.setItem(
        "selectedPlan",
        JSON.stringify({
          name: currentSubscription.name,
          price: currentSubscription.price,
          type: "Renewal",
        }),
      );
    }
    navigate("/dashboard/subscription/payment");
  };

  // Calculate days remaining
  const getDaysRemaining = (): number | null => {
    if (
      currentSubscription?.nextRenewal &&
      currentSubscription?.nextRenewal !== "N/A"
    ) {
      const renewalDate = new Date(currentSubscription.nextRenewal);
      const today = new Date();
      const diffTime = renewalDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return null;
  };

  const daysRemaining = getDaysRemaining();

  const CurrentSubCard = ({
    currentSubscription,
    autoRenew,
  }: {
    currentSubscription: Subscription | null;
    autoRenew: boolean;
  }) => {
    return (
      <div className="relative group">
        {/* Animated Glow Background */}
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-br from-primary-600/30 to-primary-500/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
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

        <Card
          variant="glass"
          className="relative p-8 bg-gradient-to-br from-dark-900 to-dark-950 border-2 border-dark-700 group-hover:border-primary-500/60 rounded-2xl backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl shadow-dark-950/50 group-hover:shadow-xl group-hover:shadow-primary-600/30"
        >
          {/* Interior Glow Light */}
          <motion.div
            className="absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-br from-primary-600/30 to-primary-500/10 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity duration-500"
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />

          <div className="relative z-10">
            {/* Header with Plan Name */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between mb-4"
              >
                <div>
                  <p className="text-gray-400 text-sm uppercase font-bold tracking-wider mb-2">
                    Current Plan
                  </p>
                  <h3 className="text-4xl font-bold text-white">
                    {currentSubscription?.name}
                  </h3>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600/30 to-primary-500/20 flex items-center justify-center"
                >
                  <CreditCard className="w-7 h-7 text-primary-400" />
                </motion.div>
              </motion.div>

              {currentSubscription?.name !== "No Active Plan" && (
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">
                    ${currentSubscription?.price}
                  </span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-primary-500/20 via-primary-500/5 to-transparent mb-8" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Days Remaining */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">
                  Days Remaining
                </p>
                {currentSubscription?.name !== "No Active Plan" &&
                daysRemaining !== null ? (
                  <div>
                    <p
                      className={`text-3xl font-bold ${
                        daysRemaining <= 7
                          ? "text-orange-400"
                          : daysRemaining <= 14
                            ? "text-yellow-400"
                            : "text-green-400"
                      }`}
                    >
                      {daysRemaining}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      {daysRemaining === 0
                        ? "Expires today"
                        : daysRemaining === 1
                          ? "1 day remaining"
                          : `${daysRemaining} days left`}
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-gray-500">-</p>
                )}
              </motion.div>

              {/* Next Renewal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Renews On
                </p>
                <p className="text-2xl font-bold text-white">
                  {currentSubscription?.nextRenewal}
                </p>
              </motion.div>

              {/* Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">
                  Status
                </p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                    currentSubscription?.status === "Active"
                      ? "bg-gradient-to-r from-green-600/40 to-green-500/20 border border-green-500/40 text-green-300"
                      : "bg-gradient-to-r from-red-600/40 to-red-500/20 border border-red-500/40 text-red-300"
                  }`}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-current"
                  />
                  {currentSubscription?.status || "Inactive"}
                </motion.div>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-primary-500/20 via-primary-500/5 to-transparent mb-8" />

            {/* Auto-Renewal Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                  Auto-Renewal
                </p>
                <p className="text-gray-300 text-sm">
                  {autoRenew
                    ? "Your subscription will renew automatically"
                    : "Your subscription will not renew"}
                </p>
              </div>

              <motion.button
                onClick={handleAutoRenewToggle}
                disabled={currentSubscription?.name === "No Active Plan"}
                whileHover={{
                  scale:
                    currentSubscription?.name !== "No Active Plan" ? 1.05 : 1,
                }}
                whileTap={{
                  scale:
                    currentSubscription?.name !== "No Active Plan" ? 0.95 : 1,
                }}
                className={`relative inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  autoRenew
                    ? "bg-gradient-to-r from-primary-600/40 to-primary-500/20 border border-primary-500/40 text-primary-300 shadow-lg shadow-primary-600/20"
                    : "bg-gradient-to-r from-dark-700/40 to-dark-600/20 border border-dark-500/40 text-gray-400 shadow-lg shadow-dark-600/20"
                } ${currentSubscription?.name === "No Active Plan" ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-xl"}`}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: autoRenew ? 1 : 0.8,
                    opacity: autoRenew ? 1 : 0.6,
                  }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    autoRenew
                      ? "bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-600/40"
                      : "bg-dark-500"
                  }`}
                >
                  {autoRenew && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                <span className="font-bold">
                  {autoRenew ? "Enabled" : "Disabled"}
                </span>
              </motion.button>
            </motion.div>
          </div>
        </Card>
      </div>
    );
  };

  const getPlanTypeConfig = (type: string | undefined) => {
    const isOnline = type === "Online Coaching";
    const baseColor = isOnline ? "primary" : "orange";
    const glowColor = isOnline
      ? "from-primary-600/30 to-primary-500/10"
      : "from-orange-600/30 to-orange-500/10";
    const iconColor = isOnline ? "text-primary-400" : "text-orange-400";
    const iconWrapperGradient = isOnline
      ? "from-primary-600/40 to-primary-500/20 group-hover:from-primary-600/60 group-hover:to-primary-500/40"
      : "from-orange-600/40 to-orange-500/20 group-hover:from-orange-600/60 group-hover:to-orange-500/40";
    const borderHover = isOnline
      ? "group-hover:border-primary-500/60"
      : "group-hover:border-orange-500/60";
    const shadowHover = isOnline
      ? "group-hover:shadow-primary-600/30"
      : "group-hover:shadow-orange-600/30";
    const badgeBg = isOnline
      ? "from-primary-600 to-primary-500 shadow-primary-600/40"
      : "from-orange-600 to-orange-500 shadow-orange-600/40";
    const checkBg = isOnline
      ? "from-primary-600/40 to-primary-500/20 border-primary-500/30 shadow-primary-600/20"
      : "from-orange-600/40 to-orange-500/20 border-orange-500/30 shadow-orange-600/20";
    const checkIcon = isOnline ? "text-primary-300" : "text-orange-300";
    const btnVariant = isOnline ? "primary" : "orange";
    const btnShadow = isOnline
      ? "shadow-primary-600/30"
      : "shadow-orange-600/30";

    return {
      glowColor,
      iconColor,
      iconWrapperGradient,
      borderHover,
      shadowHover,
      badgeBg,
      checkBg,
      checkIcon,
      btnVariant,
      btnShadow,
    };
  };

  const PlanCard = ({ plan, index }: { plan: Plan; index: number }) => {
    const IconComponent = plan.icon!;
    const config = getPlanTypeConfig(plan.type);

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
            className={`absolute -inset-0.5 bg-gradient-to-br ${config.glowColor} rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500`}
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
          <div
            className={`relative bg-gradient-to-br from-dark-900 to-dark-950 border-2 border-dark-700 ${config.borderHover} rounded-2xl p-8 h-full flex flex-col backdrop-blur-xl transition-all duration-500 overflow-hidden shadow-2xl shadow-dark-950/50 group-hover:shadow-xl ${config.shadowHover}`}
          >
            {/* Interior Glow Light */}
            <motion.div
              className={`absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-br ${config.glowColor} rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity duration-500`}
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
              className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-${plan.type === "Online Coaching" ? "primary" : "orange"}-500/5 to-transparent rounded-full blur-3xl pointer-events-none`}
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
            {plan.recommended && (
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
                  className={`flex items-center gap-2 bg-gradient-to-r ${config.badgeBg} text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl`}
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
                className={`w-16 h-16 bg-gradient-to-br ${config.iconWrapperGradient} rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-lg`}
              >
                <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
              </motion.div>

              {/* Plan Name & Description */}
              <h3 className="text-2xl font-bold text-white mb-1">
                {plan.name}
              </h3>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

              {/* Price Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 + 0.15 }}
                className="mb-8 pb-8 border-b border-dark-700"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
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
                        className={`w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0 bg-gradient-to-br ${config.checkBg} rounded-full border shadow-lg`}
                      >
                        <Check className={`w-3 h-3 ${config.checkIcon}`} />
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
                  variant={config.btnVariant}
                  onClick={() => handleChangePlan(plan.id)}
                  className={`w-full py-3 font-bold flex items-center justify-center gap-2 group/btn text-base shadow-lg ${config.btnShadow}`}
                >
                  <motion.div
                    animate={{ y: [0, 2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <CreditCard className="w-5 h-5" />
                  </motion.div>
                  <span>Change to This Plan</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
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

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors mb-8 cursor-pointer group w-fit"
          >
            <motion.div whileHover={{ x: -3 }}>
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
            <span className="group-hover:translate-x-1 transition-transform">
              Back
            </span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-5xl font-bold text-white mb-3">
              Manage Your Subscription
            </h1>
            <p className="text-gray-400 text-lg">
              Renew your current plan or upgrade to a better one
            </p>
          </motion.div>

          {/* Current Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 group"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Current Subscription
            </h2>
            <CurrentSubCard
              currentSubscription={currentSubscription}
              autoRenew={autoRenew}
            />
          </motion.div>

          {/* All Available Plans Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            {/* Online Coaching Plans */}
            {onlineCoachingPlans.length > 0 && (
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
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
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
                        {onlineCoachingPlans.length} plans
                      </motion.span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Practice from anywhere, anytime
                    </p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {onlineCoachingPlans.map((plan, idx) => (
                    <PlanCard key={plan.id} plan={plan} index={idx} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Real Gym Plans */}
            {realGymPlans.length > 0 && (
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
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 bg-gradient-to-br from-orange-600/30 to-orange-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20"
                  >
                    <Dumbbell className="w-7 h-7 text-orange-500" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-4xl font-bold text-white">
                        Real Gym
                      </h2>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-br from-orange-600/40 to-orange-500/20 border border-orange-500/40 rounded-full min-w-fit px-3 py-1 text-sm font-bold text-orange-400 shadow-lg shadow-orange-600/20"
                      >
                        {realGymPlans.length} plans
                      </motion.span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Train with equipment and trainers
                    </p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {realGymPlans.map((plan, idx) => (
                    <PlanCard key={plan.id} plan={plan} index={idx} />
                  ))}
                </div>
              </motion.section>
            )}
          </motion.div>

          {/* Renew Current Plan Section */}
        </div>
      </div>
    </div>
  );
}
