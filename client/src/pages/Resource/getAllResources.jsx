import React, { useEffect, useState } from "react";
import usegetAllResource from "../../hooks/Resource/useGetAllResrource";
import SearchBar from "../../components/SearchBar";
import useSearchResource from "../../hooks/Resource/useSearchResource";
import parse from "html-react-parser";

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

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Resource List</h2>

      <div>
        <h1>Search Questions</h1>
        <SearchBar onSearch={handleSearch} />
        {searchResults.length > 0 && (
          <ul className="space-y-4">
            {searchResults.map((res) => (
              <div key={res._id} className="border rounded-lg p-4">
                {/* <p className="text-lg font-semibold mb-2">Text: {res.text}</p> */}
                {parse(highlightSearchTerm(res.text, searchTerm))}

                {res.pdf && res.pdf != null && (
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
                  res.images.map(
                    (image, index) =>
                      image && (
                        <img
                          key={index}
                          src={image}
                          alt="resource"
                          className="w-1/4 h-auto cursor-pointer"
                          onClick={() => openImageInNewWindow(image)}
                        />
                      )
                  )}
              </div>
            ))}
          </ul>
        )}
      </div>

      {searchResults.length === 0 && (
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
      )}
    </div>
  );
};

export default GetAllResources;
