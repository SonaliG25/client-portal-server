import express from "express";
import * as ticketController from "../controllers/ticketController";
import { isValidUser } from "../middlewares/userValidatorMiddleware.js";
const router = express.Router();

// Create a new ticket
router.post("/tickets", isValidUser, ticketController.createTicket);

// Get all tickets
router.get("/tickets", isValidUser, ticketController.getAllTickets);

// Get a ticket by ID
router.get("/tickets/:ticketId", isValidUser, ticketController.getTicketById);

// Update a ticket by ID
router.put("/tickets/:ticketId", isValidUser, ticketController.updateTicket);

// Delete a ticket by ID
router.delete("/tickets/:ticketId", isValidUser, ticketController.deleteTicket);

// Search tickets by filters
router.get("/tickets/search", isValidUser, ticketController.searchTickets);

export default router;
