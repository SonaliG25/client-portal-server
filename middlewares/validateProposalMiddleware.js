import { check } from "express-validator";

// Validation for creating or updating a proposal
export const validateProposal = [
  check("recipient").notEmpty().withMessage("Recipient is required"),
  check("emailTo").isEmail().withMessage("Valid email is required"),
  check("title").notEmpty().withMessage("Title is required"),
  check("content").notEmpty().withMessage("Content is required"),
  check("products").isArray().withMessage("Products must be an array"),
  check("products.*.productId")
    .notEmpty()
    .withMessage("Product ID is required"),
  check("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  check("products.*.total")
    .isNumeric()
    .withMessage("Total is required and must be a number"),
  check("products.*.currency")
    .notEmpty()
    .withMessage("Currency is required for each product"),
  check("discountOnGrandTotal")
    .isNumeric()
    .withMessage("Discount on grand total must be a number"),
  check("grandTotal")
    .isNumeric()
    .withMessage("Grand total must be a number"),
  check("grandTotalCurrency")
    .notEmpty()
    .withMessage("Currency for grand total is required"),
];
