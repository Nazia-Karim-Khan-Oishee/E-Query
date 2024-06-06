const express = require("express");
const router = express.Router();
const {
  postVote,
  postVotetoComment,
  updateVote,
  deleteVote,
  getUpvoters,
} = require("../controllers/vote.controller");

const { ensureAuthenticated } = require("../middleware/auth.middleware");

router.post("/postVote/Comment", postVotetoComment);
router.get("/getUpvote/:questionId", getUpvoters);
// router.post("/postVote/Question", postVote);
router.patch("/update", updateVote);
router.delete("/deleteVote/:Id", deleteVote);

module.exports = router;
