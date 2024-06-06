import { useState } from "react";

function useSearchResource() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resource, setResource] = useState([]);
  const executeSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/searchResources?searchTerm=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("No questions found for the specified topic");
      }
      const data = await response.json();
      setResource(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
      return { resource: [], error: error.message };
    }
  };

  return { executeSearch, loading, error, resource };
}

export default useSearchResource;
