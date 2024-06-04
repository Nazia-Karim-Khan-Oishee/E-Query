import { useState } from "react";

const useAddReply = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState(null);

  const addReply = async (commentId, replyText) => {
    setIsLoading(true);
    console.log("commentId", commentId);
    console.log("replyText", replyText);
    try {
      const response = await fetch(
        `http://localhost:8800/addReply?commentId=${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            id: JSON.parse(localStorage.getItem("user")).id,
          },
          body: JSON.stringify({ reply: replyText }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add reply");
      }
      const data = await response.json();
      setReply(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return { isLoading, error, reply, addReply };
};

export default useAddReply;
