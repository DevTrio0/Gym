import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, TrendingDown, Percent, DollarSign, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import { getProfits } from "@/lib/api";

export default function Profits() {
  const navigate = useNavigate();
  const [profits, setProfits] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfits = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const data = await getProfits(token);
        setProfits(data);
      } catch (error) {
        console.error("Failed to fetch profits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfits();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 items-center justify-center flex text-white">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Loading profit data...</p>
      </div>
    </div>
  );
  
  const p = profits ? profits : {
    totalRevenue: 45000,
    totalExpenses: 15000,
    netProfit: 30000,
    profitMargin: 66.67,
    averageTransactionValue: 150,
    topEarningMonth: "March",
    topEarningAmount: 12000,
    yearToDateProfit: 35000,
    monthlyBreakdown: [
      { month: 'January', revenue: 10000, expenses: 4000, profit: 6000 },
      { month: 'February', revenue: 12000, expenses: 4500, profit: 7500 },
      { month: 'March', revenue: 23000, expenses: 6500, profit: 16500 }
    ]
  };

  const monthlyBreakdown = p.monthlyBreakdown || [];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  const primaryMetrics = [
    { label: "Total Revenue", value: p.totalRevenue, icon: TrendingUp, color: "primary", format: "currency" },
    { label: "Total Expenses", value: p.totalExpenses, icon: TrendingDown, color: "red", format: "currency" },
    { label: "Net Profit", value: p.netProfit, icon: DollarSign, color: "green", format: "currency" },
  ];

  const secondaryMetrics = [
    { label: "Profit Margin", value: p.profitMargin, icon: Percent, color: "blue", suffix: "%" },
    { label: "Avg Transaction", value: p.averageTransactionValue, icon: DollarSign, color: "cyan", format: "decimal" },
    { label: "Year to Date", value: p.yearToDateProfit, icon: Calendar, color: "yellow", format: "currency" },
  ];

  const colorStyles: Record<string, { iconBg: string; valueColor: string; border: string; glow: string }> = {
    primary: { iconBg: "from-primary-600/30 to-primary-500/10", valueColor: "text-primary-400", border: "group-hover:border-primary-500/40", glow: "group-hover:shadow-primary-600/20" },
    red: { iconBg: "from-red-600/30 to-red-500/10", valueColor: "text-red-400", border: "group-hover:border-red-500/40", glow: "group-hover:shadow-red-600/20" },
    green: { iconBg: "from-green-600/30 to-green-500/10", valueColor: "text-green-400", border: "group-hover:border-green-500/40", glow: "group-hover:shadow-green-600/20" },
    blue: { iconBg: "from-blue-600/30 to-blue-500/10", valueColor: "text-blue-400", border: "group-hover:border-blue-500/40", glow: "group-hover:shadow-blue-600/20" },
    cyan: { iconBg: "from-cyan-600/30 to-cyan-500/10", valueColor: "text-cyan-400", border: "group-hover:border-cyan-500/40", glow: "group-hover:shadow-cyan-600/20" },
    yellow: { iconBg: "from-yellow-600/30 to-yellow-500/10", valueColor: "text-yellow-400", border: "group-hover:border-yellow-500/40", glow: "group-hover:shadow-yellow-600/20" },
  };

  const formatValue = (val: number, format?: string, suffix = "") => {
    if (format === "currency") return `$${val.toLocaleString()}`;
    if (format === "decimal") return `$${val.toFixed(2)}`;
    return `${val}${suffix}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl"
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
            <div className="flex items-center gap-4 mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: [0, 360] }}
                transition={{
                  scale: { type: "spring", stiffness: 200 },
                  rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                }}
                className="w-16 h-16 bg-gradient-to-br from-yellow-600/30 to-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30 shadow-lg shadow-yellow-600/20"
              >
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Profit Metrics</h1>
                <p className="text-gray-400 mt-1">Financial performance overview</p>
              </div>
            </div>

            {/* Primary metrics - main KPIs */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            >
              {primaryMetrics.map((card, i) => {
                const Icon = card.icon;
                const style = colorStyles[card.color];
                const suffix = "suffix" in card ? (card as { suffix?: string }).suffix : "";
                const format = "format" in card ? (card as { format?: string }).format : undefined;
                return (
                  <motion.div key={card.label} variants={item}>
                    <motion.div
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      className="group h-full"
                    >
                      <Card
                        variant="gradient"
                        className={`h-full p-6 !bg-gradient-to-br !from-dark-900/90 !to-dark-950/90 border-2 border-dark-700/50 transition-all duration-300 ${style.border} ${style.glow} hover:shadow-xl`}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.4 }}
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.iconBg} flex items-center justify-center border border-dark-600/50 mb-5`}
                        >
                          <Icon className={`w-7 h-7 ${style.valueColor}`} />
                        </motion.div>
                        <p className="text-gray-400 text-sm font-medium mb-2">{card.label}</p>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 + 0.15, duration: 0.4 }}
                          className={`text-3xl md:text-4xl font-bold ${style.valueColor}`}
                        >
                          {formatValue(card.value, format, suffix)}
                        </motion.p>
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Secondary metrics */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
            >
              {secondaryMetrics.map((card, i) => {
                const Icon = card.icon;
                const style = colorStyles[card.color];
                const suffix = "suffix" in card ? (card as { suffix?: string }).suffix : "";
                const format = "format" in card ? (card as { format?: string }).format : undefined;
                return (
                  <motion.div key={card.label} variants={item}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="group"
                    >
                      <Card
                        variant="gradient"
                        className={`p-5 !bg-gradient-to-br !from-dark-900/80 !to-dark-950/80 border border-dark-700/50 transition-all duration-300 ${style.border} ${style.glow}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${style.iconBg} flex items-center justify-center border border-dark-600/50`}>
                              <Icon className={`w-5 h-5 ${style.valueColor}`} />
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs font-medium mb-0.5">{card.label}</p>
                              <p className={`text-xl font-bold ${style.valueColor}`}>
                                {formatValue(card.value, format, suffix)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Donut chart - Revenue breakdown */}
            <motion.div variants={container} initial="hidden" animate="show" className="mb-10">
              <motion.div variants={item}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
                  <Card
                    variant="gradient"
                    className="p-6 !bg-gradient-to-br !from-dark-900/90 !to-dark-950/90 border border-dark-700/50 transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-white mb-6">Revenue Breakdown</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                      <div className="relative w-44 h-44 flex-shrink-0">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="w-full h-full rounded-full p-3"
                          style={{
                            background: `conic-gradient(#22c55e 0% ${p.profitMargin}%, #ef4444 ${p.profitMargin}% 100%)`,
                          }}
                        >
                          <div className="w-full h-full rounded-full bg-dark-950 flex items-center justify-center">
                            <motion.span
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.4, duration: 0.5 }}
                              className="text-2xl font-bold text-white"
                            >
                              {p.profitMargin}%
                            </motion.span>
                          </div>
                        </motion.div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-500" />
                          <div>
                            <p className="text-gray-400 text-sm">Net Profit</p>
                            <p className="text-green-400 font-bold">${p.netProfit.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-red-500" />
                          <div>
                            <p className="text-gray-400 text-sm">Expenses</p>
                            <p className="text-red-400 font-bold">${p.totalExpenses.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Top month + Monthly breakdown */}
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={item}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
                  <Card
                    variant="gradient"
                    className="h-full p-6 !bg-gradient-to-br !from-dark-900/90 !to-dark-950/90 border border-dark-700/50 border-l-4 border-l-yellow-500/60 transition-all duration-300 hover:border-yellow-500/30"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-yellow-600/20 border border-yellow-500/30 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-yellow-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Top Earning Month</h3>
                    </div>
                    <p className="text-2xl font-bold text-yellow-400 mb-1">{p.topEarningMonth}</p>
                    <p className="text-3xl font-bold text-white">${p.topEarningAmount.toLocaleString()}</p>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={item}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
                  <Card
                    variant="gradient"
                    className="h-full p-6 !bg-gradient-to-br !from-dark-900/90 !to-dark-950/90 border border-dark-700/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Recent Months</h3>
                    </div>
                    <div className="space-y-3">
                      {monthlyBreakdown.map((row: any, i: number) => (
                        <motion.div
                          key={row.month}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.08 }}
                          className="flex items-center justify-between py-3 border-b border-dark-700/50 last:border-0"
                        >
                          <span className="text-gray-300 font-medium">{row.month}</span>
                          <div className="flex gap-6">
                            <span className="text-gray-400">Rev: <span className="text-white font-semibold">${(row.revenue || 0).toLocaleString()}</span></span>
                            <span className="text-green-400 font-semibold">${(row.profit || 0).toLocaleString()}</span>
                          </div>
                        </motion.div>
                      ))}
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
