import React, { useEffect } from "react";
import { useUserProfile } from "../../hooks/profile/useUserProfile";

const Profile = () => {
  const { fetchUserProfile, userProfile, error, isLoading } = useUserProfile();
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileArray = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevImages) => prevImages.concat(fileArray));
    setImages((prevImages) => prevImages.concat(files));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const url = await upload(image);
          return url;
        })
      );

      console.log(JSON.parse(localStorage.getItem("user"))._id);
      const formData = {
        text,
        topic,
        images: imageUrls,
        // uploaderId: JSON.parse(localStorage.getItem("user"))._id,
      };

      await addQuestion(formData);
      setText("");
      setTopic("");
      setImages([]);
      setPreviewImages([]);
      navigate("/getAllQuestion");
    } catch (err) {
      console.error("Error uploading question:", err);
    } finally {
      setUploading(false);
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

  // Render user profile if data is available
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-12">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <div className="mb-4">
          <img
            src={
              userProfile.profilePicture ||
              "https://w7.pngwing.com/pngs/184/113/png-transparent-user-profile-computer-icons-profile-heroes-black-silhouette-thumbnail.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full mr-4"
          />
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
            <button className="btn w-56">Change Password</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
