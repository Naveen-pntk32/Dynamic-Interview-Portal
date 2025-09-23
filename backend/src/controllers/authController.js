const jwt = require('jsonwebtoken');
const User = require('../models/User');

function sign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

// POST /auth/register
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, role });
    const token = sign({ id: user._id, role: user.role, email: user.email });
    return res.status(201).json({ success: true, message: 'Registered', data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Registration failed', data: { error: e.message } });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = sign({ id: user._id, role: user.role, email: user.email });
    return res.json({ success: true, message: 'Logged in', data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Login failed', data: { error: e.message } });
  }
}

module.exports = { register, login };


