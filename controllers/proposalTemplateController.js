import ProposalTemplate from "../models/proposalTemplateModel.js";

// Create a new proposal template
export const createProposalTemplate = async (req, res) => {
  try {
    const newTemplate = new ProposalTemplate(req.body);
    await newTemplate.save();
    res.status(201).json({
      message: "Proposal template created successfully",
      template: newTemplate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating template", error });
  }
};

// Get all templates
export const getAllTemplates = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  try {
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },

      ],
    };

    const totalTemplates = await ProposalTemplate.countDocuments(query);
    const templates = await ProposalTemplate.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.json({
      totalPages: Math.ceil(totalTemplates / limit),
      currentPage: page,
      templates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific template by ID
export const getTemplateById = async (req, res) => {
  try {
    const template = await ProposalTemplate.findById(req.params.templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: "Error fetching template", error });
  }
};

// Update a proposal template
export const updateProposalTemplate = async (req, res) => {
  try {
    const updatedTemplate = await ProposalTemplate.findByIdAndUpdate(
      req.params.templateId,
      req.body,
      { new: true }
    );
    if (!updatedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json({
      message: "Template updated successfully",
      template: updatedTemplate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating template", error });
  }
};

// Delete Proposal Template Controller
export const deleteProposalTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the proposal template by ID
    const deletedTemplate = await ProposalTemplate.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return res.status(404).json({ message: "Proposal Template not found" });
    }

    res.status(200).json({ message: "Proposal Template deleted successfully" });
  } catch (error) {
    console.error("Error deleting proposal template:", error);
    res.status(500).json({ message: "Failed to delete proposal template" });
  }
};
