import { useState } from "react";

const useUpvoters = () => {
  const [upvoterIds, setUpvoterIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUpvoters = async (commentId) => {
    setLoading(true);
    setError(null);
    const questionId = commentId;

    try {
      const response = await fetch(
        `http://localhost:4000/getUpvote/${questionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch upvoters");
      }
      const data = await response.json();
      setUpvoterIds(data.upvoterIds);
    } catch (err) {
      setError(err.message || "Failed to fetch upvoters");
    } finally {
      setLoading(false);
    }
  };

  return { upvoterIds, loading, error, fetchUpvoters };
};

export default useUpvoters;
