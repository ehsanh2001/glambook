const { Business } = require("../models");

async function getBusinesses(req, res) {
  try {
    const businesses = await Business.find({});
    res.json(businesses);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getBusinessById(req, res) {
  try {
    const business = await Business.findById(req.params.id);
    res.json(business);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function createBusiness(req, res) {
  try {
    const business = await Business.create(req.body);
    res.json(business);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

async function updateBusiness(req, res) {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(business);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function deleteBusiness(req, res) {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    res.json(business);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getBusinessesByType(req, res) {
  try {
    const businesses = await Business.find({ businessType: req.params.type });
    res.json(businesses);
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getBusinessesByType,
};
