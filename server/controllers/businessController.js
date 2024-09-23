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

async function getBusinessByOwnerId(req, res) {
  try {
    const business = await Business.findOne({ owner: req.params.id });
    res.json(business);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function createOrUpdateBusiness(req, res) {
  try {
    if (req.user.role !== "owner") {
      return res.status(400).json({ message: "Owner is required" });
    }
    const business = await Business.findOneAndUpdate(
      { owner: req.body.owner },
      req.body,
      { new: true, upsert: true }
    );
    res.json(business);
  } catch (error) {
    console.log(error);
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
  getBusinessByOwnerId,
  createOrUpdateBusiness,
  deleteBusiness,
  getBusinessesByType,
};
