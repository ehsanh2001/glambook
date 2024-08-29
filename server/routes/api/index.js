const router = require("express").Router();
const businessRoutes = require("./businessRoutes");
const typeAndServicesRoutes = require("./typeAndServicesRoutes");

// Matches with "/api"
router.use("/business", businessRoutes);
router.use("/typeAndServices", typeAndServicesRoutes);

module.exports = router;
