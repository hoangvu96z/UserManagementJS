const userService = require('../services/userService');

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json(user.toJSON());
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nickname, phone, country } = req.body;
    const userId = req.user.id;

    if (!nickname || !phone || !country) {
      return res.status(400).json({ error: 'Nickname, phone, and country are required' });
    }

    if (nickname.length > 40) {
      return res.status(400).json({ error: 'Nickname must be 40 characters or less' });
    }

    if (phone.length > 15) {
      return res.status(400).json({ error: 'Phone must be 15 characters or less' });
    }

    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Phone must contain only numbers' });
    }

    const updatedUser = await userService.updateUser(userId, {
      nickname,
      phone,
      country
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser.toJSON()
    });
  } catch (error) {
    if (error.message === 'Nickname already exists') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Current password, new password, and confirmation are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation do not match' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    if (newPassword.length > 40) {
      return res.status(400).json({ error: 'New password must be 40 characters or less' });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ error: 'New password must be different from the current password' });
    }

    const updatedUser = await userService.updatePassword(userId, currentPassword, newPassword);
    if (req.user) {
      req.user.password = updatedUser.password;
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error.message === 'Current password is incorrect') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    await userService.deleteAllUsers();
    res.json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Delete all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAllUsers
};
