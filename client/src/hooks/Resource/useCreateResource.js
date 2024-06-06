import { useState } from "react";

const useCreateResource = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createResource = async (formData) => {
    setLoading(true);
    setError(null);

    console.log(formData);
    try {
      const response = await fetch("http://localhost:4000/postResource", {
        headers: {
          id: JSON.parse(localStorage.getItem("user"))._id,
        },
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create resource");
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(error.message || "Failed to create resource");
      throw error;
    }
  };

  return { loading, error, createResource };
};

export default useCreateResource;
