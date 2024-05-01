const express = require("express");
const { auth } = require("../controllers");
const validateUser = require("../middleware/validation");

const authRoutes = express.Router();

authRoutes.post("/login", auth.login);

authRoutes.post("/register", validateUser, auth.register);

module.exports = { authRoutes };
