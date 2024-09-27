const router = require("express").Router();
const bookingController = require("../../controllers/bookingController");
const jwtAuthMiddleware = require("../../utils/jwtAuthMiddleware");

// Matches with "/api/booking"
router.route("/").post(jwtAuthMiddleware, bookingController.createBooking);
router
  .route("/staff")
  .post(jwtAuthMiddleware, bookingController.getBookingsForStaff);
router
  .route("/customer")
  .post(jwtAuthMiddleware, bookingController.getBookingsForCustomer);

module.exports = router;
