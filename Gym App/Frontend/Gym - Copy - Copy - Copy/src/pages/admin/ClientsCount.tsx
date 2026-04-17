import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Users2, UserCheck, UserX, Crown, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "@/lib/api";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ClientsCount() {
  const navigate = useNavigate();
  const [adminClients, setAdminClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const data = await getAllClients(token);
        setAdminClients(data.clients || []);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [navigate]);

  const stats = useMemo(() => {
    const total = adminClients.length;
    const active = adminClients.filter(c => c.status === 'active').length;
    const inactive = total - active;
    
    // Derived stats for demo purposes since we don't have premium flag yet
    return {
      totalClients: total,
      activeClients: active,
      inactiveClients: inactive,
      premiumClients: adminClients.filter(c => c.subscription?.status === 'active').length,
      basicClients: total - adminClients.filter(c => c.subscription?.status === 'active').length,
    };
  }, [adminClients]);

  const statCards = [
    { label: "Total Clients", value: stats.totalClients, icon: Users2, color: "primary" },
    { label: "Active", value: stats.activeClients, icon: UserCheck, color: "green" },
    { label: "Inactive", value: stats.inactiveClients, icon: UserX, color: "red" },
    { label: "Premium", value: stats.premiumClients, icon: Crown, color: "yellow" },
    { label: "Basic", value: stats.basicClients, icon: Zap, color: "blue" },
  ];

  const colorStyles: Record<string, { bg: string; text: string }> = {
    primary: { bg: "from-primary-600/20 to-primary-500/10 border-primary-500/30", text: "text-primary-400" },
    green: { bg: "from-green-600/20 to-green-500/10 border-green-500/30", text: "text-green-400" },
    red: { bg: "from-red-600/20 to-red-500/10 border-red-500/30", text: "text-red-400" },
    yellow: { bg: "from-yellow-600/20 to-yellow-500/10 border-yellow-500/30", text: "text-yellow-400" },
    blue: { bg: "from-blue-600/20 to-blue-500/10 border-blue-500/30", text: "text-blue-400" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"
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
                className="w-16 h-16 bg-gradient-to-br from-teal-600/30 to-teal-500/20 rounded-2xl flex items-center justify-center border border-teal-500/30 shadow-lg shadow-teal-600/20"
              >
                <Users2 className="w-8 h-8 text-teal-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Clients Count</h1>
                <p className="text-gray-400 mt-1">View client statistics and profiles</p>
              </div>
            </div>

            {/* Stat cards */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10"
            >
              {statCards.map((card) => {
                const Icon = card.icon;
                const style = colorStyles[card.color];
                return (
                  <motion.div key={card.label} variants={item}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className={`group p-6 rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/60 border ${style.bg} shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center border mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${style.text}`} />
                      </div>
                      <p className="text-gray-400 text-sm mb-1">{card.label}</p>
                      <p className={`text-3xl font-bold ${style.text}`}>{card.value}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Client list table */}
            <motion.div variants={item}>
              <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/60 border border-dark-700/80 overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="p-6 border-b border-dark-700/50">
                  <h2 className="text-xl font-bold text-white">Client List</h2>
                  <p className="text-gray-400 text-sm mt-1">Members added via Add Client</p>
                </div>
                {adminClients.length === 0 ? (
                  <div className="p-16 text-center">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex w-20 h-20 rounded-full bg-dark-800/80 items-center justify-center mb-4"
                    >
                      <Users2 className="w-10 h-10 text-gray-500" />
                    </motion.div>
                    <p className="text-gray-400 text-lg mb-2">No clients yet</p>
                    <p className="text-gray-500 text-sm">Add clients from the Add Client page.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-dark-700 bg-dark-900/50">
                          <th className="px-6 py-4 text-left text-gray-400 font-semibold">Name</th>
                          <th className="px-6 py-4 text-left text-gray-400 font-semibold">Email</th>
                          <th className="px-6 py-4 text-left text-gray-400 font-semibold">Coach</th>
                          <th className="px-6 py-4 text-left text-gray-400 font-semibold">Subscription</th>
                          <th className="px-6 py-4 text-left text-gray-400 font-semibold">Plan</th>
                          <th className="px-6 py-4 text-left text-gray-400 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminClients.map((client: any, idx: number) => (
                          <motion.tr
                            key={client._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="border-b border-dark-700/50 hover:bg-dark-800/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-white font-medium">{client.name}</td>
                            <td className="px-6 py-4 text-gray-400 text-sm">{client.email}</td>
                            <td className="px-6 py-4 text-gray-400 text-sm">{client.coachName || "—"}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize border ${
                                client.subscription?.status === 'active' 
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                              }`}>
                                {client.subscription?.status || 'inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm">{client.subscription?.planId?.name || client.subscription?.plan || "—"}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize border ${
                                client.status === 'active'
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                  : 'bg-red-500/20 text-red-400 border-red-500/30'
                              }`}>
                                {client.status}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
