import { useState } from "react";
import { json } from "react-router-dom";

const useBookmarkQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const bookmarkQuestion = async (questionId) => {
    console.log("BOOKMARK HOOK", questionId);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:4000/bookmarkQuestion?questionId=${questionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            id: JSON.parse(localStorage.getItem("user"))._id,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to bookmark question");
      }
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      //   console.log("Error in bookmarking question", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { bookmarkQuestion, loading, error, response };
};

export default useBookmarkQuestion;
