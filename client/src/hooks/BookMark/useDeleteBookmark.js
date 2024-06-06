import { useState } from "react";

const useDeleteBookmark = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [message, setMessage] = useState("");

  const deleteBookmark = async (questionId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:4000/deletebookmark?questionId=${questionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            id: JSON.parse(localStorage.getItem("user"))._id,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete bookmark");
      }

      setResponse(data);
      setMessage(data.message || "Bookmark removed successfully");
    } catch (err) {
      console.error("Error deleting bookmark", err);
      setError(err.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return { deleteBookmark, loading, error, response, message };
};

export default useDeleteBookmark;
