const { Business } = require("../models");

// Get businesses based on search query and location(optional)
// serach query is matched against business name OR service name
// GET /api/search?q=string&lat=number&lng=number
// Public access
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

// Helper function to search businesses
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
        distanceField: "distanceInMeters",
        spherical: true,
      },
    });

    // Add addField stage to the pipeline to convert distance to kilometers
    pipeline.push({
      $addFields: {
        distanceInKilometers: {
          $round: [{ $divide: ["$distanceInMeters", 1000] }, 2],
        },
      },
    });

    // Add sort stage to the pipeline to sort by distance
    pipeline.push({
      $sort: { distance: 1 },
    });
  }

  // Add match stage to the pipeline to filter businesses based on search query
  pipeline.push({
    $match: {
      $or: [
        { businessName: { $regex: q, $options: "i" } },
        { "services.serviceName": { $regex: q, $options: "i" } },
      ],
    },
  });

  try {
    // Execute the aggregation pipeline
    const businesses = await Business.aggregate(pipeline);

    return businesses;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw error;
  }
}

module.exports = { searchBusinesses };
