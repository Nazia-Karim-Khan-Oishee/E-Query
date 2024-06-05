import { useState } from "react";

function useQuestionAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const executeSearch = async (searchTerm) => {
    setLoading(true);
    try {
      // Perform the search operation here
      const response = await fetch(
        `http://localhost:4000/searchQuestionbyTopic?topic=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("No questions found for the specified topic");
      }
      const data = await response.json();
      setQuestions(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
      return { questions: [], error: error.message };
    }
  };

  return { executeSearch, loading, error, questions };
}

export default useQuestionAPI;
