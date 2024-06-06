import { PDFDocument, rgb } from "pdf-lib";

export const generatePDFFromSummary = async (summary) => {
  try {
    const cleanedSummary = summary.replace(/[^a-zA-Z0-9\s]/g, "");

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const fontSize = 12;
    page.drawText(cleanedSummary, {
      x: 50,
      y: page.getHeight() - 50 - fontSize,
      size: fontSize,
      color: rgb(0, 0, 0),
      maxWidth: page.getWidth() - 100,
    });

    // Save the PDF document
    const pdfBytes = await pdfDoc.save();

    // Open the PDF document in a new tab
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Failed to generate PDF:", error);
  }
};
