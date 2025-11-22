const userService = require('../services/userService');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { nickname, password, confirmPassword, email, phone, country, role } = req.body;

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Phone must contain only numbers' });
    }

    const newUser = await userService.createUser({
      nickname,
      password,
      email,
      phone,
      country,
      role: role || 'user'
    });

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
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    let user = await userService.findUserByEmail(username);
    if (!user) {
      user = await userService.findUserByNickname(username);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await userService.validatePassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

module.exports = {
  register,
  login,
  logout
};
