const { Booking, Business } = require("../../models");

async function getStaffFreeTimesForService(req, res) {
  // get the business_id, staff_id, date, service_id from the request body
  const { business_id, staff_id, date, service_id } = req.body;
  if (!business_id || !staff_id || !date || !service_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // get requires data from the database
    const bookings = await getBookings(business_id, staff_id, date);
    const business = await getBusiness(business_id);
    // find the staff
    const staff = business.staff.find(
      (staff) => staff._id.toString() === staff_id
    );
    // find the service
    const service = business.services.find(
      (service) => service._id.toString() === service_id
    );

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
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

async function getBusiness(business_id) {
  try {
    const business = await Business.findById(business_id);
    if (!business) {
      throw new Error("Business not found");
    }
    return business;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

async function getBookings(business_id, staff_id, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59
  try {
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
    console.log(error);
    throw new Error(error.message);
  }
}

function calcStaffFreeTimesForServiceDate(
  service,
  date,
  bookings,
  business,
  staff
) {
  // staff working hours has 1 hour slots, for free time we want 15-min slots
  const timeSlots = 4 * staff.workingHours["Monday"].length;
  const freeTimes = Array(timeSlots).fill(false);

  setWorkingTimes(staff, date, freeTimes);

  const openingTime = business.openingHours.openingTime.split(":")[0];
  unsetBookedTimes(bookings, openingTime, business.services, freeTimes);
  // check if the free times are enough for the service duration
  unsetShortTimes(service, freeTimes);

  // unset business closure times
  unsetClosureTimes(business.exceptionalClosures, openingTime, date, freeTimes);

  // unset staff exception on leave times
  unsetClosureTimes(
    staff.exceptionOnLeaveDateTime,
    openingTime,
    date,
    freeTimes
  );

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
// if the free times are not enough for the service duration
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
function unsetBookedTimes(bookings, openingTime, allServices, freeTimes) {
  for (const booking of bookings) {
    const hour = booking.booking_datetime.getHours();
    const minute = booking.booking_datetime.getMinutes();
    const index = (hour - openingTime) * 4 + Math.ceil(minute / 15);

    const serviceDuration = allServices.find(
      (service) => service._id.toString() === booking.service.toString()
    )?.duration;
    if (serviceDuration) {
      const serviceSlots = Math.ceil(serviceDuration / 15);
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
// set the working times of the staff to true in the freeTimes array
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
