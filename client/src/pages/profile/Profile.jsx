import React, { useEffect } from "react";
import { useUserProfile } from "../../hooks/profile/useUserProfile";

const Profile = () => {
  const { fetchUserProfile, userProfile, error, isLoading } = useUserProfile();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (isLoading || !userProfile) {
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
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  // Render user profile if data is available
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-12">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <div className="mb-4">
          <label className="text-gray-600">Email:</label>
          <p className="text-gray-900">{userProfile.email}</p>
        </div>
        <div className="mb-4">
          <label className="text-gray-600">Username:</label>
          <p className="text-gray-900">{userProfile.username}</p>
        </div>
        {userProfile.phone && (
          <div className="mb-4">
            <label className="text-gray-600">Phone:</label>
            <p className="text-gray-900">{userProfile.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
