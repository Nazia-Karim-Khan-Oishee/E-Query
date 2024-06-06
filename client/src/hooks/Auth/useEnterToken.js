import { useState } from "react";

export const useEnterToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const enterToken = async (token, password) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message);

        console.error("Password reset failed:", data.message);
        // return true;
      }
      // return false;
    } catch (error) {
      setError("An error occurred while resetting the password.");
      console.error("An error occurred while resetting the password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { enterToken, error, isLoading };
};
