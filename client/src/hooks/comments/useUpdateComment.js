import { useState } from "react";

const useUpdateComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatedComment, setUpdatedComment] = useState(null);

  const updateComment = async (commentID, newComment) => {
    setIsLoading(true);
    setError(null);

    console.log("commentID", commentID);
    const id = JSON.parse(localStorage.getItem("user"))._id;
    try {
      const response = await fetch(
        `http://localhost:4000/updateComment?commentID=${commentID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            id: id,
          },
          body: JSON.stringify({ comment: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const data = await response.json();
      setUpdatedComment(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return { isLoading, error, updatedComment, updateComment };
};

export default useUpdateComment;
