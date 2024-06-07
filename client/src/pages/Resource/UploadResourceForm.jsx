import React, { useState } from "react";
import upload from "../../utills/upload";
import useCreateResource from "../../hooks/Resource/useCreateResource";
import { Textarea, Button, Label, TextInput } from "flowbite-react";
const ResourceForm = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { createResource } = useCreateResource();
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const urls = await Promise.all(
      files.map(async (file) => {
        const url = await upload(file);
        return url;
      })
    );
    setImages(urls);
  };

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const formData = new FormData();

    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    formData.append("text", text);
    if (images.length > 0) {
      formData.append("images", JSON.stringify(images));
    }

    try {
      await createResource(formData);

      setPdfFile(null);
      setText("");
      setImages([]);
      setPreviewImages([]);
      setLoading(false);
      alert("Resource Uploaded");
      window.location.reload();
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Share a resource</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="border border-gray-300 p-2 mb-4 w-full"
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <div className="qattcontainer">
          <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
          </div>
          <div>
            <label>Images:</label>
            <input type="file" onChange={handleImageChange} multiple />
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
          <button className="btn" type="submit" disabled={loading}>
            Submit
          </button>
        </div>
        {error && <p>Error: {error}</p>}
      </form>
    </div>
  );
};

export default ResourceForm;
