import { useAuthContext } from "./useAuthContext";
import { useState } from "react";
export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const [message, setMessage] = useState("");
  const logout = async () => {
    //remove user from storage

    try {
      const response = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include", // to send cookies
      });
      if (response.ok) {
        localStorage.removeItem("user");
        const data = await response.json();
        setMessage(data.message);
      } else {
        setMessage("Error logging out");
      }
      dispatch({ type: "LOGOUT" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      setMessage("Error logging out");
    }
  };
  //dispatch logout action

  return { logout };
};
