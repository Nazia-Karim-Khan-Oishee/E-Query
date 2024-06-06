import { useState } from "react";

const usegetAllResource = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resource, setResource] = useState([]);

  const getResource = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/getAllResource");

      if (!response.ok) {
        throw new Error("Failed to create resource");
      }

      const data = await response.json();
      console.log(data);
      setResource(data);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(error.message || "Failed to create resource");
      throw error;
    }
  };

  return { loading, error, getResource, resource };
};

export default usegetAllResource;
