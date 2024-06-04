const express = require("express");
const router = express.Router();
const {
  loginUserController,
  getLogout,
  changePassword,
  forgotPassword,
  passwordReset,
  signUpUserController,
} = require("../controllers/auth.controller");

router.post("/auth/signup", signUpUserController);
router.post("/auth/login", loginUserController);
router.get("/auth/logout", getLogout);
router.post("/auth/change-password", changePassword);
router.post("/auth/reset-password/initiate", forgotPassword);
router.post("/auth/reset-password/confirm", passwordReset);
module.exports = router;
