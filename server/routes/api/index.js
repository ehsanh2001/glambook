const router = require("express").Router();
const businessRoutes = require("./businessRoutes");
const typeAndServicesRoutes = require("./typeAndServicesRoutes");
const imageRoutes = require("./imageRoutes");
const userRoutes = require("./userRoutes");

// Matches with "/api"
router.use("/business", businessRoutes);
router.use("/typeAndServices", typeAndServicesRoutes);
router.use("/image", imageRoutes);
router.use("/user", userRoutes);

module.exports = router;
