const router = require("express").Router();
const apiRoutes = require("./api");

// API Routes
router.use("/api", apiRoutes);

router.use((req, res) => {
  res.send(`<h1>Wrong Route!</h1><h2>${req.url}</h2>`);
});

module.exports = router;
