import { useState } from "react";

const useDeleteQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteQuestion = async (questionID) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:4000/deleteQuestion?questionID=${questionID}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err);
      console.error("Failed to delete question", err);
      throw err;
    }
  };

  return { deleteQuestion, loading, error };
};

export default useDeleteQuestion;
