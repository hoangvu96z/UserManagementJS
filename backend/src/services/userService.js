const bcrypt = require('bcryptjs');
const User = require('../models/User');
const pool = require('../config/db');

class UserService {
  mapRowToUser(row) {
    return new User({
      id: row.id,
      nickname: row.nickname,
      email: row.email,
      password: row.password,
      phone: row.phone,
      country: row.country,
      role: row.role,
      createdAt: row.created_at
    });
  }

  async deleteAllUsers() {
    await pool.query('DELETE FROM users');
  }

  async getAllUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows.map(row => this.mapRowToUser(row));
  }

  async findUserByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0] ? this.mapRowToUser(rows[0]) : null;
  }

  async findUserByNickname(nickname) {
    const [rows] = await pool.query('SELECT * FROM users WHERE nickname = ? LIMIT 1', [nickname]);
    return rows[0] ? this.mapRowToUser(rows[0]) : null;
  }

  async findUserById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] ? this.mapRowToUser(rows[0]) : null;
  }

  async createUser(userData) {
    const { nickname, email, password, phone, country, role = 'user' } = userData;

    const existingUserByEmail = await this.findUserByEmail(email);
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }

    const existingUserByNickname = await this.findUserByNickname(nickname);
    if (existingUserByNickname) {
      throw new Error('Nickname already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (nickname, email, password, phone, country, role) VALUES (?, ?, ?, ?, ?, ?)',
      [nickname, email, hashedPassword, phone, country, role]
    );

    return new User({
      id: result.insertId,
      nickname,
      email,
      password: hashedPassword,
      phone,
      country,
      role,
      createdAt: new Date().toISOString()
    });
  }

  async updateUser(userId, updateData) {
    const existingUser = await this.findUserById(userId);

    if (!existingUser) {
      throw new Error('User not found');
    }

    if (updateData.nickname && updateData.nickname !== existingUser.nickname) {
      const userWithNickname = await this.findUserByNickname(updateData.nickname);
      if (userWithNickname && userWithNickname.id !== userId) {
        throw new Error('Nickname already exists');
      }
    }

    const nickname = updateData.nickname || existingUser.nickname;
    const phone = updateData.phone || existingUser.phone;
    const country = updateData.country || existingUser.country;
    const role = updateData.role || existingUser.role;

    await pool.query(
      'UPDATE users SET nickname = ?, phone = ?, country = ?, role = ? WHERE id = ?',
      [nickname, phone, country, role, userId]
    );

    return this.findUserById(userId);
  }

  async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    return this.findUserById(userId);
  }
}

module.exports = new UserService();
