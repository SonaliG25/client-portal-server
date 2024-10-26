import express from "express";
import {
  createProposalTemplate,
  getAllTemplates,
  getTemplateById,
  updateProposalTemplate,
  deleteProposalTemplate,
} from "../controllers/proposalTemplateController.js";

import { isAdmin } from "../middlewares/userValidatorMiddleware.js";
const router = express.Router();

// Routes for proposal templates
router.post("/new", isAdmin, createProposalTemplate); // Create a new template
router.get("/templates", isAdmin, getAllTemplates); // Get all templates
router.get("/templates/:templateId", isAdmin, getTemplateById); // Get a specific template
router.patch("/templates/:templateId", isAdmin, updateProposalTemplate); // Update a template
router.delete("/templates/:id", isAdmin, deleteProposalTemplate);
export default router;
