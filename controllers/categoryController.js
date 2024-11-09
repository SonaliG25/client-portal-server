// controllers/categoryController.js
import Category from "../models/categoryModel.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getCategories = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || null; // Page number, null if not provided
    const limit = parseInt(req.query.limit) || null; // Items per page, null if not provided
    const search = req.query.search ? req.query.search.toLowerCase() : ""; // Search term, empty if not provided
    const sort = req.query.sort ? req.query.sort : "name"; // Sort by field, default is "name"

    // Construct the search query if search term is provided
    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } } // Case-insensitive search
      : {}; // Empty query object if no search term

    // Get all categories without pagination if page and limit are not provided
    if (!page && !limit) {
      const categories = await Category.find(searchQuery).sort(sort ? { [sort]: 1 } : {});
      return res.json({
        categories,
        totalCategories: categories.length,
      });
    }

    // Apply pagination and sorting if page or limit is specified
    const totalCategories = await Category.countDocuments(searchQuery); // Total categories matching search
    const totalPages = Math.ceil(totalCategories / (limit || totalCategories)); // Total pages, defaults to 1 if no limit

    const categories = await Category.find(searchQuery)
      .sort({ [sort]: 1 })
      .skip((page - 1) * (limit || totalCategories)) // Skip items based on page and limit
      .limit(limit || totalCategories); // Limit number of items per page if limit is provided

    // Respond with categories based on the applied criteria
    res.json({
      categories,
      totalCategories,
      totalPages,
      currentPage: page || 1, // Default to page 1 if pagination not provided
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    toast.error("Unable to delete category");
    res.status(500).json({ error: error.message });
  }
};
