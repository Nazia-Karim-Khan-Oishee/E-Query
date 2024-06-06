import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as faThumbsUpFilled } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as faThumbsUpOutline } from "@fortawesome/free-regular-svg-icons";
import useUpvoters from "../hooks/vote/useUpvoter";

const CommentWithVotes = ({ comment }) => {
  const { upvoterIds, loading, error, fetchUpvoters } = useUpvoters();
  const userId = JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => {
    fetchUpvoters(comment._id);
  }, [comment._id, fetchUpvoters]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const hasUpvoted = upvoterIds.includes(userId);

  return (
    <FontAwesomeIcon
      icon={hasUpvoted ? faThumbsUpFilled : faThumbsUpOutline}
      className="ml-4 cursor-pointer"
    />
  );
};

export default CommentWithVotes;
