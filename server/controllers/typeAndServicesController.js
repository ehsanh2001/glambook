const { TypeAndServices } = require("../models");

// Get all business types and services
// GET /api/typeAndServices
async function getTypeAndServices(req, res) {
  try {
    const typeAndServicesData = await TypeAndServices.find({});
    res.json(typeAndServicesData);
  } catch (err) {
    console.log("Error\n", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get services based on business type
// GET /api/typeAndServices/:businessType
async function getServicesByType(req, res) {
  try {
    const typeAndServicesData = await TypeAndServices.find({
      businessType: new RegExp(req.params.businessType, "i"),
    });
    res.json(typeAndServicesData);
  } catch (err) {
    console.log("Error\n", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getTypeAndServices,
  getServicesByType,
};
