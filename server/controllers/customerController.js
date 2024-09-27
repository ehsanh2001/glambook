const { Customer } = require("../models");

async function getCustomersById(req, res) {
  try {
    const customers = await Customer.findOne({ user_id: req.params.userId });
    res.json(customers);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function createOrUpdateCustomer(req, res) {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Customer not Authorized" });
  }
  try {
    // if no location is provided, use the default location
    if (!req.body.location) {
      req.body.location = {
        type: "Point",
        coordinates: [0, 0],
      };
    }
    // find and update the customer if it exists, otherwise create a new one
    const data = { ...req.body, user_id: req.params.userId };
    const customer = await Customer.findOneAndUpdate(
      { user_id: req.params.userId },
      data,
      { new: true, upsert: true }
    );
    res.json(customer);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

async function deleteCustomer(req, res) {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Customer not Authorized" });
  }
  try {
    const customer = await Customer.findOneAndDelete({
      user_id: req.params.userId,
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = {
  getCustomersById,
  createOrUpdateCustomer,
  deleteCustomer,
};
