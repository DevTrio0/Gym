## Gym UI Style Guide (Frontend + Design Only)

This document captures the existing visual language in this repo so future pages/components match the same colors, motion, and reusable primitives.

### Stack + libraries (what to use)
- Styling: Tailwind CSS (with theme variables + dark mode class)
- Motion/animation: Framer Motion (`motion.*`) for entrances/hover and looping backgrounds
- State: Zustand theme store for dark/light

---

## 1) Colors + theme tokens

### Primary brand color (Tailwind `primary`)
Green scale used across buttons, gradients, and glow accents:
- `primary-50`:  `#f0fdf4`
- `primary-100`: `#dcfce7`
- `primary-200`: `#bbf7d0`
- `primary-300`: `#86efac`
- `primary-400`: `#4ade80`
- `primary-500`: `#22c55e`
- `primary-600`: `#16a34a`
- `primary-700`: `#15803d`
- `primary-800`: `#166534`
- `primary-900`: `#14532d`

### Dark surfaces + text (CSS variables)
Defined in `src/index.css` and referenced by Tailwind `dark` theme colors:
- `--theme-bg-950`: `#020617`
- `--theme-bg-900`: `#0f172a`
- `--theme-bg-800`: `#1e293b`
- `--theme-bg-700`: `#334155`
- `--theme-text-primary`: `#f1f5f9`
- `--theme-text-secondary`: `#cbd5e1`

Light mode overrides live under `html.light` in `src/index.css`:
- Backgrounds:
  - `--theme-bg-950`: `#fafaf9`
  - `--theme-bg-900`: `#f5f5f4`
  - `--theme-bg-800`: `#e7e5e4`
  - `--theme-bg-700`: `#d6d3d1`
- Text:
  - `--theme-text-primary`: `#1c1917`
  - `--theme-text-secondary`: `#57534e`

### Theme application behavior (important for new UI)
The runtime `ThemeProvider` toggles `document.documentElement` classes:
- Adds/removes `dark`/`light` on `document.documentElement`
- Sets CSS variables `--theme-bg-*` and `--theme-text-*` accordingly

So new design should rely on existing Tailwind token classes and CSS variables (avoid hardcoding large regions unless the page already does it).

---

## 2) Reusable visual utilities (exact classes)

These are defined in `src/index.css` under `@layer utilities`.

### Gradient text
Class: `.text-gradient`
- Uses: `bg-gradient-to-r from-primary-400 to-primary-600`
- Applies: `bg-clip-text text-transparent`

Common usage (from pages):
- `className="text-gradient"`

### Glass card effect
Class: `.glass`
- Uses: `bg-white/5 backdrop-blur-lg border border-white/10`

For light mode, there are additional overrides so the glass effect stays readable.

### Primary glow
Class: `.glow-primary` and `.glow-primary:hover`
- Default glow: `0 0 20px ...` + `0 0 40px ...` + subtle inset
- Hover glow intensifies the shadow (more spread + opacity)

There is also a consistent hover transition rule for clickable elements:
- `button, a, [role="button"] { transition-all duration-100; }`

---

## 3) Animation + motion patterns

### Tailwind keyframes (global availability)
In `tailwind.config.js`:
- `fade-in`: `fadeIn 0.5s ease-in-out` (keyframes: opacity 0 -> 1)
- `slide-up`: `slideUp 0.5s ease-out` (translateY 20px -> 0)
- `slide-down`: `slideDown 0.5s ease-out` (translateY -20px -> 0)
- `scale-in`: `scaleIn 0.3s ease-out` (scale 0.9 -> 1)
- `glow`: `glow 2s ease-in-out infinite` (box-shadow pulse)

Even when most UI uses Framer Motion, these utilities are part of the design language.

### Framer Motion “entrance” recipe (used across pages)
Pattern:
- `initial={{ opacity: 0, y: 20 }}`
- `animate={{ opacity: 1, y: 0 }}`
- `transition={{ duration: 0.3~0.8, ease: "easeOut" }}`

Common additions:
- Cards/sections often use `whileInView={{ ... }}` with `viewport={{ once: true }}`
- Staggering: `delay: index * 0.05` or `delay: index * 0.05 + 0.1`

### Framer Motion “looping background orbs” recipe
Pattern:
- Two absolutely positioned `motion.div` elements
- `animate` uses `scale: [1, 1.2, 1]` and `rotate: [0, 90, 0]` (or similar arrays)
- `transition={{ duration: 15~20, repeat: Infinity }}`
- Visual look uses `rounded-full blur-3xl` and `bg-primary-* / *opacity*`

### Framer Motion “hover responsiveness”
- Buttons/cards typically use:
  - Button: `whileHover={{ scale: 1.02~1.1 }}` and `whileTap={{ scale: 0.97~0.95 }}`
  - Cards: `whileHover` optional via component props (see next section)

