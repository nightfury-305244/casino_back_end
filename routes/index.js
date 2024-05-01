const express = require("express");
const { authRoutes } = require("./auth-route");
const route = express.Router();

route.use("/auth", authRoutes);

module.exports = route;
