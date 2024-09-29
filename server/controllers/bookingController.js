const { Booking } = require("../models");

async function createBooking(req, res) {
  const { customer, business, staff, booking_datetime, service } = req.body;
  if (!customer || !business || !staff || !booking_datetime || !service) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const booking = await Booking.create(req.body);
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
  if (req.user.role !== "customer") {
    return res
      .status(403)
      .json({ error: "You are not authorized to perform this action" });
  }

  const { customer, start_date, end_date } = req.body;
  let condition = { customer: customer };
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
