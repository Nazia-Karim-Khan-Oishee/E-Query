import { useState } from "react";

const useDeleteComment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedComment, setDeleteComment] = useState(null);

  const deleteComment = async (commentID) => {
    setIsLoading(true);
    setError(null);

    console.log("commentID", commentID);
    const id = JSON.parse(localStorage.getItem("user"))._id;
    try {
      const response = await fetch(
        `http://localhost:4000/deleteComment?commentID=${commentID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            id: id,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      const data = await response.json();
      setDeleteComment(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return { isLoading, error, deletedComment, deleteComment };
};

export default useDeleteComment;
