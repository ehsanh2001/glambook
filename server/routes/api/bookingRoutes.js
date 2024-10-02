const router = require("express").Router();
const bookingController = require("../../controllers/bookingController");
const freetimeController = require("../../controllers/freeTimeController");
const jwtAuthMiddleware = require("../../utils/jwtAuthMiddleware");

// Matches with "/api/booking"
router.route("/").post(bookingController.createBooking);
router
  .route("/staff")
  .post(jwtAuthMiddleware, bookingController.getBookingsForStaff);
router
  .route("/customer")
  .post(jwtAuthMiddleware, bookingController.getBookingsForCustomer);

router
  .route("/business-freetime")
  .post(freetimeController.getBusinessFreeTimesForService);

router
  .route("/staff-freetime")
  .post(freetimeController.getStaffFreeTimesForService);

router
  .route("/customer/:id/bookings")
  .get(bookingController.getBookingsForCustomer);

module.exports = router;
