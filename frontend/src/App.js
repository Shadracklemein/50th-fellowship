import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Members from "./pages/Members";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginWithRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </Router>
  );
}

// Helper to allow redirect after login
function LoginWithRedirect() {
  const navigate = useNavigate();
  return <Login onLoginSuccess={() => navigate("/members")} />;
}

export default App;