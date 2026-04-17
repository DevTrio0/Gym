import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCoachSubscribedClients, addTrainingPlan, getToken } from "@/lib/api";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

export default function AddTraining() {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState("");
  const [day, setDay] = useState("Monday");
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "1", name: "", sets: 3, reps: 10 },
  ]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const fetchSubscribedClients = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          setMessage({ type: "error", text: "Authentication token not found" });
          return;
        }

        const response = await getCoachSubscribedClients(token);
        if (response.clients) {
          setClients(response.clients);
          if (response.clients.length === 0) {
            setMessage({ 
              type: "error", 
              text: "No subscribed clients available. Clients must have an active subscription to create plans for them." 
            });
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load clients";
        setMessage({ type: "error", text: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribedClients();
  }, []);

  const handleAddExercise = () => {
    setExercises([...exercises, { id: Date.now().toString(), name: "", sets: 3, reps: 10 }]);
  };

  const handleRemoveExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((item) => item.id !== id));
    }
  };

  const handleExerciseChange = (id: string, field: string, value: any) => {
    setExercises(
      exercises.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = async () => {
    if (!selectedClient) {
      setMessage({ type: "error", text: "Please select a client" });
      return;
    }
    if (exercises.some((item) => !item.name.trim())) {
      setMessage({ type: "error", text: "Please enter all exercise names" });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      if (!token) {
        setMessage({ type: "error", text: "Authentication token not found" });
        return;
      }

      const trainingPlan = {
        [day]: exercises.filter((item) => item.name.trim()).map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps
        }))
      };

      const response = await addTrainingPlan(token, selectedClient, 1, trainingPlan);

      if (response.status === "success" || response.message?.includes("successfully")) {
        setMessage({ type: "success", text: "Training plan created successfully!" });
        setTimeout(() => navigate(-1), 2000);
      } else {
        setMessage({ type: "error", text: response.message || "Failed to create training plan" });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save training plan";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Training Plan</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{message.text}</span>
          </motion.div>
        )}

        <div className="space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-gray-600 dark:text-gray-400">Loading subscribed clients...</p>
            </div>
          )}

          {!loading && (
            <>
              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Client (only subscribed clients available)
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  disabled={clients.length === 0 || isSubmitting}
                  className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    clients.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">
                    {clients.length === 0 ? 'No subscribed clients available' : 'Choose a client...'}
                  </option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {clients.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Only clients with active subscriptions can have training plans created for them.
                  </p>
                )}
              </div>

              {/* Day Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Training Day
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exercises */}
              <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Exercises
              </label>
              <button
                onClick={handleAddExercise}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Exercise
              </button>
            </div>

            <div className="space-y-3">
              {exercises.map((exercise, idx) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                >
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(exercise.id, "name", e.target.value)}
                      placeholder="Exercise name"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(exercise.id, "sets", parseInt(e.target.value) || 0)}
                      placeholder="Sets"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(exercise.id, "reps", parseInt(e.target.value) || 0)}
                      placeholder="Reps"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    {exercises.length > 1 && (
                      <button
                        onClick={() => handleRemoveExercise(exercise.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <button
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={clients.length === 0 || isSubmitting || !selectedClient}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Training Plan'
              )}
            </button>
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
