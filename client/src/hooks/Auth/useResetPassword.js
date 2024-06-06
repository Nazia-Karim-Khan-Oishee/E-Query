import { useState } from "react";

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetPassword = async (email) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        console.error("Password reset failed:", data.message);
        return;
      }
    } catch (error) {
      setError("An error occurred while resetting the password.");
      console.error("An error occurred while resetting the password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, error, isLoading };
};
