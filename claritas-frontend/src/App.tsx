import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CogniView from "./pages/CogniView";
import CogniSetup from "./pages/CogniSetup";
import CareView from "./pages/CareView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cogniview" element={<CogniView />} />
        <Route path="/cogniview/setup" element={<CogniSetup />} />
        <Route path="/careview/:sessionId" element={<CareView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
