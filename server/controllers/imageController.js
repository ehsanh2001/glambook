// This module provides the image controller functions.
// It exports the following functions:
//  * uploadImage
//  * getImage

const { Readable } = require("stream");
const { v4: uuidv4 } = require("uuid");
const { getGridFsBucket } = require("../config/gridFsConnection");

// upload file to GridFS
async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const filename = uuidv4();

  const gridFsBucket = await getGridFsBucket;
  const uploadStream = gridFsBucket.openUploadStream(filename);
  const readableStream = Readable.from(req.file.buffer);
  readableStream.pipe(uploadStream);

  uploadStream.on("finish", () => {
    res.status(201).json({
      filename: filename,
      message: "File uploaded successfully",
    });
  });

  uploadStream.on("error", (err) => {
    res.status(500).json({ error: err.message });
  });
}

async function getImage(req, res) {
  const gridFsBucket = await getGridFsBucket;
  const downloadStream = gridFsBucket.openDownloadStreamByName(
    req.params.filename
  );

  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("end", () => {
    res.end();
  });

  downloadStream.on("error", (err) => {
    res.status(404).json({ error: "File not found" });
  });
}

module.exports = { uploadImage, getImage };
