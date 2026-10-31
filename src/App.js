import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./routes/AppLayout";
import AuthGate from "./routes/AuthGate";
import LogPage from "./features/log/LogPage";
import LogPageNew from "./features/log/LogPageNew";
import HistoryPage from "./features/history/HistoryPage";
import ProfilePage from "./features/profile/ProfilePage";

export default function App() {
  return (
    <AuthGate>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/log" replace />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/lognew" element={<LogPageNew />} />

        </Route>
      </Routes>
    </AuthGate>
  );
}
