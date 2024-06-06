import { useState } from "react";

const useGetBookMarks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [BookMark, setBookMark] = useState(null);

  const getBookmark = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:4000/activity/getBookMarks",
        {
          headers: {
            "Content-Type": "application/json",
            id: JSON.parse(localStorage.getItem("user"))._id,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }

      const result = await response.json();
      setBookMark(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { getBookmark, BookMark, loading, error };
};

export default useGetBookMarks;
