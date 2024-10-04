const { User, Business } = require("../models");

async function getStaffByUserId(req, res) {
  const { userId } = req.params;
  try {
    const staffUser = await User.findById(userId);
    const [ownerUsername, staffName] = staffUser.username.split("/");

    const ownerUser = await User.findOne({ username: ownerUsername });

    const business = await Business.findOne({ owner: ownerUser._id });

    const staff = business.staff.find((staff) => staff.staffName === staffName);

    res.json({
      staff,
      startTime: business.openingHours.openingTime,
      endTime: business.openingHours.closingTime,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function updateStaff(req, res) {
  const { staffId } = req.params;

  try {
    const staff = await Business.findOneAndUpdate(
      { "staff._id": staffId },
      {
        $set: {
          "staff.$.staffName": req.body.staffName,
          "staff.$.staffImageFileName": req.body.staffImageFileName,
          "staff.$.workingHours": req.body.workingHours,
          "staff.$.exceptionOnLeaveDateTime": req.body.exceptionOnLeaveDateTime,
        },
      },
      { new: true }
    );

    res.json(staff);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = {
  getStaffByUserId,
};
