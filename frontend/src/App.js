import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Members from './pages/Members';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/members" style={{ marginRight: '1rem' }}>Members</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/members" element={<Members />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Members />} />
      </Routes>
    </Router>
  );
}

export default App;
