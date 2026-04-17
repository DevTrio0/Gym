import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MOCK_CLIENTS } from "@/constants/mockClients";

export default function CoachMyClients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch clients from backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await fetch("http://localhost:5000/coach/dashboard/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const data = await response.json();
        setClients(data.clients || []);
        setError("");
      } catch (err) {
        console.error("Error fetching clients:", err);
        // Fallback to mock data if fetch fails
        setClients(MOCK_CLIENTS);
        setError("Using demo data - could not load from server");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddNotes = (clientId: number | string) => {
    localStorage.setItem("selectedClientId", clientId.toString());
    navigate(`/coach/client/${clientId}/notes`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-dark-800 backdrop-blur-lg bg-dark-900/50">
          <div className="container mx-auto px-4 py-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBack}
              className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </motion.button>
            <h1 className="text-4xl font-bold text-white">My Clients</h1>
            {loading ? (
              <p className="text-gray-400 mt-2">Loading clients...</p>
            ) : (
              <p className="text-gray-400 mt-2">
                Manage and track your {clients.length} active clients
              </p>
            )}
            {error && <p className="text-yellow-600 mt-2 text-sm">{error}</p>}
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-6"
                >
                  <Loader className="w-12 h-12 text-primary-500" />
                </motion.div>
                <p className="text-gray-400 text-lg">Loading your clients...</p>
              </motion.div>
            )}

            {/* Stats Section */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative p-6 rounded-xl border border-dark-700 bg-dark-900/50 hover:border-primary-500/50 transition-colors group overflow-hidden"
                  whileHover={{ y: -2 }}
                >
                  <div className="relative z-10 text-center">
                    <p className="text-gray-400 text-sm mb-2">Total Clients</p>
                    <p className="text-4xl font-bold text-primary-500">
                      {clients.length}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative p-6 rounded-xl border border-dark-700 bg-dark-900/50 hover:border-green-500/50 transition-colors group overflow-hidden"
                  whileHover={{ y: -2 }}
                >
                  <div className="relative z-10 text-center">
                    <p className="text-gray-400 text-sm mb-2">Average Progress</p>
                    <p className="text-4xl font-bold text-green-500">
                      {clients.length > 0
                        ? (
                            clients.reduce((acc, c) => acc + (c.progress || 0), 0) /
                              clients.length
                          ).toFixed(0)
                        : 0}
                      %
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative p-6 rounded-xl border border-dark-700 bg-dark-900/50 hover:border-blue-500/50 transition-colors group overflow-hidden"
                  whileHover={{ y: -2 }}
                >
                  <div className="relative z-10 text-center">
                    <p className="text-gray-400 text-sm mb-2">Active Clients</p>
                    <p className="text-4xl font-bold text-blue-500">
                      {clients.filter((c) => c.status === "active").length}
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* No Clients Message */}
            {!loading && clients.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-gray-400 text-lg mb-4">No clients yet</p>
                <p className="text-gray-500">
                  Clients will appear here once they book a workout with you
                </p>
              </motion.div>
            )}

            {/* Clients List */}
            {!loading && clients.length > 0 && (
              <div className="space-y-4">
                {clients.map((client, index) => (
                  <motion.div
                    key={client._id || client.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 to-primary-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    <div className="relative bg-dark-900/50 border border-dark-700 rounded-xl p-6 hover:border-primary-500/40 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {client.name}
                          </h3>
                          <p className="text-gray-400 text-sm">{client.email}</p>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedClientId(
                              expandedClientId === client.id ? null : client.id
                            )
                          }
                          className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                        >
                          <ChevronDown
                            className={`w-5 h-5 text-primary-500 transition-transform ${
                              expandedClientId === client.id
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleAddNotes(client._id || client.id)
                          }
                          className="flex-1 px-4 py-2 bg-primary-600/20 text-primary-400 rounded-lg hover:bg-primary-600/40 hover:text-primary-300 transition-all text-sm font-medium"
                        >
                          Add Notes
                        </motion.button>
                      </div>

                      {/* Expanded Details */}
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: expandedClientId === client.id ? 1 : 0,
                          height:
                            expandedClientId === client.id ? "auto" : 0,
                          marginTop: expandedClientId === client.id ? 24 : 0,
                          paddingTop: expandedClientId === client.id ? 24 : 0,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: "easeInOut",
                          opacity: { duration: 0.3 },
                        }}
                        className="border-t border-dark-700 space-y-4 overflow-hidden"
                        style={{ originY: 0 }}
                      >
                        <div className="p-3 bg-primary-600/10 rounded-lg border border-primary-500/20">
                          <p className="text-primary-300 text-sm">
                            <span className="font-semibold">
                              {client.name}
                            </span>{" "}
                            is now part of your coaching roster. Track their
                            progress and update their training plans.
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
