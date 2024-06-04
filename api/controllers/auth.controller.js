const User = require("../datamodels/User.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "3d" });
};

const signUpUserController = async (req, res) => {
  const { username, email, password, phone, address } = req.body;
  try {
    const user = await User.signup(username, email, password, phone, address);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      token: token,
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.log("error ashse");
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
const loginUserController = async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.login(userId, password);
    const id = user._id;
    const token = createToken(user._id);
    if (user) {
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
    }
    res.status(200).json({
      token: token,
      _id: id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getLogout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out" });
};

const changePassword = async (req, res) => {
  const { userId, password, newPassword } = req.body;
  try {
    const user = await User.login(userId, password);
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Error("User not found"));
  }

  try {
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    console.log(resetToken);
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: '"Ecosync", admin@ecosync.com',
      to: req.body.email,
      subject: "Password Reset Token",
      text: `Hello, ${user.username} \n We have received a password reset request. Your reset token is: ${resetToken}`, // plain text body
    });
    res.status(200).json({
      message: "Password reset token sent to your email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    res
      .status(500)
      .json({ message: "An error occurred while sending the email" });
  }
};
const passwordReset = async (req, res, next) => {
  try {
    const token = req.body.token;
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new Error("Invalid token or token expired"));
    }
    user.password = req.body.password;

    console.log("ekhane ashe");
    user.passwordResetToken = undefined;
    console.log("undefined hoyna");
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // res.cookie("jwt", "", { maxAge: 1 });
    console.log("Password reset successful");
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  loginUserController,
  getLogout,
  changePassword,
  forgotPassword,
  passwordReset,
  signUpUserController,
};
