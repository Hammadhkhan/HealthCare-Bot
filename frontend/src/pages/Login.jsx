import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setTokens } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", {
        username: email,
        password,
      });
      setTokens(data.authToken, data.refresh_token || "");
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
          Login
        </h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-center text-slate-600 dark:text-slate-400 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-cyan-600 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
