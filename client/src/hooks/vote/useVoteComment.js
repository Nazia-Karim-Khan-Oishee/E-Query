import { useState } from "react";

const useVoteComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vote, setVote] = useState(null);

  const postVotetoComment = async (questionId, typeOfVote) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:4000/postVote/Comment?questionId=${questionId}&typeOfVote=${typeOfVote}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            id: JSON.parse(localStorage.getItem("user"))._id,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to vote comment");
      }

      const voteData = await response.json();
      setVote(voteData.newVote);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { postVotetoComment, vote, loading, error };
};

export default useVoteComment;