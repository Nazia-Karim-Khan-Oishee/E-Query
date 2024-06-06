import { useState } from "react";

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (username, phone, userId) => {
    console.log(username, phone, userId);
    try {
      setIsLoading(true);
      const response = await fetch("/api/users/updateProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          phone: phone,
          userId: userId,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        setError(data.message);
        console.error("Updating profile failed:", data.message);
      }
      window.location.href = "/profile";

      return data; // Return data regardless of response status
    } catch (error) {
      setError("An error occurred while updating profile.");
      console.error("An error occurred while updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, error, isLoading };
};
