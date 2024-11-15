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
    const { page = 1, limit = 5, search = "", startDate, endDate } = req.query;

    // Define the search criteria
    const searchCriteria = {
      $and: [
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
            { priority: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };

    // Add date range filter if startDate or endDate is provided
    if (startDate || endDate) {
      searchCriteria.$and.push({
        createdAt: {
          ...(startDate ? { $gte: new Date(startDate) } : {}),
          ...(endDate ? { $lte: new Date(endDate) } : {}),
        },
      });
    }

    let tickets;
    let totalTickets;

    if (req.user.role === "admin") {
      // Admin can see all tickets with search and pagination
      totalTickets = await Ticket.countDocuments(searchCriteria);
      tickets = await Ticket.find(searchCriteria)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    } else {
      // Regular user (client) can see only their tickets with search and pagination
      const clientCriteria = {
        "client.user": req.user.userId,
        ...searchCriteria,
      };
      totalTickets = await Ticket.countDocuments(clientCriteria);
      tickets = await Ticket.find(clientCriteria)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    }

    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }

    res.status(200).json({
      tickets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTickets / limit),
      totalTickets,
    });
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

export const addCommentToTicket = async (req, res) => {
  try {
    const { id } = req.params; // Retrieve the ticket ID from the route
    const { userId, name, email, message } = req.body;

    // Find the ticket by ID
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Add the new comment
    const newComment = {
      user: { userId, name, email },
      message,
    };

    ticket.comments.push(newComment);

    // Save the ticket with the new comment
    await ticket.save();

    res.status(200).json({
      message: "Comment added successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};
export const addResolutionToTicket = async (req, res) => {
  try {
    const { id } = req.params; // Retrieve the ticket ID from the route
    const { resolutionNotes } = req.body;

    // Find the ticket by ID
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Update the resolution field with the new resolutionNotes
    ticket.resolutionNotes = resolutionNotes;

    // Save the ticket with the updated resolution
    await ticket.save();
    console.log("Request Body ticket", ticket);

    res.status(200).json({
      message: "Resolution added successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding resolution", error });
  }
};
