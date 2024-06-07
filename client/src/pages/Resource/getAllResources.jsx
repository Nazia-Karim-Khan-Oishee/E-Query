import React, { useEffect, useState } from "react";
import usegetAllResource from "../../hooks/Resource/useGetAllResrource";
import SearchBar from "../../components/SearchBar";
import useSearchResource from "../../hooks/Resource/useSearchResource";
import parse from "html-react-parser";
import { generatePDFFromSummary } from "../../utills/generatePDF";
import useExtractTextAndSummarize from "../../hooks/Resource/useTextExtraction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadResourceForm from "./UploadResourceForm";

const GetAllResources = () => {
  const { loading, error, getResource, resource } = usegetAllResource();
  const [searchResults, setSearchResults] = useState([]);
  const [Error, setError] = useState("");
  const [Loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    executeSearch,
    loading: searchLoading,
    error: searchError,
    resource: searchResources,
  } = useSearchResource();

  const { ExtractandSummarize } = useExtractTextAndSummarize();
  useEffect(() => {
    getResource();
  }, []);

  const openPDF = (pdfUrl) => {
    const altpdfUrl = `http://localhost:4000/uploads/resources/${pdfUrl}`;

    window.open(altpdfUrl, "_blank");
  };

  const openImageInNewWindow = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  const handleSearch = async (searchTerm) => {
    setSearchTerm(searchTerm);
    try {
      console.log("Searching for:", searchTerm);
      executeSearch(searchTerm);

      console.log(searchResources);
      setSearchResults(searchResources.resources || []);
      if (searchError) {
        setError(searchError);
        console.error("Error searching questions:", searchError);
      }
    } catch (error) {
      console.error("Error searching questions:", error);
    }
  };

  if (Loading) {
    return <div>Loading...</div>;
  }

  if (Error) {
    console.error(Error);
    return <div>An error occured. Please try again later.</div>;
  }

  const highlightSearchTerm = (text, term) => {
    const regex = new RegExp(`(${term})`, "gi");
    const highlightedText = text.replace(
      regex,
      "<span class='bg-yellow-200 font-bold'>$1</span>"
    );
    return highlightedText;
  };

  const existingResources = resource.existingResources || [];

  const handleExtractTextAndSummarize = (imageUrl) => {
    alert("Please wait while we summarize");
    setTimeout(() => {
      ExtractandSummarize(imageUrl);
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mx-5">
        <UploadResourceForm />
      </div>
      <h1 className="text-2xl mx-5 mt-10 font-bold mb-4">Resource List</h1>

      <div className="mx-5">
        <h5>Search Resources</h5>

        <SearchBar onSearch={handleSearch} />
        {searchResults.length > 0 && (
          <ul className="space-y-4">
            {searchResults.map((res) => (
              <div key={res._id} className="border rounded-lg p-4">
                {parse(highlightSearchTerm(res.text, searchTerm))}

                {res.pdf && (
                  <button className="btn w-56" onClick={() => openPDF(res.pdf)}>
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
                        className="btn w-56"
                        onClick={() => handleExtractTextAndSummarize(image)}
                      >
                        Click to summarize
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </ul>
        )}
      </div>

      {searchResults.length === 0 && (
        <div className="">
          {existingResources.map((res) => (
            <div key={res._id} className="border rounded-lg p-4">
              <p className="text-lg font-semibold mb-2"> {res.text}</p>
              {res.pdf && (
                <button
                  className="btn w-56 mt-5"
                  onClick={() => openPDF(res.pdf)}
                >
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
                      className="btn w-56 mt-5"
                      onClick={() => handleExtractTextAndSummarize(image)}
                    >
                      Click to summarize
                    </button>
                    <ToastContainer
                      position="top-center"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="dark"
                      transition="bounce"
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllResources;
