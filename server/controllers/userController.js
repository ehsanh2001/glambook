const { User } = require("../models");
const jwt = require("jsonwebtoken");

const EXPIRES_IN = "1h";

async function createUser(req, res) {
  try {
    const { username, password, role } = req.body;
    const user = await User.create({ username, password, role });

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: EXPIRES_IN }
    );

    res.json({
      token: token,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(400).json(error);
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    // If the user is not found, return an error message
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // If the user is found, check the password
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // If the password is correct, generate a token
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: EXPIRES_IN }
    );
    // Send the token and user info as a response

    res.json({
      token: token,
      user: { username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(400).json(error);
  }
}

module.exports = {
  createUser,
  login,
};
