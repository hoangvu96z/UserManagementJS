const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const USERS_FILE = path.join(__dirname, '../../data/users.json');

class UserService {
  async getAllUsers() {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async saveUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  async findUserByEmail(email) {
    const users = await this.getAllUsers();
    return users.find(user => user.email === email);
  }

  async findUserByNickname(nickname) {
    const users = await this.getAllUsers();
    return users.find(user => user.nickname === nickname);
  }

  async findUserById(id) {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id);
  }

  async createUser(userData) {
    const { nickname, email, password, phone, country } = userData;
    
    // Check if user already exists
    const existingUserByEmail = await this.findUserByEmail(email);
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }

    const existingUserByNickname = await this.findUserByNickname(nickname);
    if (existingUserByNickname) {
      throw new Error('Nickname already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User(nickname, email, hashedPassword, phone, country);

    // Save to file
    const users = await this.getAllUsers();
    users.push(newUser.toDatabase());
    await this.saveUsers(users);

    return newUser;
  }

  async updateUser(userId, updateData) {
    const users = await this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Check nickname uniqueness if it's being updated
    if (updateData.nickname && updateData.nickname !== users[userIndex].nickname) {
      const existingUser = await this.findUserByNickname(updateData.nickname);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Nickname already exists');
      }
    }

    // Update user data
    users[userIndex] = { ...users[userIndex], ...updateData };
    await this.saveUsers(users);

    return users[userIndex];
  }

  async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }
}

module.exports = new UserService();
