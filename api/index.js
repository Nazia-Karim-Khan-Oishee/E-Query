const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
dotenv.config();

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

const authroutes = require("./routes/auth.route");
const profileroutes = require("./routes/profile.route");
const resourceroutes = require("./routes/resource.route");
const questionroutes = require("./routes/questions.route");
const commentroutes = require("./routes/comment.route");
const voteroutes = require("./routes/vote.route");
const bookmarkroutes = require("./routes/bookmark.route");

app.use(authroutes);
app.use(profileroutes);
app.use(resourceroutes);
app.use(questionroutes);
app.use(commentroutes);
app.use(voteroutes);
app.use(bookmarkroutes);

mongoose
  .connect(process.env.ATLAS_URI, {
    dbName: process.env.ATLAS_DEV_DB,
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

module.exports = app;
