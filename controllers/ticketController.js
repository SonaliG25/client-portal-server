import Ticket from "../models/ticketSchema.js"; // Import Ticket model
import mongoose from "mongoose";

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, client, attachments } = req.body;

    const newTicket = new Ticket({
      title,
      description,
      priority,
      client,
      attachments,
    });

    await newTicket.save();
    res.status(201).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating ticket", error });
  }
};

// Get all tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    // .populate("client")
    // .populate("assignedTo"); // Populate client and assignedTo with user data
    res.status(200).json(tickets);
  } catch (error) {
    res.status(400).json({ message: "Error fetching tickets", error });
  }
};

// Get a ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId)
      .populate("client")
      .populate("assignedTo");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({ message: "Error fetching ticket", error });
  }
};

// Update a ticket
export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const updatedData = req.body;

    const ticket = await Ticket.findByIdAndUpdate(ticketId, updatedData, {
      new: true, // Return updated ticket
    })
      .populate("client")
      .populate("assignedTo");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating ticket", error });
  }
};

// Delete a ticket
export const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findByIdAndDelete(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting ticket", error });
  }
};

// Search tickets by various fields
export const searchTickets = async (req, res) => {
  try {
    const { title, priority, status, client, assignedTo, fromDate, toDate } =
      req.query;

    let filter = {};

    if (title) filter.title = { $regex: title, $options: "i" }; // Case-insensitive search by title
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (client) filter.client = mongoose.Types.ObjectId(client);
    if (assignedTo) filter.assignedTo = mongoose.Types.ObjectId(assignedTo);
    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    } else if (fromDate) {
      filter.createdAt = { $gte: new Date(fromDate) };
    } else if (toDate) {
      filter.createdAt = { $lte: new Date(toDate) };
    }

    const tickets = await Ticket.find(filter)
      .populate("client")
      .populate("assignedTo");

    res.status(200).json(tickets);
  } catch (error) {
    res.status(400).json({ message: "Error searching tickets", error });
  }
};

export const getTicketsByClientId = async (req, res) => {
  try {
    const { clientId, page = 1, limit = 10 } = req.query; // Page and limit for pagination

    // Validate clientId to avoid CastError
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }

    const skip = (page - 1) * limit;

    const tickets = await Ticket.find({ client: clientId })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: 1 });

    const totalTickets = await Ticket.countDocuments({ client: clientId });
    const totalPages = Math.ceil(totalTickets / limit);

    res.status(200).json({
      tickets,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error fetching tickets", error });
  }
};
