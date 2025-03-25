import mongoose from "mongoose";

const PlasticRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plasticType: {
      type: String,
      required: true,
      enum: ["PET", "HDPE", "PVC", "LDPE", "PP", "PS", "Other"],
    },
    quantityKg: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PlasticRequest", PlasticRequestSchema);
