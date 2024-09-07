const router = require("express").Router();
const imageController = require("../../controllers/imageController");
const multer = require("multer");

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to upload file to GridFS
// POST /api/image/upload
router.post("/upload", upload.single("file"), imageController.uploadImage);

// Route to retrieve file
// GET /api/image/:filename
router.get("/:filename", imageController.getImage);

module.exports = router;