import { useState } from "react";

export const useUserProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      console.log("Hook e dhuksw");
      const userData = localStorage.getItem("user");
      if (!userData) {
        throw new Error("User data not found in local storage");
      }
      const user = JSON.parse(userData);
      const id = user._id;
      console.log(id);
      const token = user.token;
      if (!token || !id) {
        throw new Error("Token or User ID not found in user data");
      }
      console.log("token", token);
      console.log("id", id);

      const response = await fetch("/api/getprofile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "user-id": id,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
        alert("failed to fetch user profile");
      }

      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchUserProfile, userProfile, error, isLoading };
};
