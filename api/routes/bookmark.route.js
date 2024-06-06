const express = require("express");
const router = express.Router();
const {
  bookmarkQuestion,
  Deletebookmark,
  getBookmarks,
} = require("../controllers/bookmark.controller");

const { ensureAuthenticated } = require("../middleware/auth.middleware");

router.post("/bookmarkQuestion", bookmarkQuestion);
router.get("/getbookmark", getBookmarks);
router.delete("/deletebookmark", Deletebookmark);

module.exports = router;
