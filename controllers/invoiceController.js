// controllers/invoiceController.js

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Example invoice data structure (replace with real data from DB)
const invoices = [
    {
        id: "INV-00123",  // Unique invoice identifier
        userId: "605c72a8f4f13c73e0018b43",  // Customer user ID
        amount: 255.00,  // Grand total after discount and shipping
        dueDate: "2024-11-12",  // Payment due date
        items: [
          { 
            description: "Product A",  // Product name
            quantity: 2,  // Quantity ordered
            price: 50.00  // Sale price per unit
          },
          { 
            description: "Product B",  // Product name
            quantity: 1,  // Quantity ordered
            price: 150.00  // Sale price per unit
          }
        ],
        billingAddress: {  // Billing address details
          addressLine1: "123 Main St",
          addressLine2: "Apt 4B",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA"
        },
        shippingCost: 10.00,  // Shipping cost
        discount: 15.00,  // Total discount applied
        orderReference: "605c72a8f4f13c73e0018b44",  // Reference to the related order
        paymentMethod: "credit_card",  // Payment method used
        paymentStatus: "pending",  // Current payment status
        invoiceStatus: "open",  // Status of the invoice
        invoiceDate: "2024-10-12"  // Invoice creation date
      }
      
      ];

// Generate and download invoice
export const downloadInvoice = async (req, res) => {
  const invoiceId = req.params.invoiceId;
  const invoice = invoices.find(inv => inv.id === parseInt(invoiceId));

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found', invoiceId   });
  }

  // Create a new PDF document
  const doc = new PDFDocument();

  // Define the output path
  const invoicePath = path.join(path.resolve(), 'invoices', `invoice-${invoiceId}.pdf`);

  // Stream to the file system
  const writeStream = fs.createWriteStream(invoicePath);
  doc.pipe(writeStream);

  // Generate invoice PDF content
  doc
    .fontSize(25)
    .text(`Invoice #${invoice.id}`, { align: 'center' });

  doc
    .fontSize(16)
    .text(`Amount Due: $${invoice.amount}`, { align: 'left' });

  doc
    .fontSize(16)
    .text(`Due Date: ${invoice.dueDate}`, { align: 'left' });

  doc.text('\nItems:', { underline: true });

  invoice.items.forEach(item => {
    doc.text(`${item.description} (x${item.quantity}) - $${item.price}`);
  });

  doc.end();

  // Wait for PDF to finish writing to the file
  writeStream.on('finish', () => {
    // Respond with the generated PDF file
    res.download(invoicePath);
  });

  writeStream.on('error', (err) => {
    console.error('Error writing invoice PDF:', err);
    res.status(500).json({ message: 'Error generating invoice' });
  });
};
