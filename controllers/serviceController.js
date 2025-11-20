import Service from "../models/Service.js";

// Get all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get services by category
export const getServiceByCategory = async (req, res) => {
  try {
    const services = await Service.find({ category: req.params.category });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a service (Admin only)
export const createService = async (req, res) => {
  try {
    const { category, name, duration, price } = req.body;
    const service = await Service.create({ category, name, duration, price });
    res.status(201).json({ message: "Service created", service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update service (Admin only)
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const { category, name, duration, price } = req.body;
    service.category = category || service.category;
    service.name = name || service.name;
    service.duration = duration || service.duration;
    service.price = price || service.price;

    await service.save();
    res.json({ message: "Service updated", service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete service (Admin only)
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.deleteOne();
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
