
const { User } = require('../models/schemas'); 
const bcrypt = require('bcrypt');

class AuthService {
  async registerUser(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("A user with this email address already exists.");
    }

    const saltRounds = 10;
    const securedHash = await bcrypt.hash(userData.password, saltRounds);
    
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      passwordHash: securedHash,
      role: userData.role || 'planner'
    });

    return await newUser.save();
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials provided.");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials provided.");
    }
    
    return user;
  }

async fetchAllUsers() {
  
  return await User.find().select('-passwordHash');
}
}

module.exports = new AuthService();