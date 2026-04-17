import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLocation } from "react-router-dom";
import { DEFAULT_PLANS } from "@/constants/subscriptionPlans";
import { makePayment, getToken, getSubscriptionPlans } from "@/lib/api";

export default function SubscriptionPayment() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [paymentState, setPaymentState] = useState<
    "idle" | "processing" | "success"
  >("idle");

  const location = useLocation();

  const [selectedPlanData, setSelectedPlanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [planIdFromNav, setPlanIdFromNav] = useState<string | null>(null);

  useEffect(() => {
    // Get planId from navigation state
    const state = location.state as { planId?: string };
    if (state && state.planId) {
      setPlanIdFromNav(state.planId);
      
      // Try to fetch plan from API first
      const fetchPlanData = async () => {
        try {
          const response = await getSubscriptionPlans();
          const plans = response.plans || [];
          const plan = plans.find((p: any) => p.id === state.planId);
          
          if (plan) {
            setSelectedPlanData({
              ...plan,
              billingPeriod: "monthly",
            });
          } else {
            // Fallback: use the planId directly (backend will validate)
            setSelectedPlanData({
              id: state.planId,
              name: "Selected Plan",
              price: 0,
              billingPeriod: "monthly",
            });
          }
        } catch (err) {
          console.error("Failed to fetch plan data:", err);
          // Fallback: use the planId directly
          setSelectedPlanData({
            id: state.planId,
            name: "Selected Plan",
            price: 0,
            billingPeriod: "monthly",
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchPlanData();
    } else {
      // Fallback: check localStorage
      const storagePlan = JSON.parse(
        localStorage.getItem("selectedPlan") || "{}",
      );
      if (storagePlan && storagePlan.name) {
        setSelectedPlanData(storagePlan);
      } else {
        setError("No plan selected. Please select a plan first.");
      }
      setLoading(false);
    }
  }, [location.state]);

  const isGymPlan =
    selectedPlanData?.category === "gym" ||
    selectedPlanData?.type === "gym" ||
    selectedPlanData?.type === "Real Gym";
  const themeColor = isGymPlan ? "orange" : "primary";
  const glowShadowColor = isGymPlan
    ? "hover:shadow-orange-500/10"
    : "hover:shadow-primary-500/10";
  const focusRingColor = isGymPlan
    ? "focus:ring-orange-500/50"
    : "focus:ring-primary-500/50";
  const focusBorderColor = isGymPlan
    ? "focus:border-orange-500"
    : "focus:border-primary-500";

  // Format card number with spaces (4 4 4 4)
  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) {
      return cleaned;
    }
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(null);

    if (name === "cardNumber") {
      const formatted = formatCardNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "expiryDate") {
      const formatted = formatExpiryDate(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "cvc") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCompletePayment = async () => {
    if (!selectedPlanData?.id && !planIdFromNav) {
      setError("Plan information is missing. Please go back and select a plan.");
      return;
    }

    if (!formData.cardName) {
      setError("Please enter cardholder name.");
      return;
    }
    if (
      !formData.cardNumber ||
      formData.cardNumber.replace(/\s/g, "").length !== 16
    ) {
      setError("Please enter a valid 16-digit card number.");
      return;
    }
    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      setError("Please enter expiry date in MM/YY format.");
      return;
    }
    if (!formData.cvc || formData.cvc.length < 3) {
      setError("Please enter a valid 3-4 digit CVC.");
      return;
    }

    setPaymentState("processing");
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");

      const planId = selectedPlanData?.id || planIdFromNav || "";
      if (!planId) throw new Error("Plan ID is required");

      console.log(`💳 Processing payment for planId: ${planId}`);
      
      await makePayment(token, planId, "credit_card", {
        cardName: formData.cardName,
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        method: selectedPlanData?.type || selectedPlanData?.category || 'gym'
      });

      setPaymentState("success");
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaymentState("idle");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 relative overflow-hidden py-12">
      {/* Subtle Glowing Lights for realism/animation */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {paymentState === "idle" && (
          <div
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors mb-10 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </div>
        )}

        {/* Success Modal Overlay */}
        <AnimatePresence>
          {paymentState === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
            >
              <motion.div
                key="success-popup"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="max-w-md w-full mx-auto"
              >
                <div className="bg-dark-900 border border-dark-800 rounded-2xl p-10 text-center shadow-2xl relative overflow-hidden">
                  {/* Decorative Header Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className={`absolute top-0 left-0 right-0 h-1 bg-${themeColor}-500 origin-left`}
                  />

                  {/* Checkmark Icon */}
                  <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1.5, 1], opacity: 1 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      className={`absolute inset-0 bg-${themeColor}-500/20 rounded-full blur-xl pointer-events-none`}
                    />
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        damping: 12,
                        stiffness: 200,
                        delay: 0.1,
                      }}
                      className={`relative w-20 h-20 bg-${themeColor}-500/10 text-${themeColor}-500 rounded-full flex items-center justify-center border border-${themeColor}-500/20 shadow-lg shadow-${themeColor}-500/20`}
                    >
                      <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                  </div>

                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    Payment Successful!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 mb-3 leading-relaxed"
                  >
                    Your subscription for{" "}
                    <span className="text-white font-semibold">
                      {selectedPlanData?.name || "the plan"}
                    </span>{" "}
                    is now active.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="text-gray-500 text-sm mb-8"
                  >
                    You will be charged{" "}
                    <span className="text-white font-semibold">
                      ${selectedPlanData?.price}.00
                    </span>{" "}
                    {selectedPlanData?.period}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Button
                      variant={isGymPlan ? "orange" : "primary"}
                      className="w-full py-4 text-sm font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all"
                      onClick={() => navigate("/client/welcome")}
                    >
                      Continue to Dashboard
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Form is always rendered */}
        <motion.div
          key="payment-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={
            paymentState === "success"
              ? "pointer-events-none opacity-50 blur-sm transition-all duration-500"
              : ""
          }
        >
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-3">Payment</h1>
            <p className="text-gray-400 text-sm md:text-base">
              Enter your payment details to complete your subscription
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
            {/* Payment Form Column */}
            <div className="lg:col-span-2 relative z-10">
              {/* LED Frame for Card Details */}
              <motion.div
                className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-${themeColor}-600 via-${themeColor}-400 to-${themeColor}-600 opacity-30 blur-md pointer-events-none`}
                animate={{
                  backgroundPosition: ["200% center", "-200% center"],
                }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                style={{ backgroundSize: "200% 100%" }}
              />
              <div
                className={`bg-dark-900 border border-dark-700/50 rounded-xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${glowShadowColor} group`}
              >
                {/* Subtle inner top highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

                <div className="flex items-center gap-4 mb-10">
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 5,
                    }}
                    className={`p-2.5 rounded-lg bg-${themeColor}-500/10 border border-${themeColor}-500/20`}
                  >
                    <CreditCard className={`w-6 h-6 text-${themeColor}-500`} />
                  </motion.div>
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    Card Details
                  </h2>
                </div>

                <div className="space-y-6">
                  <Input
                    label="Cardholder Name"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    disabled={paymentState === "processing"}
                    className={`!bg-transparent border-dark-600 text-gray-200 placeholder:text-gray-600 focus:ring-1 ${focusRingColor} ${focusBorderColor} hover:border-gray-500 transition-all shadow-none`}
                  />
                  <Input
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    disabled={paymentState === "processing"}
                    className={`!bg-transparent border-dark-600 text-gray-200 placeholder:text-gray-600 focus:ring-1 ${focusRingColor} ${focusBorderColor} hover:border-gray-500 transition-all font-mono tracking-widest shadow-none`}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <Input
                      label="Expiry Date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      disabled={paymentState === "processing"}
                      className={`!bg-transparent border-dark-600 text-gray-200 placeholder:text-gray-600 focus:ring-1 ${focusRingColor} ${focusBorderColor} hover:border-gray-500 transition-all shadow-none`}
                    />
                    <Input
                      label="CVC"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      disabled={paymentState === "processing"}
                      className={`!bg-transparent border-dark-600 text-gray-200 placeholder:text-gray-600 focus:ring-1 ${focusRingColor} ${focusBorderColor} hover:border-gray-500 transition-all font-mono shadow-none`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-10 text-xs text-gray-400">
                  <Lock className="w-4 h-4 text-primary-500" />
                  <span>Your payment is secure and encrypted</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 relative z-10">
              {/* LED Frame for Order Summary */}
              <motion.div
                className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-${themeColor}-600 via-${themeColor}-400 to-${themeColor}-600 opacity-30 blur-md pointer-events-none`}
                animate={{
                  backgroundPosition: ["200% center", "-200% center"],
                }}
                transition={{
                  duration: 8,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 0.5,
                }}
                style={{ backgroundSize: "200% 100%" }}
              />
              <div
                className={`bg-dark-900 border border-dark-700/50 rounded-xl p-8 shadow-2xl sticky top-8 transition-all duration-300 ${glowShadowColor} group`}
              >
                <h3 className="text-lg font-bold text-white mb-6 tracking-wide">
                  Order Summary
                </h3>

                <div className="space-y-5 mb-8 pb-6 border-b border-[#1e293b]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Selected Plan</span>
                    <span className="text-white font-semibold">
                      {selectedPlanData?.name || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Billing Period</span>
                    <span className="text-white font-semibold">
                      {selectedPlanData?.period || "Monthly"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Description</span>
                    <span className="text-gray-300 text-xs text-right max-w-xs">
                      {selectedPlanData?.description || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-semibold">
                      ${selectedPlanData?.price || "0.00"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-base font-bold text-white">Total</span>
                  <span className={`text-2xl font-bold text-${themeColor}-500`}>
                    ${selectedPlanData?.price || "0.00"}
                  </span>
                </div>

                <Button
                  variant={isGymPlan ? "orange" : "primary"}
                  className="w-full py-3.5 h-[50px] text-sm font-bold tracking-wide shadow-lg"
                  onClick={handleCompletePayment}
                  disabled={paymentState === "processing"}
                >
                  {paymentState === "processing" ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Complete Payment"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
