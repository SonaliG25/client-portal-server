import express from "express";
import {
  createProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
  updateProposalStatus,
  getAllProposalsWithFilters,
} from "../controllers/proposalController.js";
import { validateProposal } from "../middlewares/validateProposalMiddleware.js";
import {
  isAdmin,
  isValidUser,
} from "../middlewares/userValidatorMiddleware.js";

const router = express.Router();

// Route to create a proposal
router.post("/new", isAdmin, createProposal);

// Route to get all proposals
router.get("/getAllProposals", isValidUser, getAllProposals);

router.get("/proposals", isAdmin, getAllProposalsWithFilters);

// Route to get a single proposal by ID
router.get("/:id", isValidUser, getProposalById);

// Route to update a proposal by ID
router.patch("/:id", isAdmin, validateProposal, updateProposal);

router.patch("/:id/status", isAdmin, updateProposalStatus);

// Route to delete a proposal by ID
router.delete("/:id", isAdmin, deleteProposal);

export default router;
