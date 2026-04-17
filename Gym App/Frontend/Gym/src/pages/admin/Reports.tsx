import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, TrendingUp, Users, UserPlus, CreditCard, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMonthlyReports } from "@/lib/api";

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await getMonthlyReports(token);
        setReports(response.reports || []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [navigate]);

  const totalRevenue = reports.reduce((sum, r) => sum + (r.totalRevenue || r.revenue || 0), 0);
  const totalNewClients = reports.reduce((sum, r) => sum + (r.totalClients || r.newClients || 0), 0);
  const totalTransactions = reports.reduce((sum, r) => sum + (r.totalTransactions || (r.transactions?.length) || 0), 0);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  const statCards = [
    { label: "Total Revenue (3mo)", value: totalRevenue, icon: TrendingUp, format: "currency", color: "primary" },
    { label: "New Clients", value: totalNewClients, icon: Users, format: "number", color: "green" },
    { label: "Transactions", value: totalTransactions, icon: CreditCard, format: "number", color: "purple" },
  ];

  const colorStyles: Record<string, { bg: string; text: string }> = {
    primary: { bg: "from-primary-600/20 to-primary-500/10 border-primary-500/30", text: "text-primary-400" },
    green: { bg: "from-green-600/20 to-green-500/10 border-green-500/30", text: "text-green-400" },
    purple: { bg: "from-purple-600/20 to-purple-500/10 border-purple-500/30", text: "text-purple-400" },
  };

  const formatValue = (val: number, format: string) => {
    if (format === "currency") return `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    return String(val);
  };

  const metricColors = [
    { label: "Revenue", key: "totalRevenue" as const, altKey: "revenue", color: "primary", format: "currency" },
    { label: "New Clients", key: "totalClients" as const, altKey: "newClients", color: "green", format: "number" },
    { label: "New Coaches", key: "totalCoaches" as const, altKey: "newCoaches", color: "blue", format: "number" },
    { label: "Total Users", key: "totalRegistrations" as const, altKey: "totalUsers", color: "cyan", format: "number" },
    { label: "Transactions", key: "transactions" as const, altKey: "totalTransactions", color: "purple", format: "number" },
  ];

  const metricColorClasses: Record<string, string> = {
    primary: "text-primary-400 border-primary-500/30",
    green: "text-green-400 border-green-500/30",
    blue: "text-blue-400 border-blue-500/30",
    cyan: "text-cyan-400 border-cyan-500/30",
    purple: "text-purple-400 border-purple-500/30",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: [0, 360],
                }}
                transition={{
                  scale: { type: "spring", stiffness: 200 },
                  rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                }}
                className="w-16 h-16 bg-gradient-to-br from-orange-600/30 to-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/30 shadow-lg shadow-orange-600/20"
              >
                <BarChart3 className="w-8 h-8 text-orange-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Monthly Reports</h1>
                <p className="text-gray-400 mt-1">Track gym performance metrics</p>
              </div>
            </div>

            {/* Summary stat cards */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
            >
              {statCards.map((card, i) => {
                const Icon = card.icon;
                const style = colorStyles[card.color];
                return (
                  <motion.div key={card.label} variants={item}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className={`group p-6 rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/60 border ${style.bg} border shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">{card.label}</p>
                          <p className={`text-2xl font-bold ${style.text}`}>{formatValue(Number(card.value), card.format)}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center border group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-6 h-6 ${style.text}`} />
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Monthly report cards */}
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
              {reports.map((report) => (
                <motion.div key={report.month} variants={item}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/60 border border-dark-700/80 overflow-hidden shadow-lg hover:shadow-xl hover:border-orange-500/30 transition-all"
                  >
                    <div className="p-6 border-b border-dark-700/50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center border border-orange-500/30">
                        <Activity className="w-5 h-5 text-orange-400" />
                      </div>
                      <h2 className="text-xl font-bold text-white">{report.month}</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                      {metricColors.map((m) => {
                        const val = report[m.key] || report[m.altKey || ''];
                        const cls = metricColorClasses[m.color];
                        const display = m.format === "currency" ? `$${Number(val || 0).toLocaleString()}` : String(val || 0);
                        return (
                          <div
                            key={m.key}
                            className="p-4 rounded-xl bg-dark-900/60 border border-dark-700/50 hover:border-dark-600 transition-colors"
                          >
                            <p className="text-gray-400 text-sm mb-1">{m.label}</p>
                            <p className={`text-xl font-bold ${cls.split(" ")[0]}`}>{display}</p>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
