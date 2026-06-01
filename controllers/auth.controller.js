const AuthService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({ success: true, data: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await AuthService.fetchAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getAllUsers };