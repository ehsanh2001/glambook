const { Booking, Business } = require("../../models");
const mongoose = require("mongoose");

// Get the free times for a staff for a service on a date
// POST /api/booking/staff-freetime
// Public access
// Request body: { business_id, staff_id, date, service_id }
// Response: { freeTimes, service }
async function getStaffFreeTimesForService(req, res) {
  const { business_id, staff_id, date, service_id } = req.body;
  // check if the required fields are provided
  if (!business_id || !staff_id || !date || !service_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // check if the IDs are valid
  if (
    !mongoose.Types.ObjectId.isValid(business_id) ||
    !mongoose.Types.ObjectId.isValid(staff_id) ||
    !mongoose.Types.ObjectId.isValid(service_id)
  ) {
    console.log("Invalid ID format");
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // check if the date is valid
  if (isNaN(Date.parse(date))) {
    console.log("Invalid date format");
    return res.status(400).json({ message: "Invalid date format" });
  }

  // Calculate the free times for the staff for the service on the date
  try {
    // get the bookings for the staff on the date
    const bookings = await getBookings(business_id, staff_id, date);

    // find the business
    const business = await Business.findById(business_id);
    if (!business) {
      console.log("Business not found");
      return res.status(400).json({ message: "Business not found" });
    }

    // find the staff
    const staff = business.staff.find(
      (staff) => staff._id.toString() === staff_id
    );
    if (!staff) {
      console.log("Staff not found");
      return res.status(400).json({ message: "Staff not found" });
    }

    // find the service
    const service = business.services.find(
      (service) => service._id.toString() === service_id
    );
    if (!service) {
      return res.status(400).json({ message: "Service not found" });
    }

    // get the free times for the staff for the service on the date
    const freeTimes = calcStaffFreeTimesForServiceDate(
      service,
      date,
      bookings,
      business,
      staff
    );

    // return the free times and the service
    return res.status(200).json({ freeTimes, service });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// Helper function
// Get the bookings for a staff on a date
async function getBookings(business_id, staff_id, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

  try {
    // find the bookings for the staff on the date
    const bookings = await Booking.find({
      business: business_id,
      staff: staff_id,
      booking_datetime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    return bookings;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Helper function
function calcStaffFreeTimesForServiceDate(
  service,
  date,
  bookings,
  business,
  staff
) {
  // staff workingHours has 1 hour slots, for free time we want 15-min slots
  const timeSlots = 4 * staff.workingHours["Monday"].length;
  const freeTimes = Array(timeSlots).fill(false);

  // set the working times of the staff to true in the freeTimes array
  setWorkingTimes(staff, date, freeTimes);

  // unset the booked times of the staff in the freeTimes array
  const openingTime = business.openingHours.openingTime.split(":")[0];
  unsetBookedTimes(bookings, openingTime, business.services, freeTimes);

  // unset business closure times
  unsetClosureTimes(business.exceptionalClosures, openingTime, date, freeTimes);

  // unset staff exception on leave times
  unsetClosureTimes(
    staff.exceptionOnLeaveDateTime,
    openingTime,
    date,
    freeTimes
  );

  // unset the short times(based on service.duration) in the freeTimes array
  unsetShortTimes(service, freeTimes);

  // if date in today, unset past times
  const now = new Date();
  if (
    now.getFullYear() === new Date(date).getFullYear() &&
    now.getMonth() === new Date(date).getMonth() &&
    now.getDate() === new Date(date).getDate()
  ) {
    unsetPastTimes(freeTimes, openingTime);
  }

  return freeTimes;
}

// Helper function
// unset the past times in the freeTimes array
function unsetPastTimes(freeTimes, openingTime) {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const index = (hour - openingTime) * 4 + Math.ceil(minute / 15);

  for (let i = 0; i < index; i++) {
    freeTimes[i] = false;
  }
}

// Helper function
// if the continuous free times are not long enough for the service duration
// unset the short times in the freeTimes array
function unsetShortTimes(service, freeTimes) {
  const serviceSlots = Math.ceil(service.duration / 15);
  for (let i = 0; i < freeTimes.length - serviceSlots; i++) {
    if (!freeTimes.slice(i, i + serviceSlots).every((slot) => slot)) {
      freeTimes[i] = false;
    }
  }
}

// Helper function
// unset the booked times of the staff in the freeTimes array
// Parameters:
//    bookings is an array of booking objects
//      booking object: { booking_datetime, service }
//    openingTime is the business opening time in hours (e.g. 9)
//    allServices is an array of all services in the business (each service has a duration)
//    freeTimes is an array of boolean values representing the free times of the staff
function unsetBookedTimes(bookings, openingTime, allServices, freeTimes) {
  for (const booking of bookings) {
    const hour = booking.booking_datetime.getHours();
    const minute = booking.booking_datetime.getMinutes();
    // The freeTime array index 0 is for the business openingTime
    // The freeTime array index 1 is for the business openingTime + 15 minutes
    const index = (hour - openingTime) * 4 + Math.ceil(minute / 15);

    const serviceDuration = allServices.find(
      (service) => service._id.toString() === booking.service.toString()
    )?.duration;

    if (serviceDuration) {
      // calculate the number of slots the service takes
      const serviceSlots = Math.ceil(serviceDuration / 15);
      // set the slots to false in the freeTimes array
      for (let i = 0; i < serviceSlots; i++) {
        freeTimes[index + i] = false;
      }
    }
  }
}

// Helper function
// unset closure times in the freeTimes array
function unsetClosureTimes(closureTimes, businessOpeningTime, date, freeTimes) {
  const dateObj = new Date(date);
  const todayClosures = closureTimes.filter(
    (closure) =>
      closure.date.getYear() === dateObj.getYear() &&
      closure.date.getMonth() === dateObj.getMonth() &&
      closure.date.getDate() === dateObj.getDate()
  );

  for (const closure of todayClosures) {
    const startHour = closure.startTime.getHours();
    const startMinute = closure.startTime.getMinutes();
    const endHour = closure.endTime.getHours();
    const endMinute = closure.endTime.getMinutes();
    const startIndex =
      (startHour - businessOpeningTime) * 4 + Math.ceil(startMinute / 15);
    const endIndex =
      (endHour - businessOpeningTime) * 4 + Math.ceil(endMinute / 15);

    for (let i = startIndex; i < endIndex; i++) {
      freeTimes[i] = false;
    }
  }
}

// Helper function
// Set the working times of the staff to true in the freeTimes array
function setWorkingTimes(staff, date, freeTimes) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekday = weekdays[new Date(date).getDay()];

  // iterate over the workingHours for the weekday of the staff and mark the available slots
  for (let i = 0; i < staff.workingHours[weekday].length; i++) {
    if (staff.workingHours[weekday][i]) {
      // each staff is available for 4 15-min time slots
      freeTimes[i * 4] =
        freeTimes[i * 4 + 1] =
        freeTimes[i * 4 + 2] =
        freeTimes[i * 4 + 3] =
          true;
    }
  }
}

module.exports = {
  getStaffFreeTimesForService,
  getBookings,
  calcStaffFreeTimesForServiceDate,
};
