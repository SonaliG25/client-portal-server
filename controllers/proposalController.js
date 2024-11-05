import Proposal from "../models/proposalModel.js";
import { validationResult } from "express-validator";

import { sendmail } from "../Helper/sendmail.js";

// Create a new proposal
export const createProposal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      recipient,
      title,
      content,
      emailTo,
      products,
      discountOnGrandTotal,
      attachments,
    } = req.body;

    // Calculate productTotal and grandTotal
    let productTotal = 0;
    products.forEach((product) => {
      productTotal += product.total;
    });

    const grandTotal = productTotal;
    const finalAmount = grandTotal - discountOnGrandTotal;

    const newProposal = new Proposal({
      recipient,
      title,
      content,
      emailTo,
      products,
      productTotal,
      grandTotal,
      discountOnGrandTotal,
      finalAmount,
    });

    const savedProposal = await newProposal.save();
    sendmail(emailTo, title, content, attachments);
    res.status(201).json(savedProposal);
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
