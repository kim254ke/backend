import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Hair", "Nails", "Massage", "Facial", "Makeup", "Other"],
    },
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
