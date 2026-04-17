import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Package, Check, Pencil, X, Plus, Trash2, Video, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DEFAULT_PLANS, type SubscriptionPlan } from "@/constants/subscriptionPlans";

import { getAdminPlans, createPlan, updatePlan, deletePlan, getToken } from "@/lib/api";

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SubscriptionPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [addPlanModal, setAddPlanModal] = useState<"online" | "gym" | null>(null);
  const [newPlanForm, setNewPlanForm] = useState<SubscriptionPlan | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return navigate("/login");
      const response = await getAdminPlans(token);
      // Map _id to id if necessary
      const mappedPlans = response.plans.map((p: any) => ({
        ...p,
        id: p._id || p.id,
        category: p.category || (p.type === 'gym' ? 'gym' : 'online')
      }));
      setPlans(mappedPlans);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const onlinePlans = plans.filter((p) => p.category === "online");
  const gymPlans = plans.filter((p) => p.category === "gym");
  const uncategorizedPlans = plans.filter((p) => !p.category || (p.category !== "online" && p.category !== "gym"));

  const startEdit = useCallback((plan: SubscriptionPlan) => {
    setEditingId(plan.id);
    setEditForm({ ...plan, features: [...plan.features] });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditForm(null);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editForm) return;
    try {
      const token = getToken();
      if (!token) return;
      
      const payload = {
        name: editForm.name,
        price: editForm.price,
        duration: editForm.duration,
        description: editForm.description,
        features: editForm.features,
        type: editForm.category || 'online',
        isActive: editForm.isActive,
        isRecommended: editForm.isRecommended
      };

      await updatePlan(token, editForm.id, payload);
      await fetchPlans();
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error("Failed to update plan:", error);
      alert("Failed to update plan");
    }
  }, [editForm, fetchPlans]);

  const resetToDefaults = useCallback(() => {
    setPlans([...DEFAULT_PLANS]);
    savePlans(DEFAULT_PLANS);
    setEditingId(null);
    setEditForm(null);
  }, []);

  const updateEditForm = useCallback(<K extends keyof SubscriptionPlan>(key: K, value: SubscriptionPlan[K]) => {
    setEditForm((f) => (f ? { ...f, [key]: value } : null));
  }, []);

  const addFeature = useCallback(() => {
    setEditForm((f) => (f ? { ...f, features: [...f.features, ""] } : null));
  }, []);

  const updateFeature = useCallback((index: number, value: string) => {
    setEditForm((f) => {
      if (!f) return null;
      const features = [...f.features];
      features[index] = value;
      return { ...f, features };
    });
  }, []);

  const removeFeature = useCallback((index: number) => {
    setEditForm((f) => {
      if (!f || f.features.length <= 1) return f;
      const features = f.features.filter((_, i) => i !== index);
      return { ...f, features };
    });
  }, []);

  const confirmDelete = useCallback((plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
  }, []);

  const cancelDelete = useCallback(() => {
    setPlanToDelete(null);
  }, []);

  const deletePlanAction = useCallback(async () => {
    if (!planToDelete) return;
    try {
      const token = getToken();
      if (!token) return;
      await deletePlan(token, planToDelete.id);
      await fetchPlans();
      setPlanToDelete(null);
    } catch (error) {
      console.error("Failed to delete plan:", error);
      alert("Failed to delete plan");
    }
  }, [planToDelete, fetchPlans]);

  const openAddPlanModal = useCallback((category: "online" | "gym") => {
    const id = `${category}-new-${Date.now()}`;
    const newPlan: SubscriptionPlan = {
      id,
      name: "New Plan",
      price: 29.99,
      duration: 1,
      description: "Add your plan description",
      features: ["Feature 1", "Feature 2"],
      isActive: true,
      category,
      isRecommended: false,
    };
    setAddPlanModal(category);
    setNewPlanForm({ ...newPlan, features: [...newPlan.features] });
  }, []);

  const closeAddPlanModal = useCallback(() => {
    setAddPlanModal(null);
    setNewPlanForm(null);
  }, []);

  const updateNewPlanForm = useCallback(<K extends keyof SubscriptionPlan>(key: K, value: SubscriptionPlan[K]) => {
    setNewPlanForm((f) => (f ? { ...f, [key]: value } : null));
  }, []);

  const addNewPlanFeature = useCallback(() => {
    setNewPlanForm((f) => (f ? { ...f, features: [...f.features, ""] } : null));
  }, []);

  const updateNewPlanFeature = useCallback((index: number, value: string) => {
    setNewPlanForm((f) => {
      if (!f) return null;
      const features = [...f.features];
      features[index] = value;
      return { ...f, features };
    });
  }, []);

  const removeNewPlanFeature = useCallback((index: number) => {
    setNewPlanForm((f) => {
      if (!f || f.features.length <= 1) return f;
      const features = f.features.filter((_, i) => i !== index);
      return { ...f, features };
    });
  }, []);

  const saveNewPlan = useCallback(async () => {
    if (!newPlanForm) return;
    try {
      const token = getToken();
      if (!token) return;

      const payload = {
        name: newPlanForm.name,
        price: newPlanForm.price,
        duration: newPlanForm.duration,
        description: newPlanForm.description,
        features: newPlanForm.features,
        type: newPlanForm.category || 'online',
        isActive: true,
        isRecommended: newPlanForm.isRecommended
      };

      await createPlan(token, payload);
      await fetchPlans();
      closeAddPlanModal();
    } catch (error) {
      console.error("Failed to create plan:", error);
      alert("Failed to create plan");
    }
  }, [newPlanForm, closeAddPlanModal, fetchPlans]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: [0, 360] }}
                  transition={{
                    scale: { type: "spring", stiffness: 200 },
                    opacity: { duration: 0.5 },
                    rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                  }}
                  className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-lg shadow-indigo-600/30"
                >
                  <Package className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">Subscription Plans</h1>
                  <p className="text-gray-400 mt-1">Click <span className="text-indigo-400 font-medium">Edit Plan</span> on any card to modify it, or add a new plan below</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button variant="primary" size="sm" onClick={() => openAddPlanModal("online")} className="flex items-center gap-2 !bg-green-600 hover:!bg-green-500">
                  <Plus className="w-4 h-4" />
                  Add Online Plan
                </Button>
                <Button variant="primary" size="sm" onClick={() => openAddPlanModal("gym")} className="flex items-center gap-2 !bg-orange-600 hover:!bg-orange-500">
                  <Plus className="w-4 h-4" />
                  Add Gym Plan
                </Button>
                <Button variant="outline" size="sm" onClick={resetToDefaults}>
                  Reset
                </Button>
              </div>
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">
              {loading ? (
                <div className="text-center py-20">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading plans...</p>
                </div>
              ) : plans.length === 0 ? (
                <motion.div
                  variants={item}
                  className="text-center py-16 px-6 rounded-2xl border border-dark-700 bg-dark-900/50"
                >
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No plans yet</h3>
                  <p className="text-gray-400 mb-6">Create your first subscription plan to get started.</p>
                  <Button onClick={() => openAddPlanModal("gym")} variant="primary">
                    Create a Plan
                  </Button>
                </motion.div>
              ) : (
                <>
              {onlinePlans.length > 0 && (
                <motion.div variants={item}>
                  <h2 className="text-lg font-semibold text-green-400 mb-4 border-l-4 border-green-500 pl-4">
                    Online Coaching
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {onlinePlans.map((plan) => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        category="online"
                        isEditing={editingId === plan.id}
                        editForm={editForm}
                        onStartEdit={startEdit}
                        onCancelEdit={cancelEdit}
                        onSaveEdit={saveEdit}
                        onUpdateForm={updateEditForm}
                        onAddFeature={addFeature}
                        onUpdateFeature={updateFeature}
                        onRemoveFeature={removeFeature}
                        onDelete={confirmDelete}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {gymPlans.length > 0 && (
                <motion.div variants={item}>
                  <h2 className="text-lg font-semibold text-orange-400 mb-4 border-l-4 border-orange-500 pl-4">
                    Real Gym
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gymPlans.map((plan) => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        category="gym"
                        isEditing={editingId === plan.id}
                        editForm={editForm}
                        onStartEdit={startEdit}
                        onCancelEdit={cancelEdit}
                        onSaveEdit={saveEdit}
                        onUpdateForm={updateEditForm}
                        onAddFeature={addFeature}
                        onUpdateFeature={updateFeature}
                        onRemoveFeature={removeFeature}
                        onDelete={confirmDelete}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {uncategorizedPlans.length > 0 && (
                <motion.div variants={item}>
                  <h2 className="text-lg font-semibold text-gray-400 mb-4 border-l-4 border-dark-600 pl-4">
                    Other Plans
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uncategorizedPlans.map((plan) => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        category="other"
                        isEditing={editingId === plan.id}
                        editForm={editForm}
                        onStartEdit={startEdit}
                        onCancelEdit={cancelEdit}
                        onSaveEdit={saveEdit}
                        onUpdateForm={updateEditForm}
                        onAddFeature={addFeature}
                        onUpdateFeature={updateFeature}
                        onRemoveFeature={removeFeature}
                        onDelete={confirmDelete}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
                </>
              )}

            {/* Add Plan modal */}
            <AnimatePresence>
              {addPlanModal && newPlanForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  onClick={closeAddPlanModal}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-2xl border border-dark-600 bg-dark-900 p-6 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {addPlanModal === "online" ? (
                          <>
                            <Video className="w-5 h-5 text-green-400" />
                            Add Online Plan
                          </>
                        ) : (
                          <>
                            <Dumbbell className="w-5 h-5 text-orange-400" />
                            Add Gym Plan
                          </>
                        )}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={closeAddPlanModal}
                        className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Plan Name"
                        value={newPlanForm.name}
                        onChange={(e) => updateNewPlanForm("name", e.target.value)}
                        placeholder="Plan name"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Price ($)"
                          type="number"
                          step="0.01"
                          value={String(newPlanForm.price)}
                          onChange={(e) => updateNewPlanForm("price", parseFloat(e.target.value) || 0)}
                        />
                        <Input
                          label="Duration (months)"
                          type="number"
                          min={1}
                          value={String(newPlanForm.duration)}
                          onChange={(e) => updateNewPlanForm("duration", parseInt(e.target.value, 10) || 1)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                          value={newPlanForm.description}
                          onChange={(e) => updateNewPlanForm("description", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 resize-none"
                          rows={2}
                          placeholder="Plan description"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm text-gray-400">Features</label>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addNewPlanFeature}
                            className={`flex items-center gap-1 text-xs ${
                              addPlanModal === "online" ? "text-green-400 hover:text-green-300" : "text-orange-400 hover:text-orange-300"
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </motion.button>
                        </div>
                        <div className="space-y-2">
                          {newPlanForm.features.map((f, i) => (
                            <motion.div key={i} className="flex gap-2">
                              <input
                                value={f}
                                onChange={(e) => updateNewPlanFeature(i, e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg bg-dark-800 border border-dark-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                placeholder="Feature"
                              />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeNewPlanFeature(i)}
                                disabled={newPlanForm.features.length <= 1}
                                className="p-2 rounded-lg bg-dark-700 hover:bg-red-600/20 text-gray-400 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newPlanForm.isRecommended ?? false}
                          onChange={(e) => updateNewPlanForm("isRecommended", e.target.checked)}
                          className={`w-4 h-4 rounded border-dark-600 ${addPlanModal === "online" ? "accent-green-500" : "accent-orange-500"}`}
                        />
                        <span className="text-sm text-gray-300">Recommended</span>
                      </label>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" onClick={closeAddPlanModal} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={saveNewPlan}
                        className={`flex-1 ${
                          addPlanModal === "online" ? "!bg-green-600 hover:!bg-green-500" : "!bg-orange-600 hover:!bg-orange-500"
                        }`}
                      >
                        Add Plan
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Delete confirmation modal */}
            <AnimatePresence>
              {planToDelete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                  onClick={cancelDelete}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-2xl border border-dark-600 bg-dark-900 p-6 shadow-2xl max-w-sm w-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Delete Plan?</h3>
                        <p className="text-gray-400 text-sm">This action cannot be undone.</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-6">
                      Are you sure you want to delete <span className="font-semibold text-white">"{planToDelete.name}"</span>?
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={cancelDelete} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={deletePlanAction}
                        className="flex-1 !bg-red-600 hover:!bg-red-500"
                      >
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

type PlanCardProps = {
  plan: SubscriptionPlan;
  category: "online" | "gym" | "other";
  isEditing: boolean;
  editForm: SubscriptionPlan | null;
  onStartEdit: (plan: SubscriptionPlan) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onUpdateForm: <K extends keyof SubscriptionPlan>(key: K, value: SubscriptionPlan[K]) => void;
  onAddFeature: () => void;
  onUpdateFeature: (index: number, value: string) => void;
  onRemoveFeature: (index: number) => void;
  onDelete: (plan: SubscriptionPlan) => void;
};

function PlanCard({
  plan,
  category,
  isEditing,
  editForm,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onUpdateForm,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
  onDelete,
}: PlanCardProps) {
  const form = isEditing && editForm?.id === plan.id ? editForm : null;
  const accent = category === "online" ? "green" : category === "gym" ? "orange" : "indigo";

  const PlanIcon = category === "online" ? Video : category === "gym" ? Dumbbell : Package;
  const glowColor = accent === "green" ? "from-green-600/30 to-green-500/10" : accent === "orange" ? "from-orange-600/30 to-orange-500/10" : "from-indigo-600/30 to-indigo-500/10";
  const accentLight = accent === "green" ? "from-green-500/5" : accent === "orange" ? "from-orange-500/5" : "from-indigo-500/5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        initial={false}
        whileHover={!isEditing ? { y: -8, transition: { duration: 0.3 } } : {}}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group relative h-full"
      >
        {/* Hover glow - like client */}
        {!isEditing && (
          <>
            <div className={`absolute -inset-0.5 bg-gradient-to-br ${glowColor} rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
            <div className={`absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br ${glowColor} rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10`} />
            <div className={`absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br ${accentLight} to-transparent rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
          </>
        )}
        <Card
          variant="gradient"
          className={`overflow-hidden border-2 transition-all duration-500 !bg-gradient-to-br !from-dark-900 !to-dark-950 relative ${
            isEditing
              ? accent === "green"
                ? "border-green-500/50 ring-2 ring-green-500/20"
                : accent === "orange"
                  ? "border-orange-500/50 ring-2 ring-orange-500/20"
                  : "border-indigo-500/50 ring-2 ring-indigo-500/20"
              : accent === "green"
                ? "border-dark-700 group-hover:border-green-500/50 group-hover:shadow-xl group-hover:shadow-green-600/20"
                : accent === "orange"
                  ? "border-dark-700 group-hover:border-orange-500/50 group-hover:shadow-xl group-hover:shadow-orange-600/20"
                  : "border-dark-700 group-hover:border-indigo-500/50 group-hover:shadow-xl group-hover:shadow-indigo-600/20"
          }`}
        >
          <AnimatePresence mode="wait">
          {isEditing && form ? (
              <motion.div
                key={`edit-${plan.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="p-6 space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-semibold ${accent === "green" ? "text-green-400" : accent === "orange" ? "text-orange-400" : "text-indigo-400"}`}>Editing</span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onCancelEdit}
                      className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onSaveEdit}
                      className={`p-2 rounded-lg text-white transition-colors ${
                        accent === "green" ? "bg-green-600 hover:bg-green-500" :
                        accent === "orange" ? "bg-orange-600 hover:bg-orange-500" :
                        "bg-primary-600 hover:bg-primary-500"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <Input
                  label="Plan Name"
                  value={form.name}
                  onChange={(e) => onUpdateForm("name", e.target.value)}
                  placeholder="Plan name"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Price ($)"
                    type="number"
                    step="0.01"
                    value={String(form.price)}
                    onChange={(e) => onUpdateForm("price", parseFloat(e.target.value) || 0)}
                  />
                  <Input
                    label="Duration (months)"
                    type="number"
                    min={1}
                    value={String(form.duration)}
                    onChange={(e) => onUpdateForm("duration", parseInt(e.target.value, 10) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => onUpdateForm("description", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 resize-none"
                    rows={2}
                    placeholder="Plan description"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-400">Features</label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onAddFeature}
                      className={`flex items-center gap-1 text-xs ${
                        accent === "green" ? "text-green-400 hover:text-green-300" :
                        accent === "orange" ? "text-orange-400 hover:text-orange-300" :
                        "text-primary-400 hover:text-primary-300"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    {form.features.map((f, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          value={f}
                          onChange={(e) => onUpdateFeature(i, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-dark-800 border border-dark-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                          placeholder="Feature"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onRemoveFeature(i)}
                          disabled={form.features.length <= 1}
                          className="p-2 rounded-lg bg-dark-700 hover:bg-red-600/20 text-gray-400 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isRecommended ?? false}
                    onChange={(e) => onUpdateForm("isRecommended", e.target.checked)}
                    className={`w-4 h-4 rounded border-dark-600 ${accent === "green" ? "accent-green-500" : accent === "orange" ? "accent-orange-500" : "accent-primary-500"}`}
                  />
                  <span className="text-sm text-gray-300">Recommended</span>
                </label>

                <Button
                  onClick={onSaveEdit}
                  variant="primary"
                  className={`w-full ${
                    accent === "green" ? "!bg-green-600 hover:!bg-green-500" :
                    accent === "orange" ? "!bg-orange-600 hover:!bg-orange-500" :
                    ""
                  }`}
                >
                  Save Changes
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key={`view-${plan.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="p-6"
              >
                {/* Plan icon - Video for Online, Dumbbell for Gym */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg bg-gradient-to-br ${
                    accent === "green"
                      ? "from-green-600/40 to-green-500/20 group-hover:from-green-600/60 group-hover:to-green-500/40"
                      : accent === "orange"
                        ? "from-orange-600/40 to-orange-500/20 group-hover:from-orange-600/60 group-hover:to-orange-500/40"
                        : "from-indigo-600/40 to-indigo-500/20"
                  }`}
                >
                  <PlanIcon className={`w-7 h-7 ${
                    accent === "green" ? "text-green-400" : accent === "orange" ? "text-orange-400" : "text-indigo-400"
                  }`} />
                </motion.div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    {plan.isRecommended && (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      accent === "green" ? "bg-green-600/30 text-green-400" :
                      accent === "orange" ? "bg-orange-600/30 text-orange-400" :
                      "bg-primary-600/30 text-primary-400"
                    }`}>
                        Recommended
                      </span>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete(plan)}
                      className="p-2 rounded-lg bg-dark-700/80 hover:bg-red-600/30 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <motion.div
                  className="mb-4"
                  initial={false}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className={`text-2xl font-bold ${accent === "green" ? "text-green-500" : accent === "orange" ? "text-orange-500" : "text-primary-500"}`}>${plan.price}</span>
                  <span className="text-gray-400 text-sm">/{plan.duration} month(s)</span>
                </motion.div>
                <div className="mb-5">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-4 tracking-wider">Included:</p>
                  <ul className="space-y-2.5">
                    {plan.features.map((f, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-3 text-gray-300 text-sm"
                      >
                        <motion.div
                          whileHover={{ scale: 1.25, rotate: 10 }}
                          className={`w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0 rounded-full border shadow-lg bg-gradient-to-br ${
                            accent === "green"
                              ? "from-green-600/40 to-green-500/20 border-green-500/30 shadow-green-600/20"
                              : accent === "orange"
                                ? "from-orange-600/40 to-orange-500/20 border-orange-500/30 shadow-orange-600/20"
                                : "from-primary-600/40 to-primary-500/20 border-primary-500/30 shadow-primary-600/20"
                          }`}
                        >
                          <Check className={`w-3 h-3 ${
                            accent === "green" ? "text-green-300" : accent === "orange" ? "text-orange-300" : "text-primary-300"
                          }`} />
                        </motion.div>
                        <span>{f}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onStartEdit(plan)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors font-medium text-sm ${
                    accent === "green"
                      ? "bg-green-600/30 hover:bg-green-600/50 text-green-300 hover:text-white border border-green-500/30"
                      : accent === "orange"
                        ? "bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 hover:text-white border border-orange-500/30"
                        : "bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white border border-indigo-500/30"
                  }`}
                >
                  <Pencil className="w-4 h-4" />
                  Edit Plan
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </motion.div>
  );
}
