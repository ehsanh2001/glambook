const { Business } = require("../models");

async function searchBusinesses(req, res) {
  const searchQuery = req.query.q;
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);

  try {
    const businesses = await search(searchQuery, lng, lat);
    res.json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function search(q, longitude, latitude) {
  if (!q) {
    return [];
  }

  // Define the pipeline for the aggregation
  let pipeline = [];

  if (longitude && latitude) {
    // Add geoNear stage to the pipeline
    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        distanceField: "distanceInMeters", // Field to store the calculated distance
        spherical: true,
      },
    });

    // Add addField stage to the pipeline
    pipeline.push({
      $addFields: {
        distanceInKilometers: {
          $round: [{ $divide: ["$distanceInMeters", 1000] }, 2],
        },
      },
    });

    // Add sort stage to the pipeline
    pipeline.push({
      $sort: { distance: 1 },
    });
  }

  // Add match stage to the pipeline
  pipeline.push({
    $match: {
      $or: [
        { businessName: { $regex: q, $options: "i" } },
        { "services.serviceName": { $regex: q, $options: "i" } },
      ],
    },
  });

  try {
    const businesses = await Business.aggregate(pipeline);

    return businesses;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw error;
  }
}

module.exports = { searchBusinesses };
