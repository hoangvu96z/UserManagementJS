class User {
  constructor(nickname, email, password, phone, country) {
    this.id = Date.now().toString(); // Simple ID generation
    this.nickname = nickname;
    this.email = email;
    this.password = password; // Will be hashed
    this.phone = phone;
    this.country = country;
    this.createdAt = new Date().toISOString();
  }

  // Convert to JSON without password for client responses
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  // Convert to JSON with password for database storage
  toDatabase() {
    return {
      id: this.id,
      nickname: this.nickname,
      email: this.email,
      password: this.password,
      phone: this.phone,
      country: this.country,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;
