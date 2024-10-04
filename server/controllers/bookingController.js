const { Booking, Customer } = require("../models");

async function createBooking(req, res) {
  const { user, business, staff, booking_datetime, service } = req.body;
  if (!user || !business || !staff || !booking_datetime || !service) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    // Check if the staff is available
    const bookings = await Booking.find({
      staff: staff,
      booking_datetime: booking_datetime,
    });
    if (bookings.length > 0) {
      return res.status(400).json({
        error: "Staff is not available at the selected time",
      });
    }

    // get customer id
    const customer = await Customer.findOne({ user_id: user });
    if (!customer) {
      return res.status(400).json({ error: "Customer not found" });
    }

    // save the booking to the database
    const data = { ...req.body, customer: customer._id };
    const booking = await Booking.create(data);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getBookingsForStaff(req, res) {
  if (req.user.role !== "staff") {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action" });
  }

  const { staff, start_date, end_date } = req.body;
  let condition = { staff: staff };
  if (start_date && end_date) {
    condition.booking_datetime = {
      $gte: start_date,
      $lt: end_date,
    };
  }
  try {
    const bookings = await Booking.find(condition)
      .populate("business")
      .populate("customer");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getBookingsForCustomer(req, res) {
  if (req.user && req.user.role !== "customer") {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action" });
  }

  // get the parameter from the request
  const { id } = req.params;
  const { start_date, end_date } = req.query;

  // crearte the condition object
  let condition = { customer: id };
  if (start_date && end_date) {
    condition.booking_datetime = {
      $gte: start_date,
      $lt: end_date,
    };
  }

  // get the bookings from the database
  try {
    const bookings = await Booking.find(condition).populate("business");

    // selected data
    const response = selectResponseAttributes(bookings);

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

function selectResponseAttributes(bookings) {
  const response = [];

  for (let i = 0; i < bookings.length; i++) {
    response.push({
      id: bookings[i]._id,
      booking_datetime: bookings[i].booking_datetime,

      details: {
        businessId: bookings[i].business._id,
        businessName: bookings[i].business.businessName,
        businessImage: bookings[i].business.businessImage,
        address: bookings[i].business.address,
        location: bookings[i].business.location,
        phone: bookings[i].business.phone,
        staffName: bookings[i].business.staff.find(
          (s) => s._id.toString() == bookings[i].staff.toString()
        ).staffName,
        staffImage: bookings[i].business.staff.find(
          (s) => s._id.toString() == bookings[i].staff.toString()
        ).staffImageFileName,
        service: bookings[i].business.services.find(
          (s) => s._id.toString() == bookings[i].service.toString()
        ),
      },
    });
  }
  return response;
}

async function deleteBooking(req, res) {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createBooking,
  getBookingsForStaff,
  getBookingsForCustomer,
  deleteBooking,
};
