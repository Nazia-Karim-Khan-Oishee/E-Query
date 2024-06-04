const Question = require("../datamodels/Question.model");
const Comment = require("../datamodels/Comment.model");

const createfirstComment = async (req, res) => {
  try {
    const { questionId } = req.body;
    const { comment } = req.body;
    const id = req.headers["id"];
    console.log("questionId", questionId);
    const questionExists = await Question.exists({ _id: questionId });
    if (!questionExists) {
      console.log("Question not found");
      return res.status(404).json({ error: "Question not found" });
    }

    const newComment = new Comment({
      questionId,
      comment: comment,
      commenterId: id,
    });

    const savedComment = await newComment.save();
    console.log("Comment posted");
    console.log("savedComment", savedComment.commenterId);
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addReply = async (req, res) => {
  try {
    const { reply } = req.body;
    const { commentId } = req.query;
    console.log("commentId", commentId);
    const newReply = new Comment({
      comment: reply,
      commenterId: req.headers["id"],
    });

    const savedReply = await newReply.save();
    console.log("Reply posted");
    console.log("savedReply._id", savedReply._id);
    // Find the parent comment and push the reply's _id to its replies array
    const parentComment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: savedReply._id } },
      { new: true }
    );
    console.log("parentComment", parentComment);
    return res.status(201).json(savedReply);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error adding reply");
  }
};

const getCommentAndReplies = async (req, res) => {
  try {
    const commentId = req.query.commentId;

    const getCommentWithReplies = async (commentId) => {
      const comment = await Comment.findById(commentId).populate(
        "replies.commenterId"
      );

      if (!comment) {
        return null;
      }

      const nestedReplies = await Promise.all(
        comment.replies.map((reply) => getCommentWithReplies(reply._id))
      );

      comment.replies = nestedReplies;

      return comment;
    };

    const commentWithReplies = await getCommentWithReplies(commentId);

    if (!commentWithReplies) {
      console.log("Comment not found");
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(commentWithReplies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getSingleComment = async (req, res) => {
  try {
    const commentId = req.query.commentId; // Extract commentId from req.query
    const comment = await Comment.findById(commentId); // Pass commentId to findById method
    console.log("comment", comment);
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getCommentsForQuestion = async (req, res) => {
  try {
    const questionId = req.query.questionId;

    // Find all comments for the given question ID
    const comments = await Comment.find({ questionId }).populate(
      "replies.commenterId"
    );

    // If no comments are found for the given question ID, return an error
    if (!comments || comments.length === 0) {
      console.log("No comments found for the question");
      return res
        .status(404)
        .json({ error: "No comments found for the question" });
    }

    // Return the comments
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const commentID = req.query.commentID;
    console.log("comment UPDATE");
    const existingComment = await Comment.findById(commentID);

    console.log("existingComment", existingComment.commenterId);

    if (existingComment.commenterId !== req.headers["id"]) {
      console.log("Unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentID,
      { comment: comment },
      { new: true }
    );

    console.log("Comment Updated ");
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentID = req.query.commentID;

    const existingComment = await Comment.findById(commentID);
    if (!existingComment) {
      console.log("Comment not found");
      return res.status(404).json({ error: "Comment not found" });
    }

    if (existingComment.commenterId !== req.user.id) {
      console.log("Unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentID);

    console.log("Comment Deleted");
    res.status(200).json({ Response: "Comment Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  createfirstComment,
  addReply,
  getCommentsForQuestion,
  deleteComment,
  updateComment,
  getCommentAndReplies,
  getSingleComment,
};
