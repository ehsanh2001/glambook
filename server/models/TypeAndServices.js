const { Schema, model } = require("mongoose");

const typeAndServicesSchema = new Schema({
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
    },
  ],
});

const TypeAndServices = model("TypeAndServices", typeAndServicesSchema);

module.exports = TypeAndServices;
