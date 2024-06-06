const express = require("express");
const router = express.Router();
const {
  updateProfileInfo,
  updatePasssword,
  postProfileImage,
  getProfileImage,
  getProfile,
  updateProfilePicture,
  deleteProfileImage,
  getResourcesByUser,
  getQuestionsByUser,
  getCommentsByUser,
} = require("../controllers/profile.controller");

const { uploadProfileImage } = require("../middleware/image.middleware");
const { ensureAuthenticated } = require("../middleware/auth.middleware");

router.patch("/users/updatepassword", ensureAuthenticated, updatePasssword);
router.patch("/users/updateProfile", ensureAuthenticated, updateProfileInfo);
router.patch(
  "/users/updatepicture",
  ensureAuthenticated,
  uploadProfileImage.single("image"),
  updateProfilePicture
);

router.post(
  "/postProfileImage",
  ensureAuthenticated,
  uploadProfileImage.single("image"),
  postProfileImage
);

router.get("/getprofileimage", getProfileImage);
router.get("/getprofile", getProfile);
router.get("/activity/getResources", getResourcesByUser);
router.get("/activity/getQuestions", getQuestionsByUser);
router.get("/activity/getComments", getCommentsByUser);

router.delete("/user/deletePicture", deleteProfileImage);

module.exports = router;
