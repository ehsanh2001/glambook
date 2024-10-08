const router = require("express").Router();
const businessRoutes = require("./businessRoutes");
const typeAndServicesRoutes = require("./typeAndServicesRoutes");
const imageRoutes = require("./imageRoutes");
const userRoutes = require("./userRoutes");
const customerRoutes = require("./customerRoutes");
const bookingRoutes = require("./bookingRoutes");
const staffRoutes = require("./staffRoutes");
const searchRoutes = require("./searchRoutes");

// Matches with "/api"
router.use("/business", businessRoutes);
router.use("/typeAndServices", typeAndServicesRoutes);
router.use("/image", imageRoutes);
router.use("/user", userRoutes);
router.use("/customer", customerRoutes);
router.use("/booking", bookingRoutes);
router.use("/staff", staffRoutes);
router.use("/search", searchRoutes);

module.exports = router;
