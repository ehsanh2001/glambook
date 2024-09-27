const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  business: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  staff: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  service: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  booking_datetime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
