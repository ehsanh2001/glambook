const { TypeAndServices } = require("../models");

async function getTypeAndServices(req, res) {
  try {
    const typeAndServicesData = await TypeAndServices.find({});
    res.json(typeAndServicesData);
  } catch (err) {
    console.log("Error\n", err);
    res.status(400).json(err);
  }
}

async function getServicesByType(req, res) {
  try {
    const typeAndServicesData = await TypeAndServices.find({
      businessType: new RegExp(req.params.businessType, "i"),
    });
    res.json(typeAndServicesData);
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports = {
  getTypeAndServices,
  getServicesByType,
};
