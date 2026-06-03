const AuthService = require('../services/auth.service');

// 1. REGISTER PROFILE ROUTE HANDLER
const register = async (req, res) => {
  try {
    // Structural Guard: Ensure body attributes are valid
    if (!req.body || !req.body.email || !req.body.password || !req.body.name) {
      return res.status(400).json({ 
        success: false, 
        message: "Bad Request: Missing required field attributes (name, email, password)." 
      });
    }

    const user = await AuthService.registerUser(req.body);
    
    // Exact response matching your database schema payload
    return res.status(201).json({ 
      success: true, 
      data: { 
        id: user._id, 
        name: user.name, 
        role: user.role || "user" 
      } 
    });
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: error.message || "An error occurred during registration tracking." 
    });
  }
};

// 2. LOGIN SESSION ROUTE HANDLER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Bad Request: Email and password fields cannot be empty." 
      });
    }

    const user = await AuthService.loginUser(email, password);
    
    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role || "user" 
      }
    });
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: error.message || "Authentication failed: Invalid credentials." 
    });
  }
};

// 3. INDEX GLOBAL ROSTER ROUTE HANDLER
const getAllUsers = async (req, res) => {
  try {
    const users = await AuthService.fetchAllUsers();
    return res.status(200).json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server exception fetching collection records." 
    });
  }
};

// Exporting explicitly to match your routes module attachment mapping
module.exports = { 
  register, 
  login, 
  getAllUsers,
  registerUser: register, // Alias fallback to intercept routing variations
  loginUser: login,       // Alias fallback
  fetchAllUsers: getAllUsers // Alias fallback
};