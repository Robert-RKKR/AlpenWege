// Application imports:
import { DashboardPage } from "./pages/user/UserDashboardPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { CardsPage } from "./pages/user/UserCardsPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { Routes, Route } from "react-router-dom";
import { UserPage } from "./pages/user/UserPage";

// Main Profiles router component:
export function AuthRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="profile" element={<UserPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="cards" element={<CardsPage />} />
    </Routes>
  );
}
