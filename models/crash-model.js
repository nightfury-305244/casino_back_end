const mongoose = require("mongoose");

const CrashSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    wager: {
      type: Number,
      required: true,
    },
    profit: {
      type: Number,
      required: true,
    },
    result: {
      type: Boolean, // 1: Win 0: Loss
      required: true,
    },
    Start_Date: {
      type: Date,
      required: true,
    },
    End_Date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Crash = mongoose.model("Crash", CrashSchema);
module.exports = { Crash };
