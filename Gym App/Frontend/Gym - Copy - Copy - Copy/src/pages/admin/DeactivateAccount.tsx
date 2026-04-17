import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, FileText, ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import InputWithIcon from "@/components/ui/InputWithIcon";
import TextareaWithIcon from "@/components/ui/TextareaWithIcon";

export default function DeactivateAccount() {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setAccountId("");
    setReason("");
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
            className="max-w-xl mx-auto"
          >
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
                className="w-16 h-16 bg-gradient-to-br from-red-600/30 to-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 shadow-lg shadow-red-600/20"
              >
                <ShieldOff className="w-8 h-8 text-red-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Deactivate Account</h1>
                <p className="text-gray-400 mt-1">Temporarily suspend an account</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/60 border border-green-500/30 p-8 text-center shadow-lg"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-full bg-green-600/20 border border-green-500/30 flex items-center justify-center mx-auto mb-5"
                  >
                    <Lock className="w-10 h-10 text-green-400" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-white mb-2">Account deactivated</h2>
                  <p className="text-gray-400 text-sm">(Frontend demo – no backend)</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-900/60 border border-dark-700/80 p-8 shadow-lg hover:shadow-xl hover:border-red-500/20 transition-all"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <InputWithIcon
                      icon={Lock}
                      type="text"
                      placeholder="Account ID / User ID"
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      required
                    />
                    <TextareaWithIcon
                      icon={FileText}
                      placeholder="Reason (optional)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                    />
                    <Button type="submit" variant="primary" className="w-full py-3">
                      <ShieldOff className="w-5 h-5 mr-2" />
                      Deactivate Account
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
