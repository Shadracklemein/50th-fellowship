import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Members from "./pages/Members";
import AdminDashboard from "./pages/AdminDashboard";
import PastorDashboard from "./pages/PastorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginWithRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/member-dashboard" element={<Members />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/pastor-dashboard" element={<PastorDashboard />} />
        {/* Legacy route for backward compatibility */}
        <Route path="/members" element={<Members />} />
      </Routes>
    </Router>
  );
}

// Helper to allow redirect after login
function LoginWithRedirect() {
  const navigate = useNavigate();
  return <Login onLoginSuccess={() => navigate("/member-dashboard")} />;
}

export default App;