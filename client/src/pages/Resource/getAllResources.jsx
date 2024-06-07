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
import {
  faFilePdf,
  faImages,
  faRectangleList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "../../components/ToolTip";

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
          <div className="mt-2 grid grid-cols-3 gap-2">
            {/* <ul className="space-y-4"> */}
            {searchResults.map((res) => (
              <div key={res._id} className="border rounded-lg p-4 shadow-lg">
                <p className="ml-10 text-lg font-semibold mb-2">
                  {parse(highlightSearchTerm(res.text, searchTerm))}
                </p>

                {res.pdf && (
                  // <button className="btn w-56" onClick={() => openPDF(res.pdf)}>
                  //   View PDF
                  // </button>
                  <Tooltip text="View PDF">
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className="mr-2 ml-12 text-2xl solid cursor-pointer"
                      onClick={() => openPDF(res.pdf)}
                    />
                  </Tooltip>
                )}
                {res.images &&
                  res.images.length > 0 &&
                  res.images.map((image, index) => (
                    // <div key={index} className="my-4">
                    <>
                      {/* <img
                        src={image}
                        alt="resource"
                        className="w-1/4 h-auto cursor-pointer"
                        onClick={() => openImageInNewWindow(image)}
                      /> */}
                      <Tooltip text="View Image">
                        <FontAwesomeIcon
                          key={index}
                          icon={faImages}
                          className="ml-2 mr-2 text-2xl solid cursor-pointer"
                          onClick={() => openImageInNewWindow(image)}
                        />
                      </Tooltip>
                      {/* <button
                        className="btn px-2 mt-5 ml-4"
                        onClick={() => handleExtractTextAndSummarize(image)}>
                        Summarize Image
                      </button> */}
                      <Tooltip text="Summarize Image">
                        <FontAwesomeIcon
                          icon={faRectangleList}
                          className="ml-2 mr-2 py-.5 text-2xl solid cursor-pointer"
                          onClick={() => handleExtractTextAndSummarize(image)}
                        />
                      </Tooltip>
                      {/* </div> */}
                    </>
                  ))}
              </div>
            ))}
            {/* </ul> */}
          </div>
        )}
      </div>

      {searchResults.length === 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {existingResources.map((res) => (
            <>
              <div key={res._id} className="border rounded-lg p-4 shadow-lg">
                <p className="ml-10 text-lg font-semibold mb-2"> {res.text}</p>
                {res.pdf && (
                  // <button
                  //   className="btn w-56 mt-5"
                  //   onClick={() => openPDF(res.pdf)}>
                  //   View PDF
                  // </button>
                  <Tooltip text="View PDF">
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className="mr-2 ml-12 text-2xl solid cursor-pointer"
                      onClick={() => openPDF(res.pdf)}
                    />
                  </Tooltip>
                )}
                {res.images &&
                  res.images.length > 0 &&
                  res.images.map((image, index) => (
                    <>
                      {/* <div key={index} className="my-4"> */}
                      {/* <img
                        src={image}
                        alt="resource"
                        className="w-1/4 h-auto cursor-pointer"
                        onClick={() => openImageInNewWindow(image)}
                      /> */}
                      <Tooltip text="View Image">
                        <FontAwesomeIcon
                          key={index}
                          icon={faImages}
                          className="ml-2 mr-2 text-2xl solid cursor-pointer"
                          onClick={() => openImageInNewWindow(image)}
                        />
                      </Tooltip>
                      <Tooltip text="Summarize Image">
                        {/* <button
                          className="btn px-2 mt-5 ml-4"
                          onClick={() => handleExtractTextAndSummarize(image)}>
                          Summarize image
                        </button> */}
                        <FontAwesomeIcon
                          icon={faRectangleList}
                          className="ml-2 mr-2 py-.5 text-2xl solid cursor-pointer"
                          onClick={() => handleExtractTextAndSummarize(image)}
                        />
                      </Tooltip>
                      {/* </div> */}
                    </>
                  ))}
              </div>
              {/* <br></br> */}
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllResources;
