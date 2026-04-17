import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { updateProgress, getToken } from "@/lib/api";

export default function ProgressUpdate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: "",
    bodyFat: "",
    muscleMass: "",
    chest: "",
    waist: "",
    biceps: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");

      await updateProgress(token, {
        weight: formData.weight,
        bodyFat: formData.bodyFat,
        muscleMass: formData.muscleMass,
        chest: formData.chest,
        waist: formData.waist,
        biceps: formData.biceps,
        notes: formData.notes
      });

      setSubmitted(true);
      setTimeout(() => {
        navigate("/client/welcome/progress");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update progress");
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2 }}
            className="mb-6"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Progress Logged!
          </h2>
          <p className="text-gray-400 mb-6">
            Your progress has been recorded successfully
          </p>
          <p className="text-gray-500 text-sm">
            Redirecting to progress dashboard...
          </p>
        </motion.div>
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
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Log Your Progress
          </h1>
          <p className="text-gray-400">
            Record your current measurements and metrics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card variant="glass" className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Weight and Body Composition */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">
                    Body Composition
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Weight (kg)"
                      name="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="75.0"
                      required
                    />
                    <Input
                      label="Body Fat (%)"
                      name="bodyFat"
                      type="number"
                      step="0.1"
                      value={formData.bodyFat}
                      onChange={handleInputChange}
                      placeholder="18.5"
                    />
                  </div>
                  <div className="mt-4">
                    <Input
                      label="Muscle Mass (kg)"
                      name="muscleMass"
                      type="number"
                      step="0.1"
                      value={formData.muscleMass}
                      onChange={handleInputChange}
                      placeholder="32.0"
                    />
                  </div>
                </div>

                {/* Measurements */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">
                    Body Measurements (cm)
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Chest"
                      name="chest"
                      type="number"
                      step="0.5"
                      value={formData.chest}
                      onChange={handleInputChange}
                      placeholder="100"
                    />
                    <Input
                      label="Waist"
                      name="waist"
                      type="number"
                      step="0.5"
                      value={formData.waist}
                      onChange={handleInputChange}
                      placeholder="85"
                    />
                    <Input
                      label="Biceps"
                      name="biceps"
                      type="number"
                      step="0.5"
                      value={formData.biceps}
                      onChange={handleInputChange}
                      placeholder="35"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Notes</h3>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="How did you feel? Any observations?"
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    rows={4}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button variant="primary" className="w-full" type="submit" isLoading={isLoading}>
                  {isLoading ? 'Saving...' : 'Log Progress'}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glass" className="p-8 sticky top-8">
              <h3 className="text-lg font-bold text-white mb-6">
                Measurement Tips
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    title: "Weight",
                    tip: "Weigh yourself in the morning, after using the bathroom, before eating.",
                  },
                  {
                    title: "Body Fat",
                    tip: "Use a scale with body composition, or consult with your coach for accurate readings.",
                  },
                  {
                    title: "Measurements",
                    tip: "Measure with a soft measuring tape, keeping it snug but not tight.",
                  },
                  {
                    title: "Consistency",
                    tip: "Track weekly on the same day for better progress comparison.",
                  },
                ].map((tip, idx) => (
                  <div
                    key={idx}
                    className="pb-4 border-b border-dark-700 last:border-0 last:pb-0"
                  >
                    <p className="text-white font-semibold text-sm mb-1">
                      {tip.title}
                    </p>
                    <p className="text-gray-400 text-xs">{tip.tip}</p>
                  </div>
                ))}
              </ul>

              {/* Progress Quote */}
              <div className="mt-8 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                <p className="text-primary-400 text-sm italic">
                  "Progress is progress, no matter how small. Keep tracking and
                  stay consistent!"
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
