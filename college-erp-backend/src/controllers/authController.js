const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role, Student, Staff } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role }],
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid credentials or inactive account' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.Role.name,
    };

    // Get additional info based on role
    let profile = null;
    if (user.Role.name === 'Student') {
      profile = await Student.findOne({ where: { user_id: user.id } });
    } else if (['Admin', 'Staff', 'Librarian', 'TransportAdmin'].includes(user.Role.name)) {
      profile = await Staff.findOne({ where: { user_id: user.id } });
    }

    if (profile) {
      payload.profile_id = profile.id;
      if (profile.first_name) {
        payload.name = `${profile.first_name} ${profile.last_name}`;
      }
    }

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      message: 'Login successful',
      token,
      user: payload
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'is_active'],
      include: [{ model: Role, attributes: ['name'] }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = null;
    if (user.Role.name === 'Student') {
      profile = await Student.findOne({ where: { user_id: user.id } });
    } else if (['Admin', 'Staff', 'Librarian', 'TransportAdmin'].includes(user.Role.name)) {
      profile = await Staff.findOne({ where: { user_id: user.id } });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.Role.name,
      profile: profile || null,
      name: profile && profile.first_name ? `${profile.first_name} ${profile.last_name}` : null
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  // Since JWT is stateless, the frontend simply discards the token.
  // This endpoint is for convenience or future invalidation logic.
  res.json({ message: 'Logout successful' });
};

