const mongoose = require("mongoose");

const challengesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a challenge title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a challenge description"],
    },
    duration: {
      type: String,
      required: [true, "Please enter the duration of the challenge in days"],
    },
    addedValue1: {
      type: String,
      required: [true, "Please describe the added value of the challenge"],
    },
    addedValue2: {
      type: String,
      required: [true, "Please describe the added value of the challenge"],
    },
    addedValue3: {
      type: String,
      required: [true, "Please describe the added value of the challenge"],
    },
    completion: {
      type: Boolean,
      required: [true, "Please specify if the challenge is completed or not"],
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Challenges = mongoose.model("Challenges", challengesSchema);

module.exports = Challenges;
