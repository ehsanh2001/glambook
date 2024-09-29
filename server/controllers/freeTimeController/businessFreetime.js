const { get } = require("mongoose");
const { Booking, Business } = require("../../models");
const {
  calcStaffFreeTimesForServiceDate,
  getBookings,
} = require("./staffFreetime");
// getBusinessFreeTimes is a controller function that calculates the free times for a business on a given date for a given service

async function getBusinessFreeTimesForService(req, res) {
  const { business_id, date, service_id } = req.body;
  try {
    const business = await Business.findById(business_id);
    const service = business.services.find(
      (service) => service._id.toString() === service_id
    );
    const freeTimes = await calBusinessFreeTimesForService(
      business,
      date,
      service
    );

    res
      .status(200)
      .json({ message: "Free times calculated successfully", freeTimes });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

async function calBusinessFreeTimesForService(business, date, service) {
  // business openingHours has 1 hour slots, for free time we want 15-min slots
  const timeSlots = 4 * business.openingHours["Monday"].length;
  const freeTimes = Array(timeSlots).fill(false);

  // for each staff, get their free times for the service
  for (const staff of business.staff) {
    const bookings = await getBookings(business._id, staff._id, date);
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
