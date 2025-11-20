import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Models
import User from "./models/User.js";
import Service from "./models/Service.js";
import Stylist from "./models/Stylist.js";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("MongoDB Connection Error:", err));

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Service.deleteMany();
    await Stylist.deleteMany();

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      name: "Admin User",
      phone: "0712345678",
      email: "admin@glamhub.com",
      password: adminPassword,
      role: "admin"
    });

    console.log("Admin user created ✅");

    // Create sample services
    const services = await Service.insertMany([
      { category: "Hair", name: "Dreadlocks", duration: 120, price: 1500 },
      { category: "Hair", name: "Ponytail", duration: 90, price: 1200 },
      { category: "Nails", name: "Manicure", duration: 60, price: 800 },
      { category: "Massage", name: "Full Body Massage", duration: 90, price: 2000 },
      { category: "Facial", name: "Deep Cleansing Facial", duration: 60, price: 1500 },
    ]);

    console.log("Sample services created ✅");

    // Create sample stylists
    const stylists = await Stylist.insertMany([
      {
        name: "Alice",
        specialties: ["Hair", "Nails"],
        availability: [
          { day: "Monday", slots: ["09:00", "10:00", "11:00"] },
          { day: "Tuesday", slots: ["12:00", "13:00", "14:00"] },
        ],
      },
      {
        name: "Bob",
        specialties: ["Massage", "Facial"],
        availability: [
          { day: "Wednesday", slots: ["09:00", "11:00", "13:00"] },
          { day: "Thursday", slots: ["10:00", "12:00", "14:00"] },
        ],
      },
    ]);

    console.log("Sample stylists created ✅");

    console.log("Seeding complete 🎉");
    process.exit();

  } catch (error) {
    console.log("Seeder Error:", error);
    process.exit(1);
  }
};

seedData();
