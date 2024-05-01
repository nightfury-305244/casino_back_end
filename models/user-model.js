const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    walletAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("User", UserSchema);
module.exports = { Users };
