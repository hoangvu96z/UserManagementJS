class User {
  constructor({ id, nickname, email, password, phone, country, role = 'user', createdAt }) {
    this.id = id;
    this.nickname = nickname;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.country = country;
    this.role = role;
    this.createdAt = createdAt || new Date().toISOString();
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
