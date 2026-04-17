import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Loader2, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import InputWithIcon from "@/components/ui/InputWithIcon";
import Card from "@/components/ui/Card";

import { registerUser, storeAuth } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"client" | "coach" | "admin">("client");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!name || !email) {
        throw new Error("All fields are required");
      }

      // Call real backend API for user registration
      console.log("Registration attempt:", { name, email, role });
      
      const response = await registerUser(name, email, password, role);
      
      console.log("Registration success:", response);

      // Successfully registered
      if (role === 'coach') {
        setSuccess("Account registered! Pending admin approval.");
        setIsLoading(false);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setSuccess("Account created successfully!");
        // Redirection after success
        setTimeout(() => {
          if (role === "client") {
            navigate("/login", { state: { message: "Account created! Please log in." } });
          } else if (role === "admin") {
            navigate("/login", { state: { message: "Admin account created! Please log in." } });
          } else {
            navigate("/login");
          }
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-600/50"
          >
            <UserPlus className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join our gym community</p>
        </div>

        <Card variant="glass" className="backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputWithIcon
              icon={User}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <InputWithIcon
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputWithIcon
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <InputWithIcon
              icon={Lock}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRole("client")}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    role === "client"
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                      : "bg-dark-800 text-gray-400 hover:bg-dark-700"
                  }`}
                >
                  Client
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRole("coach")}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    role === "coach"
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                      : "bg-dark-800 text-gray-400 hover:bg-dark-700"
                  }`}
                >
                  Coach
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRole("admin")}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    role === "admin"
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
                      : "bg-dark-800 text-gray-400 hover:bg-dark-700"
                  }`}
                >
                  Admin
                </motion.button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shadow-sm" />
                {success}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
