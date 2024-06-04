const express = require("express");
const router = express.Router();
const {
  postVote,
  postVotetoComment,
  updateVote,
  deleteVote,
} = require("../controllers/vote.controller");

const { ensureAuthenticated } = require("../middleware/auth.middleware");

router.post("/postVote/Question", postVote);
router.post("/postVote/Comment", postVotetoComment);
router.patch("/update", updateVote);
router.delete("/deleteVote/:Id", deleteVote);

module.exports = router;
