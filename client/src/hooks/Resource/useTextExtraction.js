import { generatePDFFromSummary } from "../../utills/generatePDF";

const useExtractTextAndSummarize = () => {
  const ExtractandSummarize = async (imageUrl) => {
    try {
      const response = await fetch(
        "http://localhost:4000/extractTextAndSummarize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to extract text and summarize");
      }

      const data = await response.json();
      //   const newWindow = window.open();
      //   // Populate the new window with the extracted summary
      //   newWindow.document.write(
      //     `<html><body><h1>Summary:</h1><p>${data.summary}</p></body></html>`
      //   );

      // alert(`Summary: ${data.summary}`);

      await generatePDFFromSummary(data.summary);
    } catch (error) {
      console.error(error.message);
      // alert("Failed to extract text and summarize");
    }
  };

  return { ExtractandSummarize };
};

export default useExtractTextAndSummarize;
