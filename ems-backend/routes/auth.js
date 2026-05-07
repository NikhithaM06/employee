const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({ email, password, role });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
});

// Admin creates employee account
router.post('/create-employee-account', auth, adminAuth, async (req, res) => {
  try {
    const { email, password, employeeId } = req.body;

    if (!email || !password || !employeeId) {
      return res.status(400).json({ message: 'Email, password, and employeeId are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user linked to employee
    const user = new User({ email, password, role: 'user', employeeId });
    await user.save();

    res.status(201).json({ message: 'Employee credentials created successfully', user: { id: user._id, email: user.email, role: user.role, employeeId: user.employeeId } });
  } catch (error) {
    console.error('Create account error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and populate employee details to get the name
    const user = await User.findOne({ email }).populate('employeeId');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        employeeName: user.employeeId ? user.employeeId.name : 'Employee' 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout (client-side, but can invalidate token if needed)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;