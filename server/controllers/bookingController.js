const { Booking, Customer } = require("../models");
const mongoose = require("mongoose");

// Create a new booking
// POST /api/bookings
// Needs to be authenticated with a customer role
// Required fields: user, business, staff, booking_datetime, service
// user,business,staff and service are ids referencing the User, Business, Staff(in Business) and Service(in Business) models respectively
// Returns the created booking

async function createBooking(req, res) {
  // Check if the user is a customer
  if (req.user.role !== "customer") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }

  const { user, business, staff, booking_datetime, service } = req.body;

  // Check if the required fields are provided
  if (!user || !business || !staff || !booking_datetime || !service) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if the provided fields are valid
  if (
    !mongoose.Types.ObjectId.isValid(user) ||
    !mongoose.Types.ObjectId.isValid(business) ||
    !mongoose.Types.ObjectId.isValid(staff) ||
    !mongoose.Types.ObjectId.isValid(service)
  ) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    // Check if the staff is available
    const bookings = await Booking.find({
      staff: staff,
      booking_datetime: booking_datetime,
    });

    // If the staff is not available, return an error
    if (bookings.length > 0) {
      return res.status(400).json({
        message: "Staff is not available at the selected time",
      });
    }

    // get customer id
    const customer = await Customer.findOne({ user_id: user });
    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    // save the booking to the database
    const data = { ...req.body, customer: customer._id };
    const booking = await Booking.create(data);

    // return the booking as response
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get bookings for a staff
// POST /api/bookings/staff
// Needs to be authenticated with a staff role
// Required fields: staff (id) and optionally start_date and end_date
// Returns the bookings for the staff within the date range if provided

async function getBookingsForStaff(req, res) {
  // Check if the user is a staff
  if (req.user.role !== "staff") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }

  const { staff, start_date, end_date } = req.body;
  // check if the required fields are provided and valid
  if (!staff || !mongoose.Types.ObjectId.isValid(staff)) {
    return res
      .status(400)
      .json({ message: "Missing required fields or invalid ID format" });
  }

  // create the condition object
  let condition = { staff: staff };
  // if date is available add the date range to the condition object
  if (start_date && end_date) {
    condition.booking_datetime = {
      $gte: start_date,
      $lt: end_date,
    };
  }

  try {
    // get the bookings from the database
    const bookings = await Booking.find(condition)
      .populate("business")
      .populate("customer");

    // return the bookings as response
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get bookings for a customer
// GET /api/bookings/customer/:id
// Needs to be authenticated with a customer role
// Required fields: id (customer id) and optionally start_date and end_date
// Returns the bookings for the customer within the date range if provided

async function getBookingsForCustomer(req, res) {
  // Check if the user is a customer
  if (req.user && req.user.role !== "customer") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }

  // get the parameter from the request
  const { id } = req.params;
  const { start_date, end_date } = req.query;

  // check if the required fields are provided and valid
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Missing required fields or invalid ID format" });
  }

  // crearte the condition object
  let condition = { customer: id };
  // if date is available add the date range to the condition object
  if (start_date && end_date) {
    condition.booking_datetime = {
      $gte: start_date,
      $lt: end_date,
    };
  }

  // get the bookings from the database
  try {
    const bookings = await Booking.find(condition).populate("business");

    const response = selectResponseAttributes(bookings);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

// Helper functions
// Select the required attributes from the Booking populated with Business
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

// Delete a booking
// DELETE /api/bookings/:id
// Needs to be authenticated with a customer or staff role
// Required fields: id (booking id)
// Returns a 204 response if the booking is deleted successfully

async function deleteBooking(req, res) {
  // Check if the user is a customer or staff
  if (req.user.role !== "customer" && req.user.role !== "staff") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }

  // Check if the provided ID is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    // Delete the booking
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    // Return a 204 response
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createBooking,
  getBookingsForStaff,
  getBookingsForCustomer,
  deleteBooking,
};
