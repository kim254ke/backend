import Booking from "../models/Booking.js";
import Stylist from "../models/Stylist.js";

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("client", "name email phone")
      .populate("service", "name category price duration")
      .populate("stylist", "name specialties");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.params.userId })
      .populate("service", "name category price duration")
      .populate("stylist", "name specialties");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { serviceId, stylistId, date, time } = req.body;

    const stylist = await Stylist.findById(stylistId);
    if (!stylist) return res.status(404).json({ message: "Stylist not found" });

    const existingBooking = await Booking.findOne({ stylist: stylistId, date, time });
    if (existingBooking) return res.status(400).json({ message: "Slot already booked" });

    const booking = await Booking.create({
      client: req.user._id,
      service: serviceId,
      stylist: stylistId,
      date,
      time,
      status: "booked",
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const { date, time } = req.body;

    const existingBooking = await Booking.findOne({
      stylist: booking.stylist,
      date,
      time,
      _id: { $ne: booking._id },
    });
    if (existingBooking) return res.status(400).json({ message: "Slot already booked" });

    booking.date = date || booking.date;
    booking.time = time || booking.time;

    await booking.save();
    res.json({ message: "Booking updated", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
