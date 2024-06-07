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
import Tooltip from "../../components/ToolTip";
import {
  faThumbsUp,
  faThumbsDown,
  faArrowRight,
  faPen,
  faTrashCan,
  faComment,
  faArrowRightToBracket,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

import useBookmarkQuestion from "../../hooks/BookMark/useBookMarkQuestion";
import useGetBookmarks from "../../hooks/BookMark/useGetBookMark";
import useDeleteBookmark from "../../hooks/BookMark/useDeleteBookmark";

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
  const {
    bookmarks,
    loading: getBookmarkLoading,
    error: getBookmarkError,
    refresh: getBookmarks,
    bookmarked,
  } = useGetBookmarks();
  const {
    deleteBookmark,
    loading: deleteLoading,
    error: deleteError,
    response,
    message,
  } = useDeleteBookmark();

  const {
    bookmarkQuestion: BookMarkeQuestion,
    loading: bookmarkLoading,
    error: BookmarkError,
    response: BookmarkResponse,
  } = useBookmarkQuestion();

  const handleBookmarkQuestion = () => {
    console.log("BOOKMARKid", id);
    BookMarkeQuestion(id);
    window.location.reload();
  };
  const handleDeleteBookmark = () => {
    deleteBookmark(id);
    window.location.reload();
  };
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
  const {
    postVotetoComment,
    vote,
    loading: postLoading,
    error: postError,
    success,
  } = useVoteComment();
  const {
    updateVote,
    vote: downvote,
    loading: updatevoteloading,
    error: downvoteError,
    updateSuccess,
  } = useUpdateVote();
  const {
    bookmarkQuestion,
    loading: bookmarking,
    error: bookmarkError,
    response: bookmarkResponse,
    message: bookmarkMessage,
  } = useBookmarkQuestion();

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

  useEffect(() => {
    getBookmarks();
  }, []);

  const isBookmarked = bookmarks.some((bookmark) => bookmark._id === id);
  console.log("isBookmarked", isBookmarked);

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
    console.log("comment EDITTTTTTTTT", comment);
    setEditingComment(comment._id);
    setNewCommentText(comment.comment);
    console.log("newCommentText", newCommentText);
  };

  const handleSaveClick = (commentID) => {
    console.log("commentID in editing", commentID);
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
    console.log("UPVOTE", commentId);
    postVotetoComment(commentId, "upvote");
    // if (postError) {
    // console.log("postError", postError);
    if (success) {
      window.location.reload();
    } else {
      // alert("You have already voted on this comment");
    }
  };
  const handleDownvote = async (commentId) => {
    updateVote(commentId);
    console.log("updatevote", downvote);
    if (updateSuccess) {
      console.log("updateSuccess", updateSuccess);
      window.location.reload();
    } else {
      // alert("You have already voted on this comment");
    }
  };
  return (
    <div className="container mx-auto p-4">
      {question ? (
        <>
          <div className="flex-inliine">
            <h1 className="text-2xl font-bold mb-4">
              {question.text}
              {isBookmarked ? (
                <FontAwesomeIcon
                  icon={solidBookmark}
                  //BOOKMARKED
                  className="cursor-pointer ml-10"
                  onClick={handleDeleteBookmark}
                />
              ) : (
                <FontAwesomeIcon
                  icon={regularBookmark}
                  className="cursor-pointer ml-10"
                  onClick={handleBookmarkQuestion}
                />
              )}
            </h1>

            {/* {BookmarkResponse && <p>{JSON.stringify(BookmarkResponse)}</p>} */}
          </div>
          <p className="text-gray-600 text-xl">Topic: {question.topic}</p>
          {/* <p className="text-gray-600">Upvotes: {question.upvotes}</p>
          <p className="text-gray-600">Downvotes: {question.downvotes}</p> */}
          {question.images && question.images.length > 0 ? (
            <div className="flex flex-wrap">
              {question.images.map(
                (image) => (
                  console.log("image", image),
                  (
                    <img
                      key={image}
                      src={image}
                      alt="Uploaded"
                      className="w-1/4 h-auto cursor-pointer"
                      onClick={() => window.open(image, "_blank")}
                    />
                  )
                )
              )}
            </div>
          ) : null}
          <p className="text-gray-400 text-sm">
            Uploaded on: {new Date(question.timestamp).toLocaleString()}
          </p>
        </>
      ) : (
        <p>Question not found</p>
      )}
      <h2 className="text-xl font-bold mt-4 mb-2">Comments</h2>
      {comments && comments.length > 0 ? (
        (console.log("comments", comments),
        (
          <ul>
            {comments.map(
              (comment) =>
                comment && (
                  <li key={comment._id}>
                    <ul>
                      {" "}
                      {/* Move the ul element here */}
                      <li key={comment._id}>
                        {comment && editingComment === comment._id ? (
                          <>
                            <textarea
                              value={newCommentText}
                              onChange={(e) =>
                                setNewCommentText(e.target.value)
                              }
                              className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-3/4 md:w-1/2 mt-2"
                            />
                            <button
                              className="btn"
                              onClick={() => handleSaveClick(comment._id)}>
                              Save
                            </button>
                            <button
                              className="btn"
                              onClick={() => setEditingComment(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {comment && (
                              <>
                                <p className="text-2xl ">
                                  {" "}
                                  <FontAwesomeIcon
                                    icon={faArrowRightToBracket}
                                    className="ml-2 mr-4 text-2xl solid color-blue"
                                  />
                                  {comment.comment}
                                </p>
                                {comment.commenterId === userId && (
                                  <FontAwesomeIcon
                                    icon={faPen}
                                    className="ml-12 cursor-pointer"
                                    onClick={() => handleEditClick(comment)}
                                  />
                                )}
                              </>
                            )}
                          </>
                        )}
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          className="ml-4 cursor-pointer "
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
                            className="px-2 py-1 border border-gray-400 shadow-md rounded-lg sm:w-3/4 md:w-1/2 mt-2"
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
                          <button className=" ml-5" type="submit">
                            {/* Reply */}
                            <Tooltip text="Add Reply">
                              <FontAwesomeIcon
                                icon={faReply}
                                className="text-2xl"
                              />
                            </Tooltip>
                          </button>
                        </form>
                        {comment.replies &&
                          comment.replies.length > 0 &&
                          comment.replies !== null && (
                            <ul className="ml-6">
                              {/* <FontAwesomeIcon icon={faArrowRight} /> */}
                              {comment.replies.map((reply) => (
                                <li key={reply}>
                                  {reply ? (
                                    <>
                                      {editingComment === reply._id ? (
                                        <>
                                          <textarea
                                            value={newCommentText}
                                            onChange={(e) =>
                                              setNewCommentText(e.target.value)
                                            }
                                            className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-3/4 md:w-1/2 mt-2"
                                          />
                                          <button
                                            className="btn"
                                            onClick={() =>
                                              handleSaveClick(reply._id)
                                            }>
                                            Save
                                          </button>
                                          <button
                                            className="btn"
                                            onClick={() =>
                                              setEditingComment(null)
                                            }>
                                            Cancel
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <p>
                                            <FontAwesomeIcon
                                              icon={faArrowRightToBracket}
                                              className="ml-4 mr-4 text-xl regular color-blue"
                                            />
                                            {reply.comment}
                                          </p>
                                          {reply.commenterId === userId && (
                                            <FontAwesomeIcon
                                              icon={faPen}
                                              className="ml-12 cursor-pointer"
                                              onClick={() =>
                                                handleEditClick(reply)
                                              }
                                            />
                                          )}
                                        </>
                                      )}
                                      <FontAwesomeIcon
                                        icon={faThumbsUp}
                                        className="ml-4 cursor-pointer"
                                        onClick={() => handleUpvote(reply._id)}
                                      />
                                      {reply.upvotes}
                                      <FontAwesomeIcon
                                        icon={faThumbsDown}
                                        className="ml-4 cursor-pointer"
                                        onClick={() =>
                                          handleDownvote(reply._id)
                                        }
                                      />
                                      {reply.downvotes}
                                      {reply.commenterId === userId && (
                                        <FontAwesomeIcon
                                          icon={faTrashCan}
                                          className="ml-4 cursor-pointer"
                                          onClick={() =>
                                            handleDeleteClick(reply._id)
                                          }
                                        />
                                      )}
                                    </>
                                  ) : (
                                    <p></p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                      </li>
                      <br></br>
                    </ul>
                  </li>
                )
            )}
          </ul>
        ))
      ) : (
        <p>No comments for this question</p>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          className="px-4 py-2 border border-gray-600 rounded-lg w-full sm:w-3/4 md:w-1/2 mt-2 shadow-lg"
          name="comment"
          value={comment}
          placeholder="Add a comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <button className=" ml-5 mb-20" type="submit">
          {/* Submit */}
          <Tooltip text="Add Comment">
            <FontAwesomeIcon icon={faComment} className="text-2xl" />
          </Tooltip>
        </button>
      </form>
    </div>
  );
};

export default QuestionDetails;
