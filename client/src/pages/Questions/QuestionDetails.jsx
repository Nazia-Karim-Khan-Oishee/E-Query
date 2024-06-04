import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCreateComment from "../../hooks/useCreateComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAddReply from "../../hooks/useAddReply";
import {
  faThumbsUp,
  faThumbsDown,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "flowbite-react";
// import { fa } from "@awesome.me/kit-KIT_CODE/icons";
const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState("");
  const {
    isLoading,
    error: newerror,
    createdComment,
    createComment,
  } = useCreateComment();
  const { addReply } = useAddReply();
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("id", id);
    await createComment(id, comment);
    setComment("");
    window.location.reload();
  };

  const handleReply = async (e, commentId) => {
    e.preventDefault();
    console.log("id", commentId);
    console.log("Reply:", reply[commentId]);

    console.log("id", commentId);
    console.log("Reply:", reply[commentId]);
    await addReply(commentId.toString(), reply[commentId]);
    setReply("");
    window.location.reload();
  };

  useEffect(() => {
    const fetchQuestionAndComments = async () => {
      try {
        // Fetch question details
        const questionResponse = await fetch(
          `http://localhost:8800/readQuestion?questionID=${id}`
        );
        if (!questionResponse.ok) {
          throw new Error("Failed to fetch question details");
        }
        const questionData = await questionResponse.json();
        setQuestion(questionData);

        // Fetch comments for the question
        const commentsResponse = await fetch(
          `http://localhost:8800/getComment?questionId=${id}`
        );
        if (!commentsResponse.ok) {
          throw new Error("Failed to fetch comments for the question");
        }
        const commentsData = await commentsResponse.json();
        // Fetch replies for each comment
        const commentsWithReplies = await Promise.all(
          commentsData.map(async (comment) => {
            const commentWithReplies = await fetchCommentWithReplies(
              comment._id
            );
            return commentWithReplies;
          })
        );
        setComments(commentsWithReplies);

        console.log(commentsWithReplies);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuestionAndComments();
  }, [id]);

  const fetchCommentWithReplies = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8800/getCommentAndReplies?commentId=${commentId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comment with replies");
      }
      const commentData = await response.json();

      // Extract reply IDs from the comment
      const replyIds = commentData.replies.filter(
        (replyId) => replyId !== null
      );

      // Fetch each reply
      const replyPromises = replyIds.map(async (replyId) => {
        const replyResponse = await fetch(
          `http://localhost:8800/getSingleComment?commentId=${replyId}`
        );
        if (!replyResponse.ok) {
          throw new Error(`Failed to fetch reply with ID ${replyId}`);
        }
        return await replyResponse.json();
      });

      // Wait for all reply fetch requests to complete
      const replies = await Promise.all(replyPromises);

      // Replace reply IDs with actual reply data in the comment data
      const commentWithReplies = {
        ...commentData,
        replies: replies,
      };

      return commentWithReplies;
    } catch (error) {
      console.error("Error fetching comment with replies:", error);
      return null;
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {question ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{question.text}</h1>
          <p className="text-gray-600">Topic: {question.topic}</p>
          <p className="text-gray-600">Upvotes: {question.upvotes}</p>
          <p className="text-gray-600">Downvotes: {question.downvotes}</p>
          <p className="text-gray-400 text-sm">
            Uploaded on: {new Date(question.timestamp).toLocaleString()}
          </p>
        </>
      ) : (
        <p>Question not found</p>
      )}

      <h2 className="text-xl font-bold mt-4 mb-2">Comments</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment._id}>
              <p>{comment.comment}</p>
              <FontAwesomeIcon icon={faThumbsUp} />
              {comment.upvotes}
              <FontAwesomeIcon icon={faThumbsDown} className="ml-4" />
              {comment.downvotes}
              <form onSubmit={(e) => handleReply(e, comment._id)}>
                {" "}
                {/* Pass comment ID */}
                <textarea
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-3/4 md:w-1/2 mt-2"
                  name="reply"
                  value={reply[comment._id] || ""}
                  placeholder="Add a reply"
                  onChange={(e) =>
                    setReply({ ...reply, [comment._id]: e.target.value })
                  }
                />
                <button type="submit">Reply</button>
              </form>
              {comment.replies.length > 0 && (
                <ul className="ml-6">
                  {/* <FontAwesomeIcon icon={faArrowRight} /> */}
                  {comment.replies.map((reply) => (
                    <li key={reply._id}>
                      <p>{reply.comment}</p>
                      <FontAwesomeIcon icon={faThumbsUp} />
                      {reply.upvotes}{" "}
                      <FontAwesomeIcon icon={faThumbsDown} className="ml-4" />
                      {reply.downvotes}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments for this question</p>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-3/4 md:w-1/2 mt-2" // Adjust width here
          name="comment"
          value={comment}
          placeholder="Add a comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default QuestionDetails;
