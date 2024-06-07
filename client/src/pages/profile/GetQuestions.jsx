import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGetQuestion from "../../hooks/profile/useGetQuestions";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDeleteQuestion from "../../hooks/profile/useDeleteQuestion";

const GetQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { deleteQuestion } = useDeleteQuestion();
  const {
    getQuestion,
    loading: getLoading,
    error: getError,
    Question,
  } = useGetQuestion();

  useEffect(() => {
    const fetchQuestions = async () => {
      await getQuestion();
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (Question) {
      setQuestions(Question);
    }
  }, [Question]);

  if (loading || getLoading) {
    return <p className="text-4xl align-middle">Loading...</p>;
  }

  if (error || getError) {
    return <p>{error || getError}</p>;
  }

  if (!questions.length) {
    return <p className="text-4xl">No questions available.</p>;
  }

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      alert("Question deleted successfully");
      // setQuestions((prevQuestions) =>
      //   prevQuestions.filter((question) => question._id !== id)
      // );
      window.location.reload();
    } catch (err) {
      // alert("Failed to delete the question.");
      console.error("Failed to delete the question.", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">My Questions</h1>
        <ul className="grid grid-cols-2 gap-4 px-1">
          {questions.map((question) => (
            <li key={question._id} className="p-4 border rounded-lg shadow-lg">
              <Link
                to={`/questions/${question._id}`}
                className="text-xl font-semibold text-blue-500">
                {question.text}
              </Link>
              <FontAwesomeIcon
                icon={faTrashCan}
                className="ml-20 mr-10 cursor-pointer"
                onClick={() => handleDelete(question._id)}
              />
              <p className="text-gray-600">Topic: {question.topic}</p>
              <p className="text-gray-400 text-sm">
                Uploaded on: {new Date(question.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GetQuestions;
