import { generateInvoice } from "../utils/generatePdf.js";

export const generatePdf = async (req, res) => {
  try {
    const invoiceData = req.body; // You need to send the invoice data from the client

    console.log(invoiceData.invoiceData.name)
    // Generate the invoice
    const outputPath = await generateInvoice(invoiceData);

    // Send the generated PDF as a downloadable response
    res.download(outputPath, 'invoice.pdf', (err) => {
      if (err) {
        console.error('Error sending the PDF:', err);
        res.status(500).send('Internal Server Error');
      }
      // No need to delete the file here
    });
  } catch (error) {
    console.error('Error generating the PDF:', error);
    res.status(500).send('Internal Server Error');
  }
};
