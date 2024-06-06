import { useState, useCallback } from "react";

const useGetResource = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Resource, setResource] = useState([]);

  const getResource = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:4000/activity/getResources",
        {
          headers: {
            "Content-Type": "application/json",
            id: JSON.parse(localStorage.getItem("user"))._id,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch resources");
      }

      const result = await response.json();
      setResource(result);
      console.log(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { getResource, loading, error, Resource };
};

export default useGetResource;
