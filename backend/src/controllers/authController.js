const userService = require('../services/userService');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { nickname, password, confirmPassword, email, phone, country } = req.body;

    // Validation
    if (!nickname || !password || !confirmPassword || !email || !phone || !country) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (nickname.length > 40) {
      return res.status(400).json({ error: 'Nickname must be 40 characters or less' });
    }

    if (password.length > 40) {
      return res.status(400).json({ error: 'Password must be 40 characters or less' });
    }

    if (email.length > 40) {
      return res.status(400).json({ error: 'Email must be 40 characters or less' });
    }

    if (phone.length > 15) {
      return res.status(400).json({ error: 'Phone must be 15 characters or less' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Phone validation (numeric only)
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Phone must contain only numbers' });
    }

    // Create user
    const newUser = await userService.createUser({
      nickname,
      password,
      email,
      phone,
      country
    });

    // Generate token for auto-login
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser.toJSON()
    });
  } catch (error) {
    if (error.message === 'Email already exists' || error.message === 'Nickname already exists') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by email or nickname
    let user = await userService.findUserByEmail(username);
    if (!user) {
      user = await userService.findUserByNickname(username);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isValidPassword = await userService.validatePassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: new (require('../models/User'))().toJSON.call(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logout = (req, res) => {
  // Since we're using JWT, logout is handled client-side by removing the token
  res.json({ message: 'Logout successful' });
};

module.exports = {
  register,
  login,
  logout
};
