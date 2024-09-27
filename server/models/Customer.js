const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
});

customerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Customer", customerSchema);
