import React, { useEffect, useState } from "react";
import { useUpdateProfile } from "../../hooks/profile/useUpdateProfile";

const UpdateProfile = () => {
  const [username, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const { updateProfile, error, isLoading } = useUpdateProfile();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(username, phone, userId);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Render user profile if data is available
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-12">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 mr-5">Update Profile</h2>
        <div className="mb-4">
          <p className="text-red-600">Email cannot be changed</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-gray-600">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border rounded px-3 py-2 mt-1"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="w-full border rounded px-3 py-2 mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="btn w-56">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
