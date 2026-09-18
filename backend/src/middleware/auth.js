const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ error: 'User not found or inactive' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized to access this route' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    if (roles.includes('admin') && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  };
};

module.exports = { protect, authorize };
