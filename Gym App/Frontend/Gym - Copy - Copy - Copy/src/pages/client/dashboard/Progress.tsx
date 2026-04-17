import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, Activity, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getProgress, getToken } from "@/lib/api";

interface ProgressEntry {
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  notes: string;
}

interface Metric {
  label: string;
  current: number;
  previous: number;
  unit: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

export default function Progress() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [progressHistory, setProgressHistory] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await getProgress(token);
        
        if (response.status === 'success') {
          // Format history
          const history = (response.metricsHistory || []).map((entry: any) => ({
            date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            weight: entry.weight || 0,
            bodyFat: entry.bodyFat || 0,
            muscleMass: entry.muscleMass || 0,
            notes: entry.notes || ""
          })).reverse(); // Newest first

          setProgressHistory(history);

          // Calculate current metrics and trends
          if (history.length > 0) {
            const current = history[0];
            const previous = history.length > 1 ? history[1] : current;

            const dynamicMetrics: Metric[] = [
              {
                label: "Weight",
                current: current.weight,
                previous: previous.weight,
                unit: "kg",
                icon: <Activity className="w-6 h-6" />,
                trend: current.weight <= previous.weight ? "down" : "up",
              },
              {
                label: "Body Fat",
                current: current.bodyFat,
                previous: previous.bodyFat,
                unit: "%",
                icon: <Target className="w-6 h-6" />,
                trend: current.bodyFat <= previous.bodyFat ? "down" : "up",
              },
              {
                label: "Muscle Mass",
                current: current.muscleMass,
                previous: previous.muscleMass,
                unit: "kg",
                icon: <TrendingUp className="w-6 h-6" />,
                trend: current.muscleMass >= previous.muscleMass ? "up" : "down",
              },
            ];
            setMetrics(dynamicMetrics);
          }
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Your Progress
            </h1>
            <p className="text-gray-400">
              Track your fitness journey and improvements
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/client/welcome/progress/update")}
          >
            Log Progress
          </Button>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {metrics.map((metric, index) => {
            const change =
              metric.trend === "down"
                ? metric.previous - metric.current
                : metric.current - metric.previous;

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center text-primary-500 border border-primary-500/30">
                      {metric.icon}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        metric.trend === "down"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {metric.trend === "down" ? "↓" : "↑"} {change.toFixed(1)}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">
                      {metric.current}
                    </span>
                    <span className="text-gray-400">{metric.unit}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Previous: {metric.previous} {metric.unit}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progress History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Progress History
          </h2>
          <Card variant="glass" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                      Weight (kg)
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                      Body Fat (%)
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                      Muscle Mass (kg)
                    </th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-semibold">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {progressHistory.map((entry, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-white">{entry.date}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {entry.weight}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {entry.bodyFat}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {entry.muscleMass}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {entry.notes}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Progress Charts Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Visual Progress
          </h2>
          <Card variant="glass" className="p-8">
            <div className="h-64 bg-dark-900 rounded-lg flex items-center justify-center border border-dark-700">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-primary-500 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">Progress charts coming soon</p>
                <p className="text-gray-500 text-sm">
                  More data entries needed for charts
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
