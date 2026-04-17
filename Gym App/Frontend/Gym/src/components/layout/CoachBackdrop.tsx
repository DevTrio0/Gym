import { motion } from "framer-motion";

/**
 * Coach **welcome** background only (`/coach` dashboard) — gym / training photo
 * + dark overlays. Other coach pages use the simple gradient + orbs.
 */
export function CoachBackdrop() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Photo: personal training / gym — swap URL if you host your own asset */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat [transform:scale(1.04)]"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1920&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-dark-900/88" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-dark-900/84 to-dark-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/14 via-transparent to-emerald-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_65%_at_50%_0%,rgba(34,197,94,0.12)_0%,transparent_52%)]" />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.58, 0.4],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 left-[12%] h-[420px] w-[420px] rounded-full bg-primary-600/12 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.06, 1, 1.06],
          opacity: [0.35, 0.52, 0.35],
        }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 right-[10%] h-[380px] w-[380px] rounded-full bg-emerald-500/10 blur-3xl"
      />
    </div>
  );
}
