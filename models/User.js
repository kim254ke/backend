import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String,
      default: "/default-avatar.png", // default avatar
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
