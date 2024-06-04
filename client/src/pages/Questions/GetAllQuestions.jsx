import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const GetAllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8800/getAllQuestion");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch questions");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Questions</h1>
      <ul className="space-y-4">
        {questions.map((question) => (
          <li key={question._id} className="p-4 border rounded-lg shadow-md">
            <li key={question._id} className="p-4 border rounded-lg shadow-md">
              <Link
                to={`/questions/${question._id}`}
                className="text-xl font-semibold text-blue-500">
                {question.text}
              </Link>
            </li>
            <p className="text-gray-600">Topic: {question.topic}</p>
            <p className="text-gray-400 text-sm">
              Uploaded on: {new Date(question.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllQuestions;
