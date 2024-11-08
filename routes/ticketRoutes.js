import express from "express";
import * as ticketController from "../controllers/ticketController.js";
import { isValidUser } from "../middlewares/userValidatorMiddleware.js";
const router = express.Router();

// Create a new ticket
router.post("/new", isValidUser, ticketController.createTicket);
router.get("/tickets", isValidUser, ticketController.getAllTickets);

// Get all tickets
// router.get("/tickets", isValidUser, ticketController.getAllTickets);

// Get a ticket by ID
router.get("/:ticketId", isValidUser, ticketController.getTicketById);

// Update a ticket by ID
router.put("/:ticketId", isValidUser, ticketController.updateTicket);

// Delete a ticket by ID
router.delete("/:ticketId", isValidUser, ticketController.deleteTicket);

// // Search by filters
// router.get("/search", isValidUser, ticketController.searc);
// Fetch tickets by client ID with pagination
router.get(
  "/ticketsByClient",
  isValidUser,
  ticketController.getTicketsByClientId
);
// router.get(
//   "/tickets/tickets",
//   isValidUser,
//   ticketController.searchTicketsForCreator
// );

export default router;
