const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter the user's email"],
    },
    counsellor: {
      type: String,
      required: [true, "Please enter the counsellor's name"],
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please enter the user's name"],
    },
    age: {
      type: String,
      required: [true, "Please enter the user's age"],
    },
    gender: {
      type: String,
      required: [true, "Please enter the user's gender"],
    },
    problem: {
      type: String,
      required: [true, "Please enter the user's problem"],
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
