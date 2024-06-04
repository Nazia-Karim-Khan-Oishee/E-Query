import React, { useState, useEffect } from "react";
import Posts from "../componenets/posts/posts";

const Feed = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchQuestions = async (startIndex, endIndex) => {
    try {
      const response = await axios.get("/getAllQuestions", {
        params: {
          startIndex,
          endIndex,
        },
      });
      setQuestions(response.data.questions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions(0, 9); // Fetch first page with 10 posts
  }, []);

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 9;
    fetchQuestions(startIndex, endIndex);
    setCurrentPage(page);
  };

  return (
    <div>
      <Posts questions={questions} />
      <div>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Feed;
