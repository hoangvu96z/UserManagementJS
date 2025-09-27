const userService = require('../services/userService');

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json(new (require('../models/User'))().toJSON.call(user));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nickname, phone, country } = req.body;
    const userId = req.user.id;

    // Validation
    if (!nickname || !phone || !country) {
      return res.status(400).json({ error: 'Nickname, phone, and country are required' });
    }

    if (nickname.length > 40) {
      return res.status(400).json({ error: 'Nickname must be 40 characters or less' });
    }

    if (phone.length > 15) {
      return res.status(400).json({ error: 'Phone must be 15 characters or less' });
    }

    // Phone validation (numeric only)
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Phone must contain only numbers' });
    }

    // Update user
    const updatedUser = await userService.updateUser(userId, {
      nickname,
      phone,
      country
    });

    res.json({
      message: 'Profile updated successfully',
      user: new (require('../models/User'))().toJSON.call(updatedUser)
    });
  } catch (error) {
    if (error.message === 'Nickname already exists') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile
};
