import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/signup", {
        email,
        password,
        preferred_language: "en",
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">
          Sign Up
        </h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded-lg border dark:bg-slate-800 dark:text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" required className="mr-2" /> I agree to the{" "}
            <span className="text-cyan-600 ml-1">Terms & Conditions</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center text-slate-600 dark:text-slate-400 mt-4">
          Already have an account?{" "}
          <span
            className="text-cyan-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
