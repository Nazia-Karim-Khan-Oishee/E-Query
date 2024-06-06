import { useState } from "react";

const useAddQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const addQuestion = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/postQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          id: JSON.parse(localStorage.getItem("user"))._id,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to upload question");
      }

      const result = await response.json();
      setResponse(result);
      console.log(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { addQuestion, loading, error, response };
};

export default useAddQuestion;
