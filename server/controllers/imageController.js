const { Readable } = require("stream");
const { v4: uuidv4 } = require("uuid");
const { getGridFsBucket } = require("../config/gridFsConnection");

// upload file to GridFS
// POST /api/image/upload
// is protected by jwtAuthMiddleware
// Required fields: req.file is the file to upload
// Returns: JSON object with filename and message
async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filename = uuidv4();

  // Initialize GridFS bucket and upload/download streams
  const gridFsBucket = await getGridFsBucket;
  const girdFsUploadStream = gridFsBucket.openUploadStream(filename);
  const userFileReadableStream = Readable.from(req.file.buffer);
  // Pipe the file data into GridFS
  userFileReadableStream.pipe(girdFsUploadStream);

  // Handle events
  girdFsUploadStream.on("finish", () => {
    res.status(201).json({
      filename: filename,
      message: "File uploaded successfully",
    });
  });

  girdFsUploadStream.on("error", (err) => {
    res.status(500).json({ message: "Internal server error" });
  });
}

// get image from GridFS
// GET /api/image/:filename
// Required fields: req.params.filename is the filename of the image
// Returns: Image file
async function getImage(req, res) {
  // Initialize GridFS bucket and download stream
  const gridFsBucket = await getGridFsBucket;
  const downloadStream = gridFsBucket.openDownloadStreamByName(
    req.params.filename
  );

  // Handle events

  // If the file is found in GridFS, write it to the response
  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("end", () => {
    res.end();
  });

  // If the file is not found in GridFS, return a 404 error
  downloadStream.on("error", (err) => {
    res.status(404).json({ error: "File not found" });
  });
}

module.exports = { uploadImage, getImage };
