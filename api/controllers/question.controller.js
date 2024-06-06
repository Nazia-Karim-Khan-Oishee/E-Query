const Question = require("../datamodels/Question.model");
const path = require("path");
const fs = require("fs");

const createQuestion = async (req, res) => {
  try {
    const { text, topic, images } = req.body;
    // console.log(req.headers);
    const newQuestion = new Question({
      text,
      topic,
      uploaderId: req.headers["id"],
      images,
    });

    const savedQuestion = await newQuestion.save();
    console.log(newQuestion);
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateQuestionsText = async (req, res) => {
  try {
    const { text } = req.body;
    const questionID = req.query.questionID;

    const existingQuestion = await Question.findById(questionID);

    if (!existingQuestion) {
      console.log("Question not found");
      return res.status(404).json({ error: "Question not found" });
    }

    if (existingQuestion.uploaderId !== req.user.id) {
      console.log("Unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionID,
      { text: text },
      { new: true }
    );

    console.log("Question Updated ");
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateQuestionsTopic = async (req, res) => {
  try {
    const { topic } = req.body;
    const questionID = req.query.questionID;

    const existingQuestion = await Question.findById(questionID);

    if (!existingQuestion) {
      console.log("Question not found");
      return res.status(404).json({ error: "Question not found" });
    }

    if (existingQuestion.uploaderId !== req.user.id) {
      console.log("Unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionID,
      { topic: topic },
      { new: true }
    );

    console.log("Question Updated ");
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const questionID = req.query.questionID;

    const existingQuestion = await Question.findById(questionID);
    if (!existingQuestion) {
      console.log("Question not found");
      return res.status(404).json({ error: "Question not found" });
    }

    if (existingQuestion.uploaderId !== req.user.id) {
      console.log("Unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const deletedQuestion = await Question.findByIdAndDelete(questionID);

    console.log("Question Deleted");
    res.status(200).json({ response: "Question deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const readQuestion = async (req, res) => {
  try {
    const questionID = req.query.questionID;

    const existingQuestion = await Question.findById(questionID);
    if (!existingQuestion) {
      console.log("Question not found");
      return res.status(404).json({ error: "Question not found" });
    }

    console.log("Got Question ");
    res.status(200).json(existingQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const getAllQuestion = async (req, res) => {
  try {
    const Questions = await Question.find();

    console.log("Questions ");
    res.status(200).json(Questions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const searchQuestionsByTopic = async (req, res) => {
  try {
    const topic = req.query.topic;

    const regex = new RegExp(topic, "i");

    const questions = await Question.find({ topic: regex });

    if (!questions || questions.length === 0) {
      console.log("No questions found for the specified topic");
      return res
        .status(404)
        .json({ error: "No questions found for the specified topic" });
    }

    const questionsTextOnly = questions.map((question) => question.text);
    console.log("Read questions.");
    console.log(questions);
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const searchQuestions = async (req, res) => {
  try {
    const topic = req.query.topic;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const searchCriteria = {};

    if (topic) {
      const topicRegex = new RegExp(topic, "i");
      searchCriteria.topic = topicRegex;
    }

    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);

      searchCriteria.timestamp = { $gte: startDateObj, $lt: endDateObj };
    } else if (startDate) {
      searchCriteria.timestamp = { $gte: new Date(startDate) };
    } else if (endDate) {
      searchCriteria.timestamp = { $lt: new Date(endDate) };
    }

    const questions = await Question.find(searchCriteria);

    if (!questions || questions.length === 0) {
      console.log("No questions found for the specified criteria");
      return res
        .status(404)
        .json({ error: "No questions found for the specified criteria" });
    }

    const questionsTextOnly = questions.map((question) => question.text);
    console.log("Read questions.");

    res.status(200).json(questionsTextOnly);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


const getAllTopics = async (req, res) => {
  try {
    // Fetch all questions from the database
    const questions = await Question.find({}, "topic");

    // Extract topics from questions
    console.log("Topics fetched");
    const topics = questions.map((question) => question.topic);

    // Remove duplicate topics
    const uniqueTopics = Array.from(new Set(topics));

    res.json(uniqueTopics);
  } catch (error) {
    // Handle error
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getQuestions = async (req, res) => {
  try {
    const start = parseInt(req.query.start, 10) || 0;
    const end = parseInt(req.query.end, 10) || 10;
    const limit = end - start;

    const questions = await Question.find()
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .skip(start)
      .limit(limit);

    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getNumberOfTotalQuestions = async (req, res) => {
  try {
    const count = await Question.estimatedDocumentCount(); // or use Question.countDocuments() if you prefer
    res.status(200).json(count);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createQuestion,
  updateQuestionsText,
  updateQuestionsTopic,
  deleteQuestion,
  searchQuestions,
  readQuestion,
  searchQuestionsByTopic,
  getAllQuestion,
  getAllTopics,
};
