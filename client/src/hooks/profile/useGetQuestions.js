import { useState } from "react";

const useGetQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [Question, setQuestion] = useState(null);

  const getQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:4000/activity/getQuestions",
        {
          headers: {
            "Content-Type": "application/json",
            id: JSON.parse(localStorage.getItem("user"))._id,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload question");
      }

      const result = await response.json();
      setQuestion(result);
      console.log(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { getQuestion, loading, error, Question };
};

export default useGetQuestion;
