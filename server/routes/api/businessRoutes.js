const router = require("express").Router();
const businessController = require("../../controllers/businessController");

// Matches with "/api/business"
router.route("/").get(businessController.test);

module.exports = router;
