const express = require("express");
const Question = require("../datamodels/Question.model");
const Bookmark = require("../datamodels/Bookmark.model");

const bookmarkQuestion = async (req, res) => {
  try {
    const { questionId } = req.query;
    const userId = req.headers["id"];

    console.log("Bookmarking question", questionId);
    const existingBookmark = await Question.findOne({
      userId,
      questionId,
    });

    if (existingBookmark) {
      console.log("Question is already bookmarked");
      return res.send("Comment is already bookmarked");
    }

    const newBookmark = new Bookmark({
      userId,
      questionId,
    });

    await newBookmark.save();
    console.log("Question bookmarked successfully");

    res.status(200).json({ newBookmark });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const Deletebookmark = async (req, res) => {
  try {
    const { questionId } = req.query;
    const userId = req.headers["id"];

    const deletedBookmark = await Bookmark.findOneAndDelete({
      userId,
      questionId,
    });

    if (deletedBookmark) {
      console.log("Bookmark removed");
      return res.status(200).json({ error: "Bookmark removed" });
    }

    // res.status(200).json({ response: "Comment bookmarked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getBookmarks = async (req, res) => {
  try {
    const userId = req.headers["id"];

    // Find all bookmarks for the specified user, populate the associated comments
    const userBookmarks = await Bookmark.find({ userId }).populate(
      "questionId"
    );

    // Extract text from each comment, handling null cases
    const questionIds = userBookmarks.map((bookmark) =>
      bookmark.questionId ? bookmark.questionId : null
    );

    console.log("Got Bookmarks with Comments");

    res.status(200).json(questionIds);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { bookmarkQuestion, Deletebookmark, getBookmarks };
