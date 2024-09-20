const router = require("express").Router();
const { createUser, login } = require("../../controllers/userController");

// /api/user/signup
router.route("/signup").post(createUser);

// /api/user/login
router.route("/login").post(login);

module.exports = router;
