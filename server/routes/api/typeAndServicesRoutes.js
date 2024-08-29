const router = require("express").Router();
const typeAndServicesController = require("../../controllers/typeAndServicesController");

// Matches with "/api/typeAndServices"
router.route("/").get(typeAndServicesController.getTypeAndServices);

// Matches with "/api/typeAndServices/:businessType"
router.route("/:businessType").get(typeAndServicesController.getServicesByType);

module.exports = router;
