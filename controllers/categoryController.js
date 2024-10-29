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
// export const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page (default is 1)
    const limit = parseInt(req.query.limit) || 5; // Items per page (default is 10)
    const search = req.query.search ? req.query.search.toLowerCase() : ""; // Search term

    // Construct the search query
    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } } // Case-insensitive search
      : {}; // No search if not provided

    // Retrieve all matching categories based on the search criteria
    const allCategories = await Category.find(searchQuery);

    // Calculate total categories and total pages
    const totalCategories = allCategories.length;
    const totalPages = Math.ceil(totalCategories / limit); // Calculate total pages

    // Calculate start and end index for the current page
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get categories for the current page
    const categories = allCategories.slice(startIndex, endIndex);

    // Respond with paginated and filtered categories
    res.json({
      categories,
      totalCategories,
      totalPages,
      currentPage: page,
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
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
