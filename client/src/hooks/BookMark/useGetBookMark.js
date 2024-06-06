import { useState, useEffect } from "react";

const useGetBookmarks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);

  const getBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/getbookmark`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          id: JSON.parse(localStorage.getItem("user"))._id,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to get bookmarks");
      }
      const data = await res.json();
      setBookmarks(data);
      setBookmarked(data.length > 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookmarks();
  }, []);

  return { bookmarks, loading, error, refresh: getBookmarks, bookmarked };
};

export default useGetBookmarks;
