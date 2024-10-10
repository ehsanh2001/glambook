const { Business, User } = require("../models");

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

    await _addRemoveStaffAccount(req.body);

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

// This function is used to add or remove staff accounts when a business owner updates the staff list
async function _addRemoveStaffAccount(newBusiness) {
  const USERNAME_DELIMITER = "/";
  try {
    const oldBusiness = await Business.findOne({ owner: newBusiness.owner });

    const owner = await User.findById(newBusiness.owner);
    const ownerUserName = owner.username;

    const staffToRemove = !oldBusiness
      ? []
      : oldBusiness.staff.filter(
          (staff) =>
            !newBusiness.staff.find(
              (newStaff) => newStaff.staffName === staff.staffName
            )
        );
    const staffToAdd = !oldBusiness
      ? newBusiness.staff
      : newBusiness.staff.filter(
          (staff) =>
            !oldBusiness.staff.find(
              (oldStaff) => oldStaff.staffName === staff.staffName
            )
        );

    for (const staff of staffToRemove) {
      await User.findOneAndDelete({
        username: `${ownerUserName}${USERNAME_DELIMITER}${staff.staffName}`,
      });
    }

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
