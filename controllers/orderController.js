import Order from "../models/orderModel.js"; // Import the Order model

// CREATE Order
export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// READ (Get All Orders)
export const getOrders = async (req, res) => {
  try {
   
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const searchQuery = search
      ? {
          $or: [
            { "customer.name": { $regex: search, $options: "i" } }, 
            { orderStatus: { $regex: search, $options: "i" } }, 
            { "products.name": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    
    const orders = await Order.find(searchQuery)
      .populate("customer") 
      .skip((pageNumber - 1) * limitNumber) 
      .limit(limitNumber) 
      .sort({ createdAt: -1 }) 
      .exec()
   
    const totalOrders = await Order.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: orders,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalOrders / limitNumber),
      totalOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// READ (Get a Single Order)
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .exec();
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// UPDATE Order
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE Order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
