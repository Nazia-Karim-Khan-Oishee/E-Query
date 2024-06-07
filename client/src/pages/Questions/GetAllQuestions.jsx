import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import useQuestionAPI from "../../hooks/Questions/useSearchQuestion";
import useGetTopics from "../../hooks/Questions/useGetTopics";
import parse from "html-react-parser";
import UploadQuestionForm from "./UploadQuestionForm";
import { Button } from "flowbite-react";

const GetAllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:4000/getAllQuestion");
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

  const {
    executeSearch,
    loading: questionLoading,
    error: questionError,
    questions: searchQuestions,
  } = useQuestionAPI();

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);
    try {
      console.log("Searching for:", searchTerm);
      executeSearch(searchTerm);

      setSearchResults(searchQuestions);
      if (questionError) {
        setError(questionError);
        console.error("Error searching questions:", questionError);
      }
    } catch (error) {
      console.error("Error searching questions:", error);
    }
  };

  if (loading) {
    return <p className="text-4xl align-middle">Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const highlightSearchTerm = (text, term) => {
    const regex = new RegExp(`(${term})`, "gi");
    const highlightedText = text.replace(
      regex,
      "<span class='bg-yellow-200 font-bold'>$1</span>"
    );
    // setSearchTerm("");
    return highlightedText;
  };

  return (
    <div className="container mx-auto p-4">
      <div>
        <UploadQuestionForm />
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Search Questions</h1>
        <SearchBar onSearch={handleSearch} />
        {searchResults.length > 0 && (
          <ul className=" grid grid-cols-2 gap-4 px-1">
            {searchResults.map((question) => (
              <li
                key={question._id}
                className="p-4 border rounded-lg shadow-lg">
                <Link
                  to={`/questions/${question._id}`}
                  className="text-xl font-semibold text-blue-500">
                  {question.text}
                </Link>
                <p className="text-gray-600">
                  Topic:{" "}
                  {parse(highlightSearchTerm(question.topic, searchTerm))}
                </p>
                {/* {question.topic} */}
                <p className="text-gray-400 text-sm">
                  Uploaded on: {new Date(question.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {searchResults.length === 0 && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Questions</h1>
          <ul className=" grid grid-cols-2 gap-4 px-1 ">
            {questions.map((question) => (
              <li
                key={question._id}
                className="p-2 border rounded-lg shadow-lg">
                <Link
                  to={`/questions/${question._id}`}
                  className="text-xl font-semibold text-blue-500">
                  {question.text}
                </Link>
                <p className="text-gray-600">Topic: {question.topic}</p>
                <p className="text-gray-400 text-sm">
                  Uploaded on: {new Date(question.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default GetAllQuestions;
