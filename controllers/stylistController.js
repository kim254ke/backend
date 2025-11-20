import Stylist from "../models/Stylist.js";

// Get all stylists
export const getStylists = async (req, res) => {
  try {
    const stylists = await Stylist.find().populate("specialties");
    res.json(stylists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stylist by ID
export const getStylistById = async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id).populate("specialties");
    if (!stylist) return res.status(404).json({ message: "Stylist not found" });
    res.json(stylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a stylist (Admin only)
export const createStylist = async (req, res) => {
  try {
    const { name, specialties, availability } = req.body;
    const stylist = await Stylist.create({ name, specialties, availability });
    res.status(201).json({ message: "Stylist created", stylist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a stylist (Admin only)
export const updateStylist = async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return res.status(404).json({ message: "Stylist not found" });

    const { name, specialties, availability } = req.body;
    stylist.name = name || stylist.name;
    stylist.specialties = specialties || stylist.specialties;
    stylist.availability = availability || stylist.availability;

    await stylist.save();
    res.json({ message: "Stylist updated", stylist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
