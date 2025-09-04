import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Settings from "./pages/Settings";
import { getAccessToken } from "./api";

function PrivateRoute({ children }) {
  const token = getAccessToken();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
