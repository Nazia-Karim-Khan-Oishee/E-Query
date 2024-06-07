import React, { useEffect, useState, useRef } from "react";
import { useUserProfile } from "../../hooks/profile/useUserProfile";
import { useNavigate } from "react-router-dom";
import upload from "../../utills/upload";
import { Button } from "flowbite-react";
import { FaCamera } from "react-icons/fa";

const Profile = () => {
  const { fetchUserProfile, userProfile, error, isLoading } = useUserProfile();
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [updating, setUpdating] = useState(false);

  const handleImageChange = (e) => {
    setUpdating(true);
    const files = Array.from(e.target.files);
    const fileArray = files.map((file) => URL.createObjectURL(file));
    setPreviewImage(fileArray[0]);
    setImage(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const imageUrl = await upload(image);
      console.log(imageUrl);
      console.log(JSON.parse(localStorage.getItem("user"))._id);
      await fetch("/api/users/updatepicture", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: JSON.parse(localStorage.getItem("user"))._id,
          photo: imageUrl,
        }),
      });

      setImage(null);
      setPreviewImage(null);
      fetchUserProfile(); // Refresh the user profile after update
    } catch (err) {
      console.error("Error uploading question:", err);
    } finally {
      setUploading(false);
      setUpdating(false);
    }
  };

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

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-12">
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-4">User Profile</h2>
          <a href="/updateProfile">
            <button className="btn w-50">Edit</button>
          </a>
        </div>
        <div className="mb-4 relative">
          <img
            src={
              userProfile.profilePicture ||
              "https://w7.pngwing.com/pngs/184/113/png-transparent-user-profile-computer-icons-profile-heroes-black-silhouette-thumbnail.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <div
            className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <FaCamera className="text-white" />
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
            {previewImage && (
              <div className="mt-2">
                <label className="text-gray-600">Preview:</label>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-24 h-24 rounded-full"
                />
              </div>
            )}
            {updating && (
              <Button
                color="blue"
                type="submit"
                disabled={uploading}
                className="mt-4"
              >
                {uploading ? "Uploading..." : "Update Profile Picture"}
              </Button>
            )}
          </form>
        </div>
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
        <div>
          <a href="/changePassword">
            <button className="btn w-50">Change Password</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
