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
      // paymentLink,
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
        status: "Sent",
        // paymentLink,
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
    const query = { recipient: req.user.userId };
    console.log("userID", req.user.userId);

    const proposals = await Proposal.find(query)
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
// Get all proposals
export const getAllProposalsWithFilters = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const searchRegex = new RegExp(search, "i");

    // Ensure only string fields are using $regex
    const query = {
      $or: [
        { title: { $regex: searchRegex } },
        { emailTo: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        // Remove $regex from non-string fields
        // { "products.productId": { $regex: searchRegex } }, // Do not apply regex to productId (ObjectId)
      ],
    };

    const totalProposals = await Proposal.countDocuments(query);

    const proposals = await Proposal.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      // .populate("recipient", "name email") // Populate recipient data (optional)
      .exec();

    res.status(200).json({
      total: totalProposals,
      page: pageNumber,
      totalPages: Math.ceil(totalProposals / limitNumber),
      proposals,
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProposalStatus = async (req, res) => {
  try {
    const proposalId = req.params.id;
    const { status, subscriptionOn } = req.body;

    // Update the proposal status
    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status: status, subscriptionOn: subscriptionOn },
      { new: true } // Return the updated document
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }
    console.log("200", updatedProposal.status, updatedProposal.subscriptionOn);

    res.status(200).json(updatedProposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
