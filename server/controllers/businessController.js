const { Business, User } = require("../models");
const mongoose = require("mongoose");

async function getBusinesses(req, res) {
  try {
    const businesses = await Business.find({});
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
}

async function getBusinessById(req, res) {
  try {
    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid business ID format");
      return res.status(400).json({ message: "Invalid business ID format" });
    }

    // Attempt to find the business by ID
    const business = await Business.findById(req.params.id);

    // Check if the business was found
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Return the business data if found
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
}

async function getBusinessByOwnerId(req, res) {
  try {
    // validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid owner ID format");
      return res.status(400).json({ message: "Invalid owner ID format" });
    }

    // Attempt to find the business by owner ID
    const business = await Business.findOne({ owner: req.params.id });

    // Check if the business was found
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Return the business data if found
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
}

async function createOrUpdateBusiness(req, res) {
  try {
    if (req.user.role !== "owner") {
      return res
        .status(400)
        .json({ message: "Only the business owner can do this action" });
    }

    await _addRemoveStaffAccount(req.body);

    // Attempt to find and update the business data
    const business = await Business.findOneAndUpdate(
      { owner: req.body.owner },
      req.body,
      { new: true, upsert: true }
    );

    // If successful, return the updated business data
    res.json(business);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

// This function is used to add or remove staff accounts when a business owner updates the staff list
// Each staff should have a username in the format of ownerUsername/staffName
// and a password in the User model
async function _addRemoveStaffAccount(newBusiness) {
  const USERNAME_DELIMITER = "/";
  try {
    const oldBusiness = await Business.findOne({ owner: newBusiness.owner });

    const owner = await User.findById(newBusiness.owner);
    const ownerUserName = owner.username;

    // Find staff to remove
    // If the old business is not found, then there is no staff to remove
    const staffToRemove = !oldBusiness
      ? []
      : oldBusiness.staff.filter(
          (staff) =>
            !newBusiness.staff.find(
              (newStaff) => newStaff.staffName === staff.staffName
            )
        );

    // Find staff to add
    // If the old business is not found, then all staff are new
    const staffToAdd = !oldBusiness
      ? newBusiness.staff
      : newBusiness.staff.filter(
          (staff) =>
            !oldBusiness.staff.find(
              (oldStaff) => oldStaff.staffName === staff.staffName
            )
        );

    // Remove staff accounts that are no longer in the staff list
    for (const staff of staffToRemove) {
      await User.findOneAndDelete({
        username: `${ownerUserName}${USERNAME_DELIMITER}${staff.staffName}`,
      });
    }

    // Add new staff accounts
    for (const staff of staffToAdd) {
      await User.create({
        username: `${ownerUserName}${USERNAME_DELIMITER}${staff.staffName}`,
        password: staff.password,
        role: "staff",
      });
    }
  } catch (error) {
    throw error;
  }
}

async function deleteBusiness(req, res) {
  try {
    // Check if the user is the owner of the business
    if (req.user.role !== "owner" || req.user.user_id !== req.params.id) {
      return res
        .status(400)
        .json({ message: "Only the business owner can do this action" });
    }

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid business ID format");
      return res.status(400).json({ message: "Invalid business ID format" });
    }

    // Attempt to delete the business by ID
    const business = await Business.findByIdAndDelete(req.params.id);

    // Check if the business was found
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Return the deleted business data
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
}

async function getBusinessesByType(req, res) {
  try {
    const businesses = await Business.find({ businessType: req.params.type });

    // Return the businesses that match the type or an empty array if no match
    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
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
