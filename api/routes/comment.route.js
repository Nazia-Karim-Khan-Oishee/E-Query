const express = require("express");
const router = express.Router();
const {
  createfirstComment,
  addReply,
  getCommentsForQuestion,
  deleteComment,
  updateComment,
  getCommentAndReplies,
  getSingleComment,
} = require("../controllers/comment.controller");

const { ensureAuthenticated } = require("../middleware/auth.middleware");

router.post("/postComment", createfirstComment);
router.post("/addreply", addReply);
router.patch("/updateComment", updateComment);
router.get("/getComment", getCommentsForQuestion);
router.get("/getCommentandReplies", getCommentAndReplies);
router.get("/getSingleComment", getSingleComment);
router.delete("/deleteComment", deleteComment);

module.exports = router;
