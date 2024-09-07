// Initialize MongoDB connection and GridFSBucket
// In this snippet, we connect to MongoDB and initialize a GridFSBucket instance.
// exports a Promis objects which will resolve to a GridFSBucket
// To use the getGridFsBucket Promise object, we need to await it
//  example usage:
//          const { getGridFsBucket } = require("../config/gridFsConnection");
//          const gridFsBucket = await getGridFsBucket;

const { MongoClient, GridFSBucket } = require("mongodb");

// MongoDB URI
const mongoURI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/glambook";

// Create MongoDB client
const client = new MongoClient(mongoURI);

//  Connect to MongoDB and initialize GridFSBucket
const getGridFsBucket = client
  .connect()
  .then(() => {
    const db = client.db();
    let gridFsBucket = new GridFSBucket(db, { bucketName: "uploads" });
    return gridFsBucket;
  })
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = { getGridFsBucket };
