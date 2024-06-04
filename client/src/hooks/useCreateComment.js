import { useState, useEffect } from "react";

const useCreateComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdComment, setCreatedComment] = useState(null);

  const createComment = async (questionId, comment) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.id;
      const response = await fetch("http://localhost:8800/postComment", {
        method: "POST",
        headers: { "Content-Type": "application/json", id: userId },
        body: JSON.stringify({ questionId, comment }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setCreatedComment(data);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to create comment");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createdComment,
    createComment,
  };
};

export default useCreateComment;
