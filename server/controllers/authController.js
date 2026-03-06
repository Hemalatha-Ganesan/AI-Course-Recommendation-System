const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured. Please set it in your .env file.');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedUsername = String(username || '').trim();

    // Validation
    if (!normalizedUsername || !normalizedEmail || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide username, email, and password' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: existingUser.email === normalizedEmail 
          ? 'User with this email already exists' 
          : 'Username already taken'
      });
    }

    // Create user
    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Registration failed. Please try again.' 
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifierRaw = String(email || username || '').trim();
    const normalizedEmail = identifierRaw.toLowerCase();

    if (!identifierRaw || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email/username and password' 
      });
    }

    let user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: identifierRaw }
      ]
    }).select('+password');

    if (!user) {
      // Backward-compatibility for legacy records with mixed case/extra spaces in email.
      const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      user = await User.findOne({
        email: { $regex: `^\\s*${escapedEmail}\\s*$`, $options: 'i' }
      }).select('+password');
    }

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    let isMatch = await user.comparePassword(password);

    // Backward-compatibility for legacy users saved with plain-text passwords.
    if (!isMatch && typeof user.password === 'string' && !user.password.startsWith('$2')) {
      isMatch = user.password === password;
      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });
      }
    }

    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Login failed. Please try again.' 
    });
  }
};
