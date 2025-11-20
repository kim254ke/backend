import mongoose from "mongoose";

const stylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialties: [
      {
        type: String,
        enum: ["Hair", "Nails", "Massage", "Facial", "Makeup", "Other"],
      },
    ],
    availability: [
      {
        day: {
          type: String,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        },
        slots: [String], // e.g., ["09:00", "10:00", "11:00"]
      },
    ],
  },
  { timestamps: true }
);

const Stylist = mongoose.model("Stylist", stylistSchema);
export default Stylist;
