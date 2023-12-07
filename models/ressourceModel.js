const mongoose = require("mongoose");

const resourceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a resource title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a resource description"],
    },
    text: {
      type: String,
      required: [true, "Please provide the text content of the resource"],
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
