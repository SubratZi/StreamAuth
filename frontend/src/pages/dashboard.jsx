import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="pt-20 container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome back, {user.username}!</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Video Player</h2>
        <video
          controls
          className="w-full rounded shadow"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
        />
      </div>
    </div>
  );
}