import User from "../models/User.js";

// @desc    Update user profile (name, phone, location)
// @route   PUT /api/user/profile/:id
// @access  Public
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, location } = req.body;

    // Find user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only allowed fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) {
      // Check if phone is being changed to a different number
      if (phone !== user.phone) {
        // Check if new phone number already exists
        const phoneExists = await User.findOne({ phone, _id: { $ne: id } });
        if (phoneExists) {
          return res.status(400).json({ message: "Phone number already in use" });
        }
      }
      user.phone = phone;
    }
    if (location !== undefined) user.location = location;

    // Save updated user
    await user.save();

    // Return user without password
    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// @desc    Get user profile
// @route   GET /api/user/profile/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};


  