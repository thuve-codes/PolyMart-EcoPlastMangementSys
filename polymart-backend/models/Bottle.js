const mongoose = require("mongoose");

const bottleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    bottleType: { type: String, required: true },
    weight: { type: Number, required: true },
    feedback: { type: String },
    disposalPurpose: { type: String, required: true }, // Updated field name
    pickupDate: { type: Date, required: true },
    points: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Picked Up", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bottle", bottleSchema);
