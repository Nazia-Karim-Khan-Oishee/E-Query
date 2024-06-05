const express = require("express");
const router = express.Router();
const {
  createQuestion,
  updateQuestionsText,
  updateQuestionsTopic,
  deleteQuestion,
  readQuestion,
  searchQuestionsByTopic,
  searchQuestions,
  getAllQuestion,
  getAllTopics,
} = require("../controllers/question.controller");

const { ensureAuthenticated } = require("../middleware/auth.middleware");

router.post("/postQuestion", ensureAuthenticated, createQuestion);
router.patch("/updateQuestionText", ensureAuthenticated, updateQuestionsText);
router.patch("/updateQuestionTopic", ensureAuthenticated, updateQuestionsTopic);
router.delete("/deleteQuestion", ensureAuthenticated, deleteQuestion);
router.get("/getAllQuestion", getAllQuestion);
router.get("/readQuestion", readQuestion);
router.get("/getAllTopics", getAllTopics);
router.get(
  "/searchQuestionbyTopic",

  searchQuestionsByTopic
);
router.get("/searchQuestionbyTopicandDate", searchQuestions);
module.exports = router;
