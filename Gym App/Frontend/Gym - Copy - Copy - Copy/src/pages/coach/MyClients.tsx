import { motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MOCK_CLIENTS } from "@/constants/mockClients";

export default function CoachMyClients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/coach/dashboard/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch clients");
        const data = await response.json();
        setClients(data.clients || []);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setClients(MOCK_CLIENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Clients</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {clients.length} {clients.length === 1 ? "client" : "clients"} assigned
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin">
                <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading clients...</p>
            </div>
          </div>
        )}

        {!loading && clients.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No clients yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Clients will appear here when they book workouts</p>
          </div>
        )}

        {!loading && clients.length > 0 && (
          <div className="space-y-4">
            {clients.map((client: any, idx: number) => (
              <motion.div
                key={client._id || `client-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{client.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                    Premium
                  </span>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem("selectedClientId", client._id);
                    navigate(`/coach/client/${client._id}/notes`);
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Add Notes
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
