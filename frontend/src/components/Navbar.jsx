import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function Navbar() {
  const { logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="bg-gray-700 dark:bg-gray-800 text-white fixed w-full top-0 z-10 p-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold">MyStream</Link>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-700 dark:bg-gray-200 hover:scale-105 transition-transform duration-200"
          aria-label="Toggle theme"
        >
          {darkMode ? <FiSun className="text-yellow-400 text-2xl" /> : <FiMoon className="text-gray-800 text-2xl" />}
        </button>

        <Link to="/profile" className="underline">Profile</Link>
        <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
}