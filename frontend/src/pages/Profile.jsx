import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {
  const { user } = useAuth();
  const { darkMode } = useTheme();

  if (!user) return <div className="p-4 text-gray-800 dark:text-gray-200">No user info available</div>;

  return (
    <div className={`pt-20 container mx-auto p-4 ${darkMode ? 'text-white' : 'text-black'}`}>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className={`bg-gray-100 dark:bg-gray-800 p-4 rounded shadow space-y-2`}>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Points:</strong> {user.points || 0}</p>
        <p><strong>Remaining Watch Time:</strong> {user.watchTime || 0} mins</p>
      </div>
    </div>
  );
}