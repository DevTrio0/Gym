export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'coach' | 'client'
  avatar?: string
}

export interface Subscription {
  id: string
  userId: string
  plan: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'pending'
  amount: number
}

export interface Workout {
  id: string
  clientId: string
  coachId: string
  date: string
  time: string
  type: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export interface WorkoutPlan {
  id: string
  clientId: string
  coachId: string
  name: string
  description: string
  exercises: Exercise[]
  createdAt: string
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
  notes?: string
}

export interface Progress {
  id: string
  clientId: string
  date: string
  weight: number
  bodyFat?: number
  notes?: string
}

export interface Payment {
  id: string
  userId: string
  subscriptionId: string
  amount: number
  date: string
  method: string
  status: 'completed' | 'pending' | 'failed'
}
