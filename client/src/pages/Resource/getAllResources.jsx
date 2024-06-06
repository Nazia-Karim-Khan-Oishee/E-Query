import React, { useEffect } from "react";
import usegetAllResource from "../../hooks/Resource/useGetAllResrource";

const GetAllResources = () => {
  const { loading, error, getResource, resource } = usegetAllResource();

  useEffect(() => {
    getResource();
  }, []);

  const openPDF = (pdfUrl) => {
    const altpdfUrl = `http://localhost:4000/uploads/resources/${pdfUrl}`;

    // Open the PDF in a new tab or window
    window.open(altpdfUrl, "_blank");
    // window.open("localhost:4000/uploads/resources/" + pdfUrl, "_blank");
  };

  const openImageInNewWindow = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Extract the array of resources from the response object
  const existingResources = resource.existingResources || [];

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Resource List</h2>
      <div className="">
        {existingResources.map((res) => (
          <div key={res._id} className="border rounded-lg p-4">
            <p className="text-lg font-semibold mb-2">Text: {res.text}</p>
            {res.pdf && (
              <>
                {/* <p className="text-sm text-gray-600 mb-2">PDF: {res.pdf}</p> */}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => openPDF(res.pdf)}>
                  View PDF
                </button>
              </>
            )}
            {res.images &&
              res.images.length > 0 &&
              res.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="resource"
                  className="w-1/4 h-auto cursor-pointer"
                  onClick={() => openImageInNewWindow(image)}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllResources;
