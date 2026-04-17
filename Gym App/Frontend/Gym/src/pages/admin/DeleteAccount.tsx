import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, AlertTriangle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import InputWithIcon from "@/components/ui/InputWithIcon";
import Card from "@/components/ui/Card";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;
    setSuccess(true);
    setAccountId("");
    setConfirmed(false);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"
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
            className="max-w-xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-red-600/30 to-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 shadow-lg shadow-red-600/20"
              >
                <Trash2 className="w-8 h-8 text-red-400" />
              </motion.div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Delete Account
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  Permanently delete an account
                </p>
              </div>
            </div>

            {success ? (
              <Card variant="gradient" className="p-8 text-center border border-red-500/30">
                <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                  <Check className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Action completed
                </h2>
                <p className="text-gray-400 text-sm">
                  (Frontend demo – no backend)
                </p>
              </Card>
            ) : (
              <Card variant="gradient" className="p-8 border border-red-500/30 bg-red-950/20">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <p className="text-red-400 text-sm">
                    This action is permanent. All data will be lost.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <InputWithIcon
                    icon={Trash2}
                    type="text"
                    placeholder="Account ID / User ID"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    required
                  />
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-dark-600 accent-red-500"
                    />
                    <span className="text-gray-300 text-sm">
                      I understand this action cannot be undone.
                    </span>
                  </label>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3 bg-red-600 hover:bg-red-700"
                    disabled={!confirmed}
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Permanently Delete
                  </Button>
                </form>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
