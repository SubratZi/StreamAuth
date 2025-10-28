import React, { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(formData);
      setSuccess("Registered successfully! Redirecting..."); 
      setTimeout(() => navigate("/dashboard"), 1500); 
    } catch {
      setError("Registration failed. Please check your input.");
    }
  };

  return (
    <div className={`flex justify-center items-center h-screen relative ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform duration-200"
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun className="text-yellow-400 text-2xl" /> : <FiMoon className="text-gray-800 text-2xl" />}
      </button>

      
      {success && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/70 dark:bg-gray-800/70 text-green-600 dark:text-green-400 px-4 py-2 rounded shadow-md backdrop-blur-sm transition-opacity duration-300">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`bg-white dark:bg-gray-800/70 backdrop-blur-md p-6 rounded shadow-md w-80 border border-gray-300 dark:border-gray-700`}
      >
        <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Register</h1>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded dark:bg-gray-700 dark:text-white"
        />

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <button className="bg-green-500 dark:bg-green-600 text-white w-full p-2 rounded" type="submit">
          Register
        </button>

        <p className={`mt-4 text-center ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
          Already have an account? <a href="/login" className="underline">Login</a>
        </p>
      </form>
    </div>
  );
}