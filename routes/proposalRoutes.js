import express from "express";
import {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
} from "../controllers/proposalController.js";
import { validateProposal } from "../middlewares/validationMiddleware.js";
import { isAdmin } from "../middlewares/userValidatorMiddleware.js";

const router = express.Router();

// Route to create a proposal
router.post("/newProposal", isAdmin, validateProposal, createProposal);

// Route to get all proposals
router.get("/getAllProposals", isAdmin, getAllProposals);

// Route to get a single proposal by ID
router.get("/:id", isAdmin, getProposalById);

// Route to update a proposal by ID
router.put("/:id", isAdmin, validateProposal, updateProposal);

// Route to delete a proposal by ID
router.delete("/:id", isAdmin, deleteProposal);

export default router;
