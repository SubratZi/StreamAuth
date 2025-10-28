import React, { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // <-- Added error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous error
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password"); // <-- Show error in form
    }
  };

  return (
    <div className={`flex justify-center items-center h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform duration-200"
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun className="text-yellow-400 text-2xl" /> : <FiMoon className="text-gray-800 text-2xl" />}
      </button>

      <form
        onSubmit={handleSubmit}
        className={`bg-white dark:bg-gray-800/70 backdrop-blur-md p-6 rounded shadow-md w-80 border border-gray-300 dark:border-gray-700`}
      >
        <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Login</h1>

        <input
          className="w-full border p-2 mb-2 rounded dark:bg-gray-700 dark:text-white"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="w-full border p-2 mb-2 rounded dark:bg-gray-700 dark:text-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p> 
        )}

        <button className="bg-blue-500 dark:bg-blue-600 text-white w-full p-2 rounded" type="submit">
          Login
        </button>

        <p className={`mt-4 text-center ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
          Don't have an account? <a href="/register" className="underline">Register</a>
        </p>
      </form>
    </div>
  );
}