//  Application imports:
import { HomePage } from "./pages/HomePage";

// React imports:
import { Routes, Route } from "react-router-dom";

// Main Home router component:
export function HomeRoutes() {
  return (
    <Routes>
      <Route path="" element={<HomePage />} />
    </Routes>
  );
}
