const router = require("express").Router();
const staffController = require("../../controllers/staffController");
// Matches with "/api/staff"

router.route("/:userId").get(staffController.getStaffByUserId);

module.exports = router;
