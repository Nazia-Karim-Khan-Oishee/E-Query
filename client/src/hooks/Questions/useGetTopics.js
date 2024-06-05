import { useState, useEffect } from "react";

function useGetTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await fetch("http://localhost:4000/getAllTopics");
        if (!response.ok) {
          throw new Error("Failed to fetch topics");
        }
        const data = await response.json();
        setTopics(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    fetchTopics();

    return () => {};
  }, []);

  return { topics, loading, error };
}

export default useGetTopics;
