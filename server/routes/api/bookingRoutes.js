const router = require("express").Router();
const bookingController = require("../../controllers/bookingController");
const freetimeController = require("../../controllers/freeTimeController");
const jwtAuthMiddleware = require("../../utils/jwtAuthMiddleware");

// Matches with "/api/booking"

router.route("/").post(jwtAuthMiddleware, bookingController.createBooking);

router
  .route("/staff")
  .post(jwtAuthMiddleware, bookingController.getBookingsForStaff);

router
  .route("/business-freetime")
  .post(freetimeController.getBusinessFreeTimesForService);

router
  .route("/staff-freetime")
  .post(freetimeController.getStaffFreeTimesForService);

router
  .route("/customer/:id")
  .get(jwtAuthMiddleware, bookingController.getBookingsForCustomer);

router.route("/:id").delete(jwtAuthMiddleware, bookingController.deleteBooking);

module.exports = router;
