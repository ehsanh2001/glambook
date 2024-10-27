const { Customer } = require("../models");
const mongoose = require("mongoose");

// Get a customer by user id
// GET /api/customer/:userId
// Needs to be authenticated with a customer role
// Required fields: userId
// Returns the customer

async function getCustomersByUserId(req, res) {
  // Check if the user is a customer
  if (req.user.role !== "customer") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }

  // Check if the user id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    // find the customer by user id
    const customer = await Customer.findOne({ user_id: req.params.userId });

    // if the customer does not exist, return an error
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    // return the customer
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create or update a customer
// POST /api/customer/:userId
// Needs to be authenticated with a customer role
// Required fields: userId(path param), customerName
// Optional fields: phone, address, location
// Returns the customer

async function createOrUpdateCustomer(req, res) {
  // Check if the user is a customer
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Customer not Authorized" });
  }
  // check if the user id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // check if the required fields are provided
  if (!req.body.customerName) {
    return res.status(400).json({ message: "Customer name is required" });
  }

  // check if the user id in the path param matches the JWT user id
  if (req.user.user_id !== req.params.userId) {
    return res.status(403).json({ message: "User not authorized" });
  }

  // if no location is provided, use the default location
  if (!req.body.location) {
    req.body.location = {
      type: "Point",
      coordinates: [0, 0],
    };
  }

  try {
    // find and update the customer if it exists, otherwise create a new one
    const data = { ...req.body, user_id: req.params.userId };
    const customer = await Customer.findOneAndUpdate(
      { user_id: req.params.userId },
      data,
      { new: true, upsert: true }
    );

    // return the customer
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a customer
// DELETE /api/customer/:userId
// Needs to be authenticated with a customer role
// Required fields: userId
// Returns the deleted customer
async function deleteCustomer(req, res) {
  if (req.user.role !== "customer") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }

  // Check if the user id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Check if the user id in the path param matches the JWT user id
  if (req.user.user_id !== req.params.userId) {
    return res.status(403).json({ message: "User not authorized" });
  }

  // Delete the customer
  try {
    const customer = await Customer.findOneAndDelete({
      user_id: req.params.userId,
    });

    // return the deleted customer
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getCustomersByUserId,
  createOrUpdateCustomer,
  deleteCustomer,
};
