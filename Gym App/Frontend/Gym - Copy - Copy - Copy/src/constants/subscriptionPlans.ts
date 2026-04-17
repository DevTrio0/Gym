export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  description: string;
  maxClients?: number;
  isActive: boolean;
  category?: "online" | "gym";
  isRecommended?: boolean;
  createdAt?: string;
}

export const PLAN_CATEGORIES = {
  online: "Online Coaching Plans",
  gym: "Real Gym Plans",
};

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: "online-starter",
    name: "Starter Online",
    price: 29.99,
    duration: 1,
    description: "Start your fitness journey",
    features: [
      "2 video coaching sessions/week",
      "Workout templates",
      "Basic progress tracking",
    ],
    isActive: true,
    category: "online",
    isRecommended: false,
  },
  {
    id: "online-pro",
    name: "Pro Online",
    price: 49.99,
    duration: 1,
    description: "Advanced online coaching",
    features: [
      "Unlimited video coaching",
      "Custom meal plans",
      "24/7 support",
      "Performance analytics",
    ],
    isActive: true,
    category: "online",
    isRecommended: true,
  },
  {
    id: "online-elite",
    name: "Elite Online",
    price: 79.99,
    duration: 1,
    description: "Premium online experience",
    features: [
      "Unlimited 1-on-1 sessions",
      "Full nutrition planning",
      "Priority support",
      "Monthly reviews",
      "Exclusive content",
    ],
    isActive: true,
    category: "online",
    isRecommended: false,
  },
  {
    id: "gym-starter",
    name: "Gym Starter",
    price: 39.99,
    duration: 1,
    description: "Gym access only",
    features: ["24/7 gym access", "All equipment available", "Locker access"],
    isActive: true,
    category: "gym",
    isRecommended: false,
  },
  {
    id: "gym-pro",
    name: "Gym Pro",
    price: 59.99,
    duration: 1,
    description: "Gym + coaching sessions",
    features: [
      "24/7 gym access",
      "2 coaching sessions/week",
      "Locker access",
      "Progress tracking",
    ],
    isActive: true,
    category: "gym",
    isRecommended: true,
  },
  {
    id: "gym-elite",
    name: "Gym Elite",
    price: 89.99,
    duration: 1,
    description: "Full gym experience",
    features: [
      "24/7 gym access",
      "Unlimited coaching",
      "Personal locker",
      "Nutrition planning",
      "Class membership",
    ],
    isActive: true,
    category: "gym",
    isRecommended: false,
  },
];
