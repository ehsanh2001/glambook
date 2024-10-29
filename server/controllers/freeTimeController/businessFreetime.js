const { get } = require("mongoose");
const { Booking, Business } = require("../../models");
const {
  calcStaffFreeTimesForServiceDate,
  getBookings,
} = require("./staffFreetime");

// Get free times for a business for a specific service on a specific date
// POST /api/booking/business-freetime
// Public access
// Request body: { business_id, date, service_id }
// Response: { message, freeTimes }
async function getBusinessFreeTimesForService(req, res) {
  const { business_id, date, service_id } = req.body;
  // Validate the request body
  if (!business_id || !date || !service_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  //Check if the IDs are valid MongoDB ObjectIDs
  if (
    !mongoose.Types.ObjectId.isValid(business_id) ||
    !mongoose.Types.ObjectId.isValid(service_id)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid business/service ID format" });
  }

  try {
    // Find the business by ID
    const business = await Business.findById(business_id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find the service by ID
    const service = business.services.find(
      (service) => service._id.toString() === service_id
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Calculate the free times for the business for the given service and date
    const freeTimes = await calBusinessFreeTimesForService(
      business,
      date,
      service
    );

    // Return the calculated free times
    res
      .status(200)
      .json({ message: "Free times calculated successfully", freeTimes });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
}

// Helper function
// Calculate the free times for a business for a specific service on a specific date
async function calBusinessFreeTimesForService(business, date, service) {
  // business openingHours has 1 hour slots, for free time we want 15-min slots
  const timeSlots = 4 * business.openingHours["Monday"].length;
  const freeTimes = Array(timeSlots).fill(false);

  // for each staff, get their free times for the service
  for (const staff of business.staff) {
    // get bookings for the staff for the given date
    const bookings = await getBookings(business._id, staff._id, date);
    // calculate the free times for the staff for the given service and date
    const staffFreeTimes = calcStaffFreeTimesForServiceDate(
      service,
      date,
      bookings,
      business,
      staff
    );
    // business free times is the union of all staff free times
    for (let i = 0; i < timeSlots; i++) {
      freeTimes[i] = freeTimes[i] || staffFreeTimes[i];
    }
  }

  return freeTimes;
}

module.exports = {
  getBusinessFreeTimesForService,
};
