import Proposal from "../models/proposalModel.js";
import { validationResult } from "express-validator";

import { sendEmail } from "../Helper/sendmail.js";

// Create a new proposal
export const createProposal = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const { proposalData } = req.body;
  console.log("proposalData", proposalData);

  if (!proposalData) {
    return res.status(400).json({ error: "Proposal data is required" });
  }

  try {
    // Example of reading the properties
    const {
      recipient,
      emailTo,
      title,
      content,
      products,
      grandTotalCurrency,
      productTotal,
      grandTotal,
      discountOnGrandTotal,
      finalAmount,
      attachments,
    } = proposalData;

    console.log("Recipient:", recipient);
    console.log("Email To:", emailTo);
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Products:", products);
    console.log("Grand Total Currency:", grandTotalCurrency);
    console.log("Product Total:", productTotal);
    console.log("Grand Total:", grandTotal);
    console.log("Discount on Grand Total:", discountOnGrandTotal);
    console.log("Final Amount:", finalAmount);
    console.log("Attachments:", attachments);

    const mailStatus = sendEmail(proposalData);

    if (mailStatus) {
      console.log("mailStatus", mailStatus);
      const newProposal = new Proposal({
        recipient,
        emailTo,
        title,
        content,
        products,
        grandTotalCurrency,
        productTotal,
        grandTotal,
        discountOnGrandTotal,
        finalAmount,
        attachments,
        status: "sent",
      });
      const savedProposal = await newProposal.save();

      res.status(201).json(savedProposal);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all proposals
export const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate("recipient")
      .populate("products.productId");
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single proposal by ID
export const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate("recipient")
      .populate("products.productId");

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a proposal by ID
export const updateProposal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { recipient, title, content, products, discountOnGrandTotal } =
      req.body;

    // Calculate productTotal and grandTotal
    let productTotal = 0;
    products.forEach((product) => {
      productTotal += product.total;
    });

    const grandTotal = productTotal;
    const finalAmount = grandTotal - discountOnGrandTotal;

    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      {
        recipient,
        title,
        content,
        emailTo,
        products,
        productTotal,
        grandTotal,
        discountOnGrandTotal,
        finalAmount,
      },
      { new: true }
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json(updatedProposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a proposal by ID
export const deleteProposal = async (req, res) => {
  try {
    const deletedProposal = await Proposal.findByIdAndDelete(req.params.id);

    if (!deletedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json({ message: "Proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendEmailToClient = (req, res) => {};
