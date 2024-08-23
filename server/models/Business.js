const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getGFS = require("../config/gridfs");

const businessSchema = new Schema({
  // owner: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  businessName: {
    type: String,
    required: true,
  },
  imageFileName: {
    type: String,
  },
  businessType: {
    type: String,
    required: true,
  },
  services: [
    {
      serviceName: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  staff: [
    {
      name: {
        type: String,
        required: true,
      },
      imageFileName: String,
      openingHours: {
        Monday: [Boolean],
        Tuesday: [Boolean],
        Wednesday: [Boolean],
        Thursday: [Boolean],
        Friday: [Boolean],
        Saturday: [Boolean],
        Sunday: [Boolean],
      },
      exceptionOnLeaveDateTime: [
        {
          dateTime: {
            type: Date,
            required: true,
          },
          duration: {
            type: Number,
            required: true,
          }, // in minutes
        },
      ],
      booking: [
        {
          type: Schema.Types.ObjectId,
          ref: "Booking",
        },
      ],
    },
  ],
  openingHours: {
    openingTime: String, // "HH:MM"  24-hour format
    closingTime: String, // "HH:MM" 24-hour format
    Monday: [Boolean],
    Tuesday: [Boolean],
    Wednesday: [Boolean],
    Thursday: [Boolean],
    Friday: [Boolean],
    Saturday: [Boolean],
    Sunday: [Boolean],
  },
  exceptionClosingDateTime: [
    {
      dateTime: {
        type: Date,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      }, // in minutes
    },
  ],
});

businessSchema.index({ location: "2dsphere" });

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
