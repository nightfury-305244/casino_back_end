const { Users } = require("../models/user-model");
const Status = require("../config/constant");
const bcrypt = require("bcryptjs");
const { createWallet } = require("../services/walletService");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(Status.ERROR.BAD_REQUEST).send({
        message: "User already exists!",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create Wallet Address
      const walletAddress = createWallet();

      const newUser = new Users({
        ...req.body,
        password: hashedPassword,
        walletAddress,
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      return res.status(Status.SUCCESS.CREATED).send({
        msg: "User created!",
        user: savedUser,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(Status.ERROR.INTERNAL_SERVER_ERROR).send({
      message: "Internal Server Error!",
    });
  }
};

const login = async (req, res) => {
  console.log("req", req.body);
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Incorrect Password!");
    }

    return res.status(Status.SUCCESS.OK).send({
      msg: "Login successful!",
    });
  } catch (error) {
    console.log("error", error);
    res.status(Status.ERROR.INTERNAL_SERVER_ERROR).send({
      message: "Internal Server Error!",
    });
  }
};

module.exports = {
  register,
  login,
};
