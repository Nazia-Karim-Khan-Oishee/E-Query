import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useGetBookMarks from "../../hooks/profile/useGetBookmarks";

const GetBookMark = () => {
  const [bookmark, setbookmark] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);

  const {
    getBookmark,
    loading: getLoading,
    error: getError,
    BookMark,
  } = useGetBookMarks();

  useEffect(() => {
    const fetchBookMark = async () => {
      await getBookmark();
      console.log("Bookmark", BookMark);
      setLoading(false);
    };

    fetchBookMark();
  }, []);

  useEffect(() => {
    if (BookMark) {
      setbookmark(bookmark);
    }
  }, [BookMark]);

  useEffect(() => {
    if (BookMark && BookMark.length > 0) {
      const fetchQuestions = async () => {
        try {
          const questionPromises = BookMark.map((bookmark) =>
            fetch(
              `http://localhost:4000/readQuestion?questionID=${bookmark.questionId}`
            ).then((response) => response.json())
          );
          const questionData = await Promise.all(questionPromises);
          setQuestions(questionData);
        } catch (error) {
          setError("Failed to fetch questions");
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    } else {
      setLoading(false);
    }
  }, [BookMark]);

  if (loading || getLoading) {
    return <p className="text-4xl align-middle">Loading...</p>;
  }

  if (error || getError) {
    return <p>{error || getError}</p>;
  }

  if (!BookMark.length) {
    return <p className="text-4xl">No BookMark available.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>
        <ul className=" grid grid-cols-2 gap-4 px-1">
          {questions.map((question) => (
            <li key={question._id} className="p-4 border rounded-lg shadow-md">
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
    </div>
  );
};

export default GetBookMark;
