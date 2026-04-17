import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Dumbbell,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  Shield,
  Phone,
  Facebook,
  Instagram,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import GymHeroAnimation from "@/components/graphics/GymHeroAnimation";
import ZapLogo3D from "@/components/graphics/ZapLogo3D";

/** Replace with your real links — phone is display-only (not a dial link) */
const CONTACT = {
  facebookUrl: "https://www.facebook.com/",
  instagramUrl: "https://www.instagram.com/",
  phoneDisplay: "+1 (555) 000-0000",
} as const;

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: "Client Management",
      description: "Track and manage all your gym members in one place",
    },
    {
      icon: Calendar,
      title: "Workout Booking",
      description: "Easy scheduling system for classes and sessions",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor client progress and achievements",
    },
    {
      icon: CreditCard,
      title: "Payment System",
      description: "Integrated subscription and payment management",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Separate dashboards for admins, coaches, and clients",
    },
    {
      icon: Dumbbell,
      title: "Workout Plans",
      description: "Create and assign personalized training programs",
    },
  ];

  const heroBgImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="min-h-screen overflow-x-clip bg-dark-950">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] overflow-x-clip overflow-y-visible flex items-center">
        {/* Background Image - Gym/Fitness from Unsplash */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBgImage})` }}
        />
        {/* Dark overlay - strong so text and buttons are clearly visible */}
        <div className="absolute inset-0 bg-dark-950/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-dark-950" />
        {/* Subtle gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto relative overflow-visible"
          >
            <GymHeroAnimation
              size={300}
              className="absolute left-1/2 -translate-x-1/2 top-[-108px] z-20 w-[min(92vw,300px)] h-[min(92vw,300px)] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px]"
            />

            {/* Push the hero text down so it doesn’t get covered by the animation */}
            <div className="relative z-30 pt-[168px] sm:pt-[190px] md:pt-[220px] pb-1">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg leading-[1.08] pb-0.5">
                <span className="text-gradient drop-shadow-sm">Transform</span>
                <br />
                <span className="text-white drop-shadow-md">
                  Your Gym Management
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto drop-shadow-sm">
                A complete platform for managing your gym, clients, and
                subscriptions. Say goodbye to paper and WhatsApp chaos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto bg-primary-500 shadow-lg shadow-primary-500/40 border-2 border-primary-400/50"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="hero-outline-btn w-full sm:w-auto bg-dark-900/80 backdrop-blur-sm border-2 border-white/60 text-white hover:bg-white/20 hover:border-white"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 pb-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful features to run your gym efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card variant="gradient" hover className="h-full group p-8">
                  <div className="flex items-start gap-6">
                    <motion.div
                      className="flex-shrink-0 w-20 h-20 bg-primary-600/20 rounded-xl flex items-center justify-center group-hover:bg-primary-600/40 transition-colors duration-200"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <feature.icon className="w-10 h-10 text-primary-500" />
                      </motion.div>
                    </motion.div>
                    <div className="space-y-3">
                      <motion.h3
                        className="text-2xl font-semibold text-white mb-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{
                          delay: index * 0.05 + 0.1,
                          duration: 0.4,
                        }}
                        viewport={{ once: true }}
                      >
                        {feature.title}
                      </motion.h3>
                      <motion.p
                        className="text-gray-400 text-lg"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{
                          delay: index * 0.05 + 0.15,
                          duration: 0.4,
                        }}
                        viewport={{ once: true }}
                      >
                        {feature.description}
                      </motion.p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact — same FitHub logo as client hub, larger */}
      <footer className="border-t border-dark-800 bg-gradient-to-b from-dark-950 via-dark-950 to-dark-900">
        <section className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              How to contact us
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-10 max-w-xl mx-auto">
              Questions about FitHub? Reach us on social or by phone — we’re happy
              to help.
            </p>

            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
                <ZapLogo3D size={112} className="scale-100 sm:scale-105" />
                <div className="text-center sm:text-left">
                  <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                    <span className="text-primary-500">Fit</span>
                    <span className="text-white">Hub</span>
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Fitness Hub</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 pt-2">
                {/* Social — animated glass buttons */}
                <motion.a
                  href={CONTACT.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className="group relative inline-flex min-w-[10.5rem] items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-primary-500/25 bg-gradient-to-br from-dark-800/95 via-dark-800/90 to-dark-950 px-6 py-3.5 text-white shadow-[0_0_0_1px_rgba(74,222,128,0.06),0_8px_32px_-8px_rgba(0,0,0,0.6)] transition-[box-shadow,border-color] duration-300 hover:border-primary-400/45 hover:shadow-[0_0_28px_-6px_rgba(74,222,128,0.35)]"
                >
                  <span
                    className="absolute inset-0 bg-gradient-to-br from-primary-600/25 via-transparent to-emerald-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
                    <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-full group-hover:opacity-100" />
                  </span>
                  <Facebook className="relative z-10 h-5 w-5 text-primary-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary-300" aria-hidden />
                  <span className="relative z-10 font-semibold text-sm sm:text-base tracking-wide">
                    Facebook
                  </span>
                </motion.a>

                <motion.a
                  href={CONTACT.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className="group relative inline-flex min-w-[10.5rem] items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-fuchsia-500/25 bg-gradient-to-br from-dark-800/95 via-dark-800/90 to-dark-950 px-6 py-3.5 text-white shadow-[0_0_0_1px_rgba(217,70,239,0.08),0_8px_32px_-8px_rgba(0,0,0,0.6)] transition-[box-shadow,border-color] duration-300 hover:border-fuchsia-400/45 hover:shadow-[0_0_28px_-6px_rgba(217,70,239,0.3)]"
                >
                  <span
                    className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 via-transparent to-pink-600/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
                    <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-full group-hover:opacity-100" />
                  </span>
                  <Instagram className="relative z-10 h-5 w-5 text-fuchsia-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-fuchsia-300" aria-hidden />
                  <span className="relative z-10 font-semibold text-sm sm:text-base tracking-wide">
                    Instagram
                  </span>
                </motion.a>

                {/* Phone — display only (not a link); styled like social cards, no dashed box */}
                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="group relative inline-flex min-w-[10.5rem] cursor-default items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-cyan-400/35 bg-gradient-to-br from-dark-800/95 via-dark-800/90 to-dark-950 px-6 py-3.5 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.1),0_8px_32px_-8px_rgba(0,0,0,0.55)] transition-[box-shadow,border-color] duration-300 hover:border-cyan-300/45 hover:shadow-[0_0_26px_-6px_rgba(34,211,238,0.28)]"
                  aria-label={`Phone number ${CONTACT.phoneDisplay}`}
                >
                  <span
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-emerald-600/10 opacity-50 transition-opacity duration-500 group-hover:opacity-80"
                    aria-hidden
                  />
                  <span className="absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
                    <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-full group-hover:opacity-100" />
                  </span>
                  <Phone
                    className="relative z-10 h-5 w-5 shrink-0 text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-cyan-300"
                    aria-hidden
                  />
                  <span className="relative z-10 select-text font-semibold text-sm tabular-nums tracking-wide text-white sm:text-base">
                    {CONTACT.phoneDisplay}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="border-t border-dark-800/80 py-8 px-4">
          <div className="container mx-auto text-center text-gray-500 text-sm">
            <p>© 2026 Gym Management System. Built with React & TypeScript.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
