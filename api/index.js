const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authroutes = require("./routes/auth.route");
const profileroutes = require("./routes/profile.route");
const resourceroutes = require("./routes/resource.route");
const questionroutes = require("./routes/questions.route");
const commentroutes = require("./routes/comment.route");
const voteroutes = require("./routes/vote.route");
const bookmarkroutes = require("./routes/bookmark.route");

require("dotenv").config();

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(authroutes);
app.use(profileroutes);
app.use(resourceroutes);
app.use(questionroutes);
app.use(commentroutes);
app.use(voteroutes);
app.use(bookmarkroutes);
mongoose
  .connect(process.env.ATLAS_URI, {
    dbName: process.env.ATLAS_TEST_DB,
  })
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.status(201).json({ message: "Connected to Server!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
