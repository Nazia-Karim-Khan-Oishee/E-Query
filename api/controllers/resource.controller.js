const Resource = require("../datamodels/Resource.model");
const path = require("path");
const fs = require("fs");

const Tesseract = require("tesseract.js");

const summarizeText = (text) => {
  const sentences = text.split(". ");
  if (sentences.length > 2) {
    return sentences.slice(0, 2).join(". ") + ".";
  }
  return text;
};

const extractTextAndSummarize = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "No image URL provided" });
    }

    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;

    const response = await fetch(imageUrl);
    const imageBuffer = await response.buffer();

    const {
      data: { text },
    } = await Tesseract.recognize(Buffer.from(imageBuffer), "eng");

    const summary = summarizeText(text);

    res.status(200).json({ text, summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createResource = async (req, res) => {
  try {
    let pdf = ""; // Initialize with an empty string

    if (req.file) {
      // PDF file provided
      pdf = req.file.filename;
    }

    const { text, images } = req.body;

    console.log(req.body);
    const parsedImages = images ? JSON.parse(images) : [];

    console.log(parsedImages);
    const newResource = new Resource({
      uploader: req.headers["id"],
      pdf: pdf,
      images: parsedImages,
      text: text,
    });

    await newResource.save();
    console.log("Resource Uploaded");

    res.status(200).json({ newResource });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: error.message });
  }
};

const updateText = async (req, res, next) => {
  const resourceID = req.params.resourceId;
  console.log(resourceID);

  const existingResource = await Resource.findById(resourceID);

  if (!existingResource) {
    console.log("No resource found");
    return res.status(404).json({ error: "Resource not found" });
  }

  if (existingResource.uploader !== req.user.id) {
    console.log("Unauthorized");
    return res.status(400).json({ error: "Unauthorized" });
  }
  const { text } = req.body;

  const updatedResource = await Resource.findByIdAndUpdate(
    resourceID,
    { text: text },
    { new: true }
  );

  if (!updatedResource) {
    console.log("No resource found");
    return res.status(404).json({ error: "Resource not found" });
  }

  console.log("Text Updated ");

  res.json({ message: "Text updated successfully" });
};

const updatePDF = async (req, res, next) => {
  // console.log(userId);
  const resourceID = req.params.resourceId;
  console.log(resourceID);

  const existingResource = await Resource.findById(resourceID);

  if (!existingResource) {
    console.log("No resource found");
    return res.status(404).json({ error: "Resource not found" });
  }

  if (existingResource.uploader !== req.user.id) {
    console.log("Unauthorized");
    return res.status(400).json({ error: "Unauthorized" });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    const pdf = req.file.filename;

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceID,
      { pdf: pdf },
      { new: true }
    );

    if (!updatedResource) {
      console.log("No resource found");
      return res.status(404).json({ error: "Resource not found" });
    }

    console.log("PDF Updated ");

    res.json({ message: "PDF updated successfully" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: error.message });
  }
};

const deleteResource = async (req, res, next) => {
  // console.log(userId);
  const resourceID = req.params.resourceId;
  console.log(resourceID);

  const existingResource = await Resource.findById(resourceID);
  console.log(existingResource);
  // if (!existingResource) {
  //   console.log("No resource found");
  //   return res.status(404).json({ error: "Resource not found" });
  // }

  //   console.log("Unauthorized");
  //   return res.status(400).json({ error: "Unauthorized" });
  // }

  try {
    if (existingResource.uploader) {
      await Resource.findByIdAndDelete(resourceID);
    }
    console.log("Resource Deleted ");

    res.json({ message: "Resource Deleted" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: error.message });
  }
};

const getResource = async (req, res, next) => {
  try {
    const existingresourceID = req.params.resourceId;
    const existingResource = await Resource.findById(
      existingresourceID,
      "-uploader"
    );

    res.status(200).json({ existingResource });
    console.log(existingResource.pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllResource = async (req, res, next) => {
  try {
    const existingResources = await Resource.find();

    res.status(200).json({ existingResources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const searchResources = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    console.log(searchTerm);
    if (!searchTerm) {
      return res.status(400).json({ error: "No search term provided" });
    }

    const resources = await Resource.find({
      text: { $regex: searchTerm, $options: "i" },
    });
    if (!resources) {
      console.log("No resources found");
      return res.status(404).json({ error: "No resources found" });
    }
    console.log(resources);
    res.status(200).json({ resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createResource,
  updateText,
  updatePDF,
  getResource,
  deleteResource,
  getAllResource,
  searchResources,
  extractTextAndSummarize,
};
