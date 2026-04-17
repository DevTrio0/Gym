import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import InputWithIcon from "@/components/ui/InputWithIcon";
import Card from "@/components/ui/Card";
import { addClient } from "@/lib/api";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FITNESS_LEVELS = [
  { value: "", label: "Select level" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const FITNESS_OPTIONS = FITNESS_LEVELS.filter((o) => o.value !== "");

const GENDERS = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const GENDER_OPTIONS = GENDERS.filter((o) => o.value !== "");

export default function AddClient() {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [success, setSuccess] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    fitnessLevel: "",
    gender: "",
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLevelOpen(false);
        setIsGenderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const levelLabel =
    FITNESS_LEVELS.find((o) => o.value === formData.fitnessLevel)?.label ||
    "Select level";
  const genderLabel =
    GENDERS.find((o) => o.value === formData.gender)?.label || "Select gender";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        navigate('/login');
        return;
      }

      // Generate a simple password if not provided
      const password = 'ClientPassword@123';
      
      const response = await addClient(token, {
        ...formData,
        password
      });
      
      if (response.status === 'success') {
        console.log('Client added successfully:', response);
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          age: "",
          fitnessLevel: "",
          gender: "",
        });
        setTimeout(() => {
          setSuccess(false);
          // Redirect to clients count to see the new client
          navigate('/admin/clients-count');
        }, 2500);
      }
    } catch (error) {
      console.error('Failed to add client:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to add client'}`);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"
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
            className="max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-14 h-14 bg-green-600/20 rounded-xl flex items-center justify-center border border-green-500/20"
              >
                <Users className="w-7 h-7 text-green-500" />
              </motion.div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Add New Client
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  Register a new gym member
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="text-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/50"
                  >
                    <Check className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Client added successfully
                  </h2>
                  <p className="text-gray-400 text-sm">
                    You can add another client below
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <Card variant="gradient" className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <motion.div variants={item} className="grid md:grid-cols-2 gap-5">
                        <InputWithIcon
                          icon={User}
                          type="text"
                          name="name"
                          placeholder="Full name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <InputWithIcon
                          icon={Mail}
                          type="email"
                          name="email"
                          placeholder="Email address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </motion.div>

                      <motion.div
                        variants={item}
                        className="grid md:grid-cols-2 gap-5"
                      >
                        <InputWithIcon
                          icon={Phone}
                          type="tel"
                          name="phone"
                          placeholder="Phone number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <InputWithIcon
                          icon={Calendar}
                          type="number"
                          name="age"
                          placeholder="Age"
                          value={formData.age}
                          onChange={handleChange}
                          min={1}
                          max={120}
                        />
                      </motion.div>

                      <div ref={dropdownRef} className="space-y-5">
                      <motion.div variants={item}>
                        <div className="relative">
                          <motion.div
                            animate={
                              isLevelOpen
                                ? {
                                    scale: 1.3,
                                    rotate: 8,
                                    color: "#22c55e",
                                    textShadow: "0 0 12px rgba(34, 197, 94, 0.8)",
                                  }
                                : {
                                    scale: 1,
                                    rotate: 0,
                                    color: "rgb(107, 114, 128)",
                                    textShadow: "none",
                                  }
                            }
                            transition={{
                              duration: 0.3,
                              type: "spring",
                              stiffness: 350,
                              damping: 25,
                            }}
                            className="absolute left-4 top-3.5 w-5 h-5 flex items-center justify-center pointer-events-none z-10"
                          >
                            <Activity className="w-5 h-5" />
                          </motion.div>
                          <motion.button
                            type="button"
                            onClick={() => setIsLevelOpen((o) => !o)}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full px-4 py-3 pl-12 pr-10 rounded-lg text-left transition-all flex items-center justify-between border ${
                              isLevelOpen
                                ? "bg-dark-800 border-primary-500 ring-2 ring-primary-600/50"
                                : "bg-dark-900 border-dark-700 hover:border-dark-600"
                            }`}
                          >
                            <span
                              className={
                                formData.fitnessLevel
                                  ? "text-gray-100"
                                  : "text-gray-500"
                              }
                            >
                              {levelLabel}
                            </span>
                            <motion.span
                              animate={{ rotate: isLevelOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-gray-400"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </motion.span>
                          </motion.button>

                          <AnimatePresence>
                            {isLevelOpen && (
                              <motion.ul
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeOut",
                                }}
                                className="absolute top-full left-0 right-0 mt-1 py-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl shadow-black/20 overflow-hidden z-50"
                              >
                                {FITNESS_OPTIONS.map((opt, i) => (
                                  <motion.li
                                    key={opt.value}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: i * 0.03,
                                      duration: 0.15,
                                    }}
                                    whileHover={{
                                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          fitnessLevel: opt.value,
                                        }));
                                        setIsLevelOpen(false);
                                      }}
                                      className={`w-full px-4 py-2.5 text-left transition-colors flex items-center gap-2 ${
                                        formData.fitnessLevel === opt.value
                                          ? "text-primary-400 bg-primary-600/10"
                                          : "text-gray-200 hover:text-white"
                                      }`}
                                    >
                                      {formData.fitnessLevel === opt.value ? (
                                        <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                                      ) : (
                                        <span className="w-2 flex-shrink-0" />
                                      )}
                                      {opt.label}
                                    </button>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      <motion.div variants={item}>
                        <div className="relative">
                          <motion.div
                            animate={
                              isGenderOpen
                                ? {
                                    scale: 1.3,
                                    rotate: 8,
                                    color: "#22c55e",
                                    textShadow: "0 0 12px rgba(34, 197, 94, 0.8)",
                                  }
                                : {
                                    scale: 1,
                                    rotate: 0,
                                    color: "rgb(107, 114, 128)",
                                    textShadow: "none",
                                  }
                            }
                            transition={{
                              duration: 0.3,
                              type: "spring",
                              stiffness: 350,
                              damping: 25,
                            }}
                            className="absolute left-4 top-3.5 w-5 h-5 flex items-center justify-center pointer-events-none z-10"
                          >
                            <User className="w-5 h-5" />
                          </motion.div>
                          <motion.button
                            type="button"
                            onClick={() => setIsGenderOpen((o) => !o)}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full px-4 py-3 pl-12 pr-10 rounded-lg text-left transition-all flex items-center justify-between border ${
                              isGenderOpen
                                ? "bg-dark-800 border-primary-500 ring-2 ring-primary-600/50"
                                : "bg-dark-900 border-dark-700 hover:border-dark-600"
                            }`}
                          >
                            <span
                              className={
                                formData.gender ? "text-gray-100" : "text-gray-500"
                              }
                            >
                              {genderLabel}
                            </span>
                            <motion.span
                              animate={{ rotate: isGenderOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-gray-400"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </motion.span>
                          </motion.button>

                          <AnimatePresence>
                            {isGenderOpen && (
                              <motion.ul
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeOut",
                                }}
                                className="absolute top-full left-0 right-0 mt-1 py-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl shadow-black/20 overflow-hidden z-50"
                              >
                                {GENDER_OPTIONS.map((opt, i) => (
                                  <motion.li
                                    key={opt.value}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: i * 0.03,
                                      duration: 0.15,
                                    }}
                                    whileHover={{
                                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          gender: opt.value,
                                        }));
                                        setIsGenderOpen(false);
                                      }}
                                      className={`w-full px-4 py-2.5 text-left transition-colors flex items-center gap-2 ${
                                        formData.gender === opt.value
                                          ? "text-primary-400 bg-primary-600/10"
                                          : "text-gray-200 hover:text-white"
                                      }`}
                                    >
                                      {formData.gender === opt.value ? (
                                        <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                                      ) : (
                                        <span className="w-2 flex-shrink-0" />
                                      )}
                                      {opt.label}
                                    </button>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      </div>

                      <motion.div variants={item} className="pt-2">
                        <Button
                          type="submit"
                          variant="primary"
                          className="w-full py-3 flex items-center justify-center gap-2"
                        >
                          <Users className="w-5 h-5" />
                          Add Client
                        </Button>
                      </motion.div>
                    </form>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
