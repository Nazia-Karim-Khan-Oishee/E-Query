import { useState } from "react";

const useDeleteResource = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteResource = async (resourceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:4000/deleteResource/${resourceId}`,
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

  return { deleteResource, loading, error };
};

export default useDeleteResource;
