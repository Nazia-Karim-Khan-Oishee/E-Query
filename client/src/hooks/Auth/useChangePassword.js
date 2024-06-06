// useChangePassword.js

import { useState } from "react";

export const useChangePassword = () => {
  const [error, setError] = useState(null);

  const changePassword = async (userId, password, newPassword) => {
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          password: password,
          newPassword: newPassword,
        }),
      });
      if (!response.ok) {
        throw new Error("Password change failed");
      }
      return await response.json();
    } catch (err) {
      throw new Error(err.message || "Something went wrong");
    }
  };

  return { changePassword, error };
};
