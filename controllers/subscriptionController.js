import mongoose from "mongoose";
import Subscription from "../models/subscriptionModel.js"; // Import the Subscription model

// CREATE Subscription
export const createSubscription = async (req, res) => {
  try {
    const newSubscription = new Subscription(req.body);
    await newSubscription.save();
    return res.status(201).json(newSubscription);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// READ (Get All Subscriptions)
export const getSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const searchQuery = search
      ? {
          $or: [
            { isActive: { $regex: search, $options: "i" } },
            { "customer.name": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Fetch subscriptions with search query, pagination, and sorting
    const subscriptions = await Subscription.find(searchQuery)
      .populate("customer")
      .populate("proposalId")
      .populate({
        path: "products.productId", // populate productId inside products array
        model: "Product", // the model name of the referenced product
      })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .exec();

    // Count the total number of subscriptions matching the query
    const totalSubscriptions = await Subscription.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: subscriptions,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalSubscriptions / limitNumber),
      totalSubscriptions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// READ (Get a Single Subscription)
export const getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate("customer")
      .populate("products.productId")
      .exec();
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });
    return res.status(200).json(subscription);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// // READ (Get  Subscription by customer field)
// export const getSubscriptionsByUser = async (req, res) => {
//   try {
//     const userId = req.user.userId ;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID not found in request" });
//     }

//     console.log("User ID:", userId);

//     // Find subscriptions based on customer userId
//     const subscriptions = await Subscription.find({ customer: userId }).exec();

//     // Check if there are no subscriptions found
//     if (!subscriptions || subscriptions.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No subscriptions found for this user" });
//     }

//     return res.status(200).json(subscriptions);
//   } catch (error) {
//     console.error("Error fetching subscriptions:", error); // Log full error for debugging
//     return res.status(500).json({ error: error.message });
//   }
// };
// Get all proposals
export const getSubscriptionsByUser = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.user.userId; // Assuming req.user.userId is the user ID

    // Construct the query to filter subscriptions by the user ID
    const query = { customer: userId };

    // Find subscriptions matching the query
    const subscriptions = await Subscription.find(query).populate("customer");

    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Error fetching subscriptions" });
  }
};

// UPDATE Subscription
export const updateSubscription = async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedSubscription)
      return res.status(404).json({ message: "Subscription not found" });
    return res.status(200).json(updatedSubscription);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE Subscription
export const deleteSubscription = async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSubscription)
      return res.status(404).json({ message: "Subscription not found" });
    return res
      .status(200)
      .json({ message: "Subscription deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//addMonthlyPayment
export const addMonthlyPayment = async (subscriptionId, paymentData) => {
  try {
    await Subscription.findByIdAndUpdate(subscriptionId, {
      $push: { paymentHistory: paymentData },
    });
  } catch (error) {
    console.error("Error adding monthly payment:", error);
  }
};
