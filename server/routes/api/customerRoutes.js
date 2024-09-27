const router = require("express").Router();
const customerController = require("../../controllers/customerController");
const jwtAuthMiddleware = require("../../utils/jwtAuthMiddleware");

// Matches with "/api/customer/:userId"
router
  .route("/:userId")
  .get(jwtAuthMiddleware, customerController.getCustomersById)
  .post(jwtAuthMiddleware, customerController.createOrUpdateCustomer)
  .delete(jwtAuthMiddleware, customerController.deleteCustomer);

module.exports = router;
