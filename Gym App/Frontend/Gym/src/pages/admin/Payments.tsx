import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, DollarSign, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import { getPayments } from "@/lib/api";

const getStatusColor = (status: string) => {
  if (!status) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "failed":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export default function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await getPayments(token);
        setPayments(response.payments || []);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [navigate]);

  const totalAmount = payments.filter((p) => p.status === "completed").reduce((s, p) => s + (p.amount || 0), 0);
  const completedCount = payments.filter((p) => p.status === "completed").length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  const statCards = [
    { label: "Total Collected", value: totalAmount, icon: DollarSign, color: "primary", format: "currency" },
    { label: "Completed", value: completedCount, icon: CheckCircle, color: "green" },
    { label: "Pending", value: pendingCount, icon: Clock, color: "yellow" },
  ];

  const colorStyles: Record<string, { bg: string; text: string }> = {
    primary: { bg: "from-primary-600/20 to-primary-500/10 border-primary-500/30", text: "text-primary-400" },
    green: { bg: "from-green-600/20 to-green-500/10 border-green-500/30", text: "text-green-400" },
    yellow: { bg: "from-yellow-600/20 to-yellow-500/10 border-yellow-500/30", text: "text-yellow-400" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-50 border-b border-dark-800 backdrop-blur-lg bg-dark-900/50">
          <div className="container mx-auto px-4 py-4">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Admin</span>
            </motion.button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: [0, 360] }}
                transition={{
                  scale: { type: "spring", stiffness: 200 },
                  rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                }}
                className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-600/20"
              >
                <CreditCard className="w-8 h-8 text-purple-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Payment Transactions</h1>
                <p className="text-gray-400 mt-1">View all payment records</p>
              </div>
            </div>

            {/* Stat cards */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
            >
              {statCards.map((card, i) => {
                const Icon = card.icon;
                const style = colorStyles[card.color];
                const formatted =
                  card.format === "currency"
                    ? `$${Number(card.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    : String(card.value);
                return (
                  <motion.div key={card.label} variants={item}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="group"
                    >
                      <Card
                        variant="gradient"
                        className={`p-5 !bg-gradient-to-br !from-dark-900/90 !to-dark-950/90 border border-dark-700/50 transition-all duration-300 group-hover:border-purple-500/30 group-hover:shadow-lg group-hover:shadow-purple-600/10`}
                      >
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center border`}
                          >
                            <Icon className={`w-6 h-6 ${style.text}`} />
                          </motion.div>
                          <div>
                            <p className="text-gray-400 text-sm font-medium mb-0.5">{card.label}</p>
                            <p className={`text-2xl font-bold ${style.text}`}>{formatted}</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Transactions table */}
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={item}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Card
                    variant="gradient"
                    className="overflow-hidden !bg-gradient-to-br !from-dark-900/90 !to-dark-950/90 border border-dark-700/50"
                  >
                    <div className="p-6 border-b border-dark-700/50 bg-dark-800/20">
                      <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                      <p className="text-gray-400 text-sm mt-0.5">{payments.length} records</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-dark-700 bg-dark-900/30">
                            <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm uppercase tracking-wider">Client</th>
                            <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm uppercase tracking-wider">Method</th>
                            <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-gray-400 font-semibold text-sm uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment, i) => (
                            <motion.tr
                              key={payment._id}
                              variants={item}
                              initial="hidden"
                              animate="show"
                              whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                              transition={{ duration: 0.15 }}
                              className="border-b border-dark-700/30"
                            >
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-white font-medium">{payment.clientName || payment.clientId?.name || 'Unknown'}</p>
                                  <p className="text-gray-500 text-xs">{payment.email || payment.clientId?.email || 'N/A'}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-primary-400 font-bold">${(payment.amount || 0).toFixed(2)}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-gray-300 capitalize text-sm">{payment.method}</span>
                              </td>
                              <td className="px-6 py-4">
                                <motion.span
                                  whileHover={{ scale: 1.05 }}
                                  className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize ${getStatusColor(payment.status)}`}
                                >
                                  {payment.status}
                                </motion.span>
                              </td>
                              <td className="px-6 py-4 text-gray-400 text-sm">{new Date(payment.date || payment.createdAt).toLocaleDateString()}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
