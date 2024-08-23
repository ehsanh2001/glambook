const router = require("express").Router();
const businessRoutes = require("./businessRoutes");

// Matches with "/api
router.use("/business", businessRoutes);

module.exports = router;
