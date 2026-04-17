import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCoachSubscribedClients, addDietPlan, getToken } from "@/lib/api";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

export default function AddDiet() {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    { id: "1", name: "", calories: 0 },
  ]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

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

  const handleAddFood = () => {
    setFoodItems([...foodItems, { id: Date.now().toString(), name: "", calories: 0 }]);
  };

  const handleRemoveFood = (id: string) => {
    if (foodItems.length > 1) {
      setFoodItems(foodItems.filter((item) => item.id !== id));
    }
  };

  const handleFoodChange = (id: string, field: string, value: any) => {
    setFoodItems(
      foodItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = async () => {
    if (!clientId) {
      setMessage({ type: "error", text: "Please select a client" });
      return;
    }
    if (foodItems.some((item) => !item.name.trim())) {
      setMessage({ type: "error", text: "Please enter all food names" });
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getToken();
      if (!token) {
        setMessage({ type: "error", text: "Authentication token not found" });
        return;
      }

      const dietPlan = {
        [mealType]: foodItems.filter((item) => item.name.trim()).map(food => ({
          name: food.name,
          calories: food.calories
        }))
      };

      const response = await addDietPlan(token, clientId, dietPlan);

      if (response.status === "success" || response.message?.includes("successfully")) {
        setMessage({ type: "success", text: "Diet plan created successfully!" });
        setTimeout(() => navigate(-1), 2000);
      } else {
        setMessage({ type: "error", text: response.message || "Failed to create diet plan" });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save diet plan";
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Diet Plan</h1>
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
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
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
                    Only clients with active subscriptions can have diet plans created for them.
                  </p>
                )}
              </div>

              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meal Type
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {mealTypes.map((meal) => (
                    <option key={meal} value={meal}>
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Food Items */}
              <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Food Items
              </label>
              <button
                onClick={handleAddFood}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {foodItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 items-end"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleFoodChange(item.id, "name", e.target.value)}
                      placeholder="Food name"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={item.calories}
                      onChange={(e) => handleFoodChange(item.id, "calories", parseInt(e.target.value) || 0)}
                      placeholder="Calories"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  {foodItems.length > 1 && (
                    <button
                      onClick={() => handleRemoveFood(item.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
              disabled={clients.length === 0 || isSubmitting || !clientId}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Diet Plan'
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
