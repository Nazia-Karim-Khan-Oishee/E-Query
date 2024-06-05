const express = require("express");
const router = express.Router();
const {
  createResource,
  updatePDF,
  updateText,
  deleteResource,
  getResource,
  getAllResource,
} = require("../controllers/resource.controller");

const { uploadResource } = require("../middleware/pdf.middleware");

router.post("/postResource", uploadResource.single("pdf"), createResource);

router.patch("/resource/updateText/:resourceId", updateText);
router.patch(
  "/resource/updatePDF/:resourceId",

  uploadResource.single("pdf"),
  updatePDF
);

router.delete("/deleteResource/:resourceId", deleteResource);

router.get("/getresource/:resourceId", getResource);
router.get("/getAllResource", getAllResource);

module.exports = router;
