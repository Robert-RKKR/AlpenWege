//  Application imports:
import { TrackRetrievePage } from "./pages/TrackRetrievePage";
import { TrackUpdatePage } from "./pages/TrackUpdatePage";
import { TrackListPage } from "./pages/TrackListPage";

// React imports:
import { Routes, Route } from "react-router-dom";

// Main Explorer router component:
export function ExplorerRoutes() {
  return (
    <Routes>
      <Route path="track/:id/edit" element={<TrackUpdatePage />} />
      <Route path="track/:id" element={<TrackRetrievePage />} />
      <Route path="track" element={<TrackListPage />} />
    </Routes>
  );
}
