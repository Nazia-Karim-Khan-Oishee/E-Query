import React, { useState } from "react";
import useAddQuestion from "../../hooks/Questions/useAddQuestion";
import upload from "../../utills/upload";
import { useNavigate } from "react-router-dom";
import { Textarea, Button, Label, TextInput } from "flowbite-react";
const UploadQuestionForm = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { addQuestion, loading, error, response } = useAddQuestion();
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileArray = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevImages) => prevImages.concat(fileArray));
    setImages((prevImages) => prevImages.concat(files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const url = await upload(image);
          return url;
        })
      );

      console.log(JSON.parse(localStorage.getItem("user"))._id);
      const formData = {
        text,
        topic,
        images: imageUrls,
        // uploaderId: JSON.parse(localStorage.getItem("user"))._id,
      };

      await addQuestion(formData);
      setText("");
      setTopic("");
      setImages([]);
      setPreviewImages([]);
      navigate("/getAllQuestion");
    } catch (err) {
      console.error("Error uploading question:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Ask a question</h1>
        <Textarea
          color={"gray-600"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <div className="qattcontainer">
        <div className="topic-box">
          <TextInput
            color={"indigo-400"}
            type="text"
            value={topic}
            placeholder="Enter topic"
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Images:</Label>
          <input
            className="file-input"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            multiple
          />

          <div>
            {previewImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`preview ${index}`}
                width="100"
              />
            ))}
          </div>
        </div>
        <button
          className="btn w-50"
          type="submit"
          disabled={uploading || loading}
        >
          {uploading || loading ? "Uploading..." : "Upload Question"}
        </button>
      </div>
      {error && <p>Error: {error}</p>}
      {response && <p>Question uploaded successfully!</p>}
    </form>
  );
};

export default UploadQuestionForm;
