const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
require("./config/passport")(passport);
require("./config/auth")(passport);
dotenv.config();

mongoose.set("strictQuery", true);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

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

app.listen(8800, () => {
  connect();
  console.log("Server is running");
});
