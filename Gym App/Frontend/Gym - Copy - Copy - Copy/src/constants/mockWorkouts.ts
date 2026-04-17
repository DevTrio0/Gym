export interface WorkoutSession {
  id: string;
  day: string;
  date: string;
  exercises: string[];
  duration: number;
  intensity: "Low" | "Medium" | "High";
  coach: string;
  completed: boolean;
}

export const WEEKLY_WORKOUTS: WorkoutSession[] = [
  {
    id: "mon",
    day: "Monday",
    date: "Jan 8",
    exercises: ["Chest Press", "Bench Push-ups", "Cable Flyes"],
    duration: 60,
    intensity: "High",
    coach: "Coach Alex",
    completed: true,
  },
  {
    id: "tue",
    day: "Tuesday",
    date: "Jan 9",
    exercises: ["Cardio Run", "Jump Rope", "Mountain Climbers"],
    duration: 45,
    intensity: "High",
    coach: "Coach Sarah",
    completed: true,
  },
  {
    id: "wed",
    day: "Wednesday",
    date: "Jan 10",
    exercises: ["Back Rows", "Lat Pulldowns", "Reverse Flyes"],
    duration: 60,
    intensity: "Medium",
    coach: "Coach Alex",
    completed: false,
  },
  {
    id: "thu",
    day: "Thursday",
    date: "Jan 11",
    exercises: ["Leg Press", "Squats", "Hamstring Curls"],
    duration: 60,
    intensity: "High",
    coach: "Coach Mike",
    completed: false,
  },
  {
    id: "fri",
    day: "Friday",
    date: "Jan 12",
    exercises: ["Yoga Stretching", "Core Work", "Balance Training"],
    duration: 45,
    intensity: "Low",
    coach: "Coach Emma",
    completed: false,
  },
  {
    id: "sat",
    day: "Saturday",
    date: "Jan 13",
    exercises: ["Full Body Circuit", "CrossFit", "Strength Training"],
    duration: 90,
    intensity: "High",
    coach: "Coach Alex",
    completed: false,
  },
  {
    id: "sun",
    day: "Sunday",
    date: "Jan 14",
    exercises: ["Active Recovery", "Light Stretching", "Meditation"],
    duration: 30,
    intensity: "Low",
    coach: "Coach Emma",
    completed: false,
  },
];

export const INTENSITY_COLORS = {
  Low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  High: "bg-red-500/20 text-red-400 border-red-500/30",
};
