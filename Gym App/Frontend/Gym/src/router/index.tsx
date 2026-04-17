import { BrowserRouter, Routes, Route } from "react-router-dom";

// TODO: Re-enable auth checks after backend API integration

// Pages
import LandingPage from "@/pages/public/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import AdminDashboard from "@/pages/admin/Dashboard";
import CoachDashboard from "@/pages/coach/Dashboard";
import CoachMyClients from "@/pages/coach/MyClients";
import ClientNotes from "@/pages/coach/ClientNotes";
import AddTraining from "@/pages/coach/AddTraining";
import AddDiet from "@/pages/coach/AddDiet";
import ClientWelcomePage from "@/pages/client/WelcomePage";
import BookWorkout from "@/pages/client/dashboard/BookWorkout";
import SubscriptionSelectPlan from "@/pages/client/dashboard/SubscriptionSelectPlan";
import SubscriptionPayment from "@/pages/client/dashboard/SubscriptionPayment";
import SubscriptionRenewOrChange from "@/pages/client/dashboard/SubscriptionRenewOrChange";
import WorkoutWeek from "@/pages/client/dashboard/WorkoutWeek";
import Progress from "@/pages/client/dashboard/Progress";
import ProgressUpdate from "@/pages/client/dashboard/ProgressUpdate";
import SubscriptionPage from "@/pages/client/SubscriptionPage";
// Admin Pages
import AddCoach from "@/pages/admin/AddCoach";
import AddClient from "@/pages/admin/AddClient";
import DeleteAccount from "@/pages/admin/DeleteAccount";
import DeactivateAccount from "@/pages/admin/DeactivateAccount";
import ReactivateAccount from "@/pages/admin/ReactivateAccount";
import Reports from "@/pages/admin/Reports";
import Payments from "@/pages/admin/Payments";
import Profits from "@/pages/admin/Profits";
import SubscriptionPlans from "@/pages/admin/SubscriptionPlans";
import ClientsCount from "@/pages/admin/ClientsCount";

// Protected Route Component
// TODO: Re-integrate auth checks after backend API is ready
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Auth checks disabled for frontend-only development
  // Will be re-enabled with real backend integration
  return <>{children}</>;
}

export default function AppRouter() {
  // TODO: Re-integrate auth state after backend API is ready
  // For now, all routes are accessible for frontend testing

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route
          path="/client/welcome"
          element={
            <ProtectedRoute>
              <ClientWelcomePage />
            </ProtectedRoute>
          }
        />

        {/* Client Nested Routes */}
        <Route
          path="/client/welcome/subscription"
          element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/welcome/subscription/select-plan"
          element={
            <ProtectedRoute>
              <SubscriptionSelectPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/welcome/subscription/payment"
          element={
            <ProtectedRoute>
              <SubscriptionPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/welcome/subscription/renew-or-change"
          element={
            <ProtectedRoute>
              <SubscriptionRenewOrChange />
            </ProtectedRoute>
          }
        />

        {/* Client Routes - nested under /client/welcome */}
        <Route
          path="/client/welcome/book-workout"
          element={
            <ProtectedRoute>
              <BookWorkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/welcome/workout-week"
          element={
            <ProtectedRoute>
              <WorkoutWeek />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/welcome/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/welcome/progress/update"
          element={
            <ProtectedRoute>
              <ProgressUpdate />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-coach"
          element={
            <ProtectedRoute>
              <AddCoach />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-client"
          element={
            <ProtectedRoute>
              <AddClient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/delete-account"
          element={
            <ProtectedRoute>
              <DeleteAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/deactivate-account"
          element={
            <ProtectedRoute>
              <DeactivateAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reactivate-account"
          element={
            <ProtectedRoute>
              <ReactivateAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profits"
          element={
            <ProtectedRoute>
              <Profits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subscription"
          element={
            <ProtectedRoute>
              <SubscriptionPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients-count"
          element={
            <ProtectedRoute>
              <ClientsCount />
            </ProtectedRoute>
          }
        />

        {/* Coach Routes */}
        <Route
          path="/coach"
          element={
            <ProtectedRoute>
              <CoachDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/dashboard"
          element={
            <ProtectedRoute>
              <CoachDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/my-clients"
          element={
            <ProtectedRoute>
              <CoachMyClients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/client/:clientId/notes"
          element={
            <ProtectedRoute>
              <ClientNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/add-training"
          element={
            <ProtectedRoute>
              <AddTraining />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/add-diet"
          element={
            <ProtectedRoute>
              <AddDiet />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
