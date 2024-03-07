import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const generateInvoice = async (invoiceData, outputPath = 'public/invoice.pdf') => {
  try {
    const doc = new PDFDocument({
      size: [500, 500], // Set the width and height of the PDF
    });
    const stream = fs.createWriteStream(outputPath);

    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);

      doc.pipe(stream);

      // Add content to the PDF document
      doc.fontSize(14).text('Udhari.Com', { align: 'left' }).font('Times-Roman', 16)
      ;
      doc.moveDown();
      doc.text(`Invoice Number: ${invoiceData.invoiceData.name}`);
      doc.text(`Date: ${invoiceData.invoiceData.date}`);
      doc.moveDown();
      doc.text(`company Info:{ 
          company name: ${invoiceData.invoiceData.companyInfo.companyName},
          Location: ${invoiceData.invoiceData.companyInfo.companySubLocation},
          Country Location: ${invoiceData.invoiceData.companyInfo.companyLocation},
          company contact No: ${invoiceData.invoiceData.companyInfo.conpanyContactInfo},
          company GSTIN: ${invoiceData.invoiceData.companyInfo.GSTIN},
      }`)
      doc.moveDown();

      doc.text(`User Info:{ 
        name: ${invoiceData.invoiceData.UserInfo.userName},
        Items: ${invoiceData.invoiceData.UserInfo.itemsBought},
        Total Price: ${invoiceData.invoiceData.UserInfo.totalPrice},
        Transaction Mode: ${invoiceData.invoiceData.UserInfo.TransactionMode},
    }`)

      // Add more details as needed

      // Save the document
      doc.end();
    });

    return outputPath;
  } catch (error) {
    throw error;
  }
};
