import React, { useEffect, useState } from "react";
import useExtractTextAndSummarize from "../../hooks/Resource/useTextExtraction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useGetResource from "../../hooks/profile/useGetResources";

const GetResources = () => {
  const [Error, setError] = useState("");
  const [Loading, setLoading] = useState(true);
  const [resource, setResource] = useState([]);
  const { getResource, Resource } = useGetResource();

  const { ExtractandSummarize } = useExtractTextAndSummarize();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        await getResource();
        if (Resource) {
          setResource(Resource);
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch resources");
        setLoading(false);
      }
    };
    fetchResource();
  }, [getResource, Resource]);

  const openPDF = (pdfUrl) => {
    const altpdfUrl = `http://localhost:4000/uploads/resources/${pdfUrl}`;
    window.open(altpdfUrl, "_blank");
  };

  const openImageInNewWindow = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  if (Loading) {
    return <div>Loading...</div>;
  }

  if (Error) {
    console.error(Error);
    return <div>An error occurred. Please try again later.</div>;
  }

  const handleExtractTextAndSummarize = (imageUrl) => {
    alert("Please wait while we summarize");

    setTimeout(() => {
      ExtractandSummarize(imageUrl);
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Resource List</h1>
      <div className="">
        {resource.map((res) => (
          <div key={res._id} className="border rounded-lg p-4">
            <p className="text-lg font-semibold mb-2">Text: {res.text}</p>
            {res.pdf && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => openPDF(res.pdf)}>
                View PDF
              </button>
            )}
            {res.images &&
              res.images.length > 0 &&
              res.images.map((image, index) => (
                <div key={index} className="my-4">
                  <img
                    src={image}
                    alt="resource"
                    className="w-1/4 h-auto cursor-pointer"
                    onClick={() => openImageInNewWindow(image)}
                  />
                  <button
                    className="mt-2 p-2 bg-blue-500 text-white rounded"
                    onClick={() => handleExtractTextAndSummarize(image)}>
                    Click to summarize
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetResources;
