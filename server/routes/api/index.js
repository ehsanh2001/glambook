const router = require("express").Router();
const businessRoutes = require("./businessRoutes");
const typeAndServicesRoutes = require("./typeAndServicesRoutes");
const imageRoutes = require("./imageRoutes");

// Matches with "/api"
router.use("/business", businessRoutes);
router.use("/typeAndServices", typeAndServicesRoutes);
router.use("/image", imageRoutes);

module.exports = router;