---

## 4) Component usage rules (must match the existing primitives)

### `src/components/ui/Button.tsx`
Use the `variant` and `size` props instead of recreating button styles.

Props:
- `variant`: `primary | secondary | outline | ghost | orange`
- `size`: `sm | md | lg`
- `isLoading`: boolean (renders spinner + "Loading...")

Behavior:
- Motion: `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.97 }}`
- Shared base: rounded corners + `transition-all duration-100`

Variant style anchors:
- `primary`:
  - `bg-primary-500 text-white`
  - `hover:bg-primary-600`
  - `glow-primary` and shadow accents
- `secondary`:
  - `bg-dark-800` with border `border-dark-700`
- `outline`:
  - `border-2 border-primary-600 text-primary-500`
  - `hover:bg-primary-600/10`
- `ghost`:
  - `text-gray-300 hover:bg-dark-800 hover:text-white`
- `orange`:
  - `bg-orange-500` and `hover:bg-orange-600` + glow/shadow accents

### `src/components/ui/Card.tsx`
Use `variant` and optionally `hover` instead of building new card wrappers.

Props:
- `variant`: `default | glass | gradient`
- `hover`: boolean (enables hover scaling and stronger glow shadow)

Behavior:
- Motion entrance:
  - `initial={{ opacity: 0, y: 20 }}`
  - `animate={{ opacity: 1, y: 0 }}`
  - `transition={{ duration: 0.3, ease: "easeOut" }}`
- Hover:
  - If `hover` is true, the component may scale on hover (`whileHover={{ scale: 1.02 }}`)
  - It also computes a stronger inline boxShadow glow when hovered

Variant style anchors:
- `default`: `bg-dark-900 border border-dark-800`
- `glass`: class `.glass`
- `gradient`: `bg-gradient-to-br from-dark-900 to-dark-800 border border-primary-900/20`

---

## 5) Role-based UI structure (current routes)

Routing is in `src/router/index.tsx`.

### Client
- `/client/welcome` -> `src/pages/client/WelcomePage.tsx`
- `/client/welcome/subscription` -> `src/pages/client/SubscriptionPage.tsx`
- `/client/welcome/subscription/select-plan` -> `src/pages/client/dashboard/SubscriptionSelectPlan.tsx`
- `/client/welcome/subscription/payment` -> `src/pages/client/dashboard/SubscriptionPayment.tsx`
- `/client/welcome/subscription/renew-or-change` -> `src/pages/client/dashboard/SubscriptionRenewOrChange.tsx`
- `/client/welcome/book-workout` -> `src/pages/client/dashboard/BookWorkout.tsx`
- `/client/welcome/workout-week` -> `src/pages/client/dashboard/WorkoutWeek.tsx`
- `/client/welcome/progress` -> `src/pages/client/dashboard/Progress.tsx`
- `/client/welcome/progress/update` -> `src/pages/client/dashboard/ProgressUpdate.tsx`

### Coach
- `/coach/my-clients` -> `src/pages/coach/MyClients.tsx`
- `/coach/client/:clientId/notes` -> `src/pages/coach/ClientNotes.tsx`
- `/coach/add-training` -> `src/pages/coach/AddTraining.tsx`
- `/coach/add-diet` -> `src/pages/coach/AddDiet.tsx`
- `/coach/*` -> `src/pages/coach/Dashboard.tsx`

### Admin
- `/admin` -> `src/pages/admin/Dashboard.tsx`
- `/admin/add-coach` -> `src/pages/admin/AddCoach.tsx`
- `/admin/add-client` -> `src/pages/admin/AddClient.tsx`
- `/admin/delete-account` -> `src/pages/admin/DeleteAccount.tsx`
- `/admin/deactivate-account` -> `src/pages/admin/DeactivateAccount.tsx`
- `/admin/reactivate-account` -> `src/pages/admin/ReactivateAccount.tsx`
- `/admin/reports` -> `src/pages/admin/Reports.tsx`
- `/admin/payments` -> `src/pages/admin/Payments.tsx`
- `/admin/profits` -> `src/pages/admin/Profits.tsx`
- `/admin/subscription` -> `src/pages/admin/SubscriptionPlans.tsx`
- `/admin/clients-count` -> `src/pages/admin/ClientsCount.tsx`

---

## 6) Future work rule (to match your request)
When you give me the next feature/task:
- I will implement only the frontend/UI/design (no backend changes).
- I will reuse existing primitives (`Button`, `Card`, and the theme tokens/utilities) instead of inventing new styles.
- I will follow the motion recipes in this guide:
  - Entrance: `opacity + y` pattern
  - Background orbs: looping `motion.div` blobs
  - Hover: small scale changes via Framer Motion

