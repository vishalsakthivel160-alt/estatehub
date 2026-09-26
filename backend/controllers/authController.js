const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'estatehub_jwt_secret_fallback_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  return clientId ? new OAuth2Client(clientId) : null;
};

// @desc Register new user (buyer or seller)
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const allowedRole = ['buyer', 'seller'].includes(role) ? role : 'buyer';

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      phone: phone ? phone.trim() : '',
      role: allowedRole,
    });

    res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Registration controller error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Contact support.' });
    }

    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login controller error:', error);
    res.status(500).json({ message: error.message || 'Server error during login.' });
  }
};

// @desc Login or Register with Google OAuth
// @route POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { credential, idToken, accessToken, role } = req.body;
    const tokenToVerify = credential || idToken;

    let payload = null;

    if (tokenToVerify) {
      const client = getGoogleClient();
      if (client && process.env.GOOGLE_CLIENT_ID) {
        try {
          const ticket = await client.verifyIdToken({
            idToken: tokenToVerify,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          payload = ticket.getPayload();
        } catch (verifyErr) {
          console.warn('google-auth-library verifyIdToken warning:', verifyErr.message);
        }
      }

      if (!payload) {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenToVerify}`);
        if (response.ok) {
          payload = await response.json();
        }
      }
    } else if (accessToken) {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        payload = await response.json();
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid or expired Google token.' });
    }

    const googleId = payload.sub || payload.id;
    const cleanEmail = payload.email.toLowerCase().trim();
    const name = payload.name || payload.email.split('@')[0];
    const picture = payload.picture || '';

    let user = await User.findOne({ $or: [{ email: cleanEmail }, { googleId }] });

    if (user) {
      if (user.isBlocked) {
        return res.status(403).json({ message: 'Your account has been blocked. Contact support.' });
      }

      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      const allowedRole = ['buyer', 'seller'].includes(role) ? role : 'buyer';
      const randomPassword = `G_${googleId}_${crypto.randomBytes(8).toString('hex')}`;

      user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: randomPassword,
        googleId,
        avatar: picture,
        role: allowedRole,
      });
    }

    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google Auth controller error:', error);
    res.status(500).json({ message: error.message || 'Server error during Google authentication.' });
  }
};

// @desc Get current logged-in user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// @desc Update profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();
    res.json({ user: updated.toSafeObject() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, googleLogin, getMe, updateProfile };

