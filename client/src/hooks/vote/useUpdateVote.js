import { useState } from "react";

const useUpdateVote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vote, setVote] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const updateVote = async (questionId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:4000/update?voteId=${questionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            id: JSON.parse(localStorage.getItem("user"))._id,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to vote comment");
        console.log(error);
        return;
      }

      const voteData = await response.json();
      setVote(voteData.newVote);
      setUpdateSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateVote, vote, loading, error, updateSuccess };
};

export default useUpdateVote;
