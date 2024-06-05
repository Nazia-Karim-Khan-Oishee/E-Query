import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCreateComment from "../../hooks/comments/useCreateComment";
import useUpdateComment from "../../hooks/comments/useUpdateComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAddReply from "../../hooks/comments/useAddReply";
import useDeleteComment from "../../hooks/comments/useDeleteComment";
// import CommentWithVotes from "../../components/CommentwithVotes";
import useVoteComment from "../../hooks/vote/useVoteComment";
import useUpdateVote from "../../hooks/vote/useUpdateVote";
import {
  faThumbsUp,
  faThumbsDown,
  faArrowRight,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");

  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const {
    isLoading,
    error: newerror,
    createdComment,
    createComment,
  } = useCreateComment();

  const { updateComment } = useUpdateComment();
  const { addReply } = useAddReply();
  const { deleteComment } = useDeleteComment();
  const { postVotetoComment } = useVoteComment();
  const { updateVote } = useUpdateVote();
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
          `http://localhost:4000/readQuestion?questionID=${id}`
        );
        if (!questionResponse.ok) {
          throw new Error("Failed to fetch question details");
        }
        const questionData = await questionResponse.json();
        setQuestion(questionData);

        // Fetch comments for the question
        const commentsResponse = await fetch(
          `http://localhost:4000/getComment?questionId=${id}`
        );
        if (!commentsResponse.ok) {
          throw new Error("Failed to fetch comments for the question");
        }
        const commentsData = await commentsResponse.json();

        // Fetch replies for each comment
        const commentsWithReplies = await Promise.all(
          commentsData.map(async (comment) => {
            console.log("commentId in ", comment._id);
            const commentWithReplies = await fetchCommentWithReplies(
              comment._id
            );
            return commentWithReplies;
          })
        );

        setComments(commentsWithReplies);
        console.log("commentsWithReplies", comment);
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
      console.log("commentId in fetchCommentWithReplies", commentId);
      const response = await fetch(
        `http://localhost:4000/getCommentAndReplies?commentId=${commentId}`
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
          `http://localhost:4000/getSingleComment?commentId=${replyId}`
        );
        if (!replyResponse.ok) {
          throw new Error(`Failed to fetch reply with ID ${replyId}`);
        }
        return await replyResponse.json();
      });

      const replies = await Promise.all(replyPromises);
      return { ...commentData, replies };
    } catch (error) {
      console.error("Error fetching comment with replies:", error);
      return { error: "Error fetching comment with replies" };
      // return { ...commentData, replies: [] };
    }
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment._id);
    setNewCommentText(comment.comment);
  };

  const handleSaveClick = (commentID) => {
    updateComment(commentID, newCommentText);
    setEditingComment(null);
    window.location.reload();
  };

  const handleDeleteClick = (commentID) => {
    deleteComment(commentID);
    window.location.reload();
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleUpvote = async (commentId) => {
    postVotetoComment(commentId, "upvote");
    window.location.reload();
  };
  const handleDownvote = async (commentId) => {
    updateVote(commentId);
    console.log("DOWNVOTE", commentId);
    window.location.reload();
  };
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
      {comments && comments.length > 0 ? (
        <ul>
          {comments.map(
            (comment) =>
              comment && (
                <li key={comment._id}>
                  <ul>
                    {" "}
                    {/* Move the ul element here */}
                    <li key={comment._id}>
                      {comment && reply && editingComment === reply._id ? (
                        <>
                          <textarea
                            value={reply.newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-3/4 md:w-1/2 mt-2"
                          />
                          <button onClick={() => handleSaveClick(comment._id)}>
                            Save
                          </button>
                          <button onClick={() => setEditingComment(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {comment && (
                            <>
                              <p>{comment.comment}</p>
                              {comment.commenterId === userId && (
                                <FontAwesomeIcon
                                  icon={faPen}
                                  className="ml-4 cursor-pointer"
                                  onClick={() => handleEditClick(comment)}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        className="ml-4 cursor-pointer"
                        onClick={() => handleUpvote(comment._id)}
                      />
                      {comment.upvotes}
                      <FontAwesomeIcon
                        icon={faThumbsDown}
                        className="ml-4 cursor-pointer"
                        onClick={() => handleDownvote(comment._id)}
                      />
                      {comment.downvotes}
                      {comment.commenterId === userId && (
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="ml-4 cursor-pointer"
                          onClick={() => handleDeleteClick(comment._id)}
                        />
                      )}

                      <form onSubmit={(e) => handleReply(e, comment._id)}>
                        {" "}
                        {/* Pass comment ID */}
                        <textarea
                          className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-3/4 md:w-1/2 mt-2"
                          name="reply"
                          value={reply[comment._id] || ""}
                          placeholder="Add a reply"
                          onChange={(e) =>
                            setReply({
                              ...reply,
                              [comment._id]: e.target.value,
                            })
                          }
                        />
                        <button type="submit">Reply</button>
                      </form>
                      {comment.replies && comment.replies.length > 0 && (
                        <ul className="ml-6">
                          {/* <FontAwesomeIcon icon={faArrowRight} /> */}
                          {comment.replies.map((reply) => (
                            <li key={reply._id}>
                              {/* <p>{reply.comment}</p> */}
                              {reply && editingComment === reply._id ? (
                                <>
                                  <textarea
                                    value={reply.newCommentText}
                                    onChange={(e) =>
                                      setNewCommentText(e.target.value)
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-3/4 md:w-1/2 mt-2"
                                  />
                                  <button
                                    onClick={() => handleSaveClick(reply._id)}>
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingComment(null)}>
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <p>{reply.comment}</p>
                                  {reply.commenterId === userId && (
                                    <FontAwesomeIcon
                                      icon={faPen}
                                      className="ml-4 cursor-pointer"
                                      onClick={() => handleEditClick(reply)}
                                    />
                                  )}
                                </>
                              )}
                              <FontAwesomeIcon
                                icon={faThumbsUp}
                                className="ml-4 cursor-pointer"
                                onClick={() => handleUpvote(reply._id)}
                              />
                              {reply.upvotes}{" "}
                              <FontAwesomeIcon
                                icon={faThumbsDown}
                                className="ml-4 cursor-pointer"
                                onClick={() => handleDownvote(reply._id)}
                              />
                              {reply.downvotes}
                              {reply.commenterId === userId && (
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  className="ml-4 cursor-pointer"
                                  onClick={() => handleDeleteClick(reply._id)}
                                />
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  </ul>
                </li>
              )
          )}
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
