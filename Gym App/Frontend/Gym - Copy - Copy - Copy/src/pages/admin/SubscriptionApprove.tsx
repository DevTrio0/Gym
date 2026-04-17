import { motion } from "framer-motion";
import { ArrowLeft, Package, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { useState, useEffect } from "react";
import { getAllCoaches, approveCoach } from "@/lib/api";

export default function SubscriptionApprove() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await getAllCoaches(token);
        console.log('getAllCoaches response:', response);
        setPending(response.coaches || []);
      } catch (error) {
        console.error('Failed to fetch coaches:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch coaches');
        setPending([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [navigate]);

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await approveCoach(token, id);
      if (response.status === 'success') {
        alert('Coach approved successfully');
        setPending(prev => prev.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error('Failed to approve coach:', error);
      alert('Failed to approve coach');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-indigo-600/30 to-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-lg shadow-indigo-600/20"
                >
                  <Package className="w-8 h-8 text-indigo-400" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">All Coaches</h1>
                  <p className="text-gray-400 mt-1">Review all coaches in the system (auto-approved upon creation)</p>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 px-6 py-4 bg-dark-800/80 rounded-2xl border border-dark-700"
              >
                <Package className="w-6 h-6 text-indigo-400" />
                <div>
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-2xl font-bold text-indigo-400">{pending.length}</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {error && (
                <Card variant="gradient" className="p-6 border border-red-500/30 bg-red-500/10">
                  <p className="text-red-400 font-semibold text-center">{error}</p>
                </Card>
              )}
              {loading ? (
                <Card variant="gradient" className="p-12 text-center border border-dark-700/50">
                  <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">Loading coaches...</h2>
                </Card>
              ) : pending.length === 0 ? (
                <Card variant="gradient" className="p-12 text-center border border-dark-700/50">
                  <Check className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">
                    No coaches yet
                  </h2>
                  <p className="text-gray-400">
                    No coaches have been added to the system.
                  </p>
                </Card>
              ) : (
                pending.map((coach) => (
                  <motion.div key={coach._id} variants={item}>
                    <Card variant="gradient" hover className="p-6 border border-dark-700/50 hover:border-indigo-500/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{coach.name}</h3>
                          <p className="text-gray-400 text-sm mb-3">{coach.email}</p>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="text-gray-400">
                              Specialty: <span className="text-white">{coach.specialization || coach.specialty || "General"}</span>
                            </span>
                            <span className="text-gray-400">
                              Registered: <span className="text-white">{new Date(coach.createdAt).toLocaleDateString()}</span>
                            </span>
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                              {coach.status}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          onClick={() => handleApprove(coach._id)}
                          className="shrink-0 flex items-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Approve
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
