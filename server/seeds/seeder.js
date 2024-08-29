const db = require("../config/connection");
const TypeAndServices = require("../models/TypeAndServices");
const typeAndServicesData = require("./typeAndServicesData.js");

db.once("open", async () => {
  try {
    await TypeAndServices.deleteMany({});
    await TypeAndServices.create(typeAndServicesData);
    console.log("Seed data inserted!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
