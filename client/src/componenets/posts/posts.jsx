import React from "react";
import Post from "./post";

const Posts = ({ questions }) => {
  return (
    <div>
      {questions.map((question) => (
        <Post key={question.id} question={question} />
      ))}
    </div>
  );
};

export default Posts;
