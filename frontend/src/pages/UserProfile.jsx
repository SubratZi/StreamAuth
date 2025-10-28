import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="user-profile">
      <h3>User Profile</h3>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;