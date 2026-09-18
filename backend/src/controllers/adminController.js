const { User, Vehicle, Report, Payment, VinSearch, Product } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalReports = await Report.count({ where: { reportType: 'full_report' } });
    const totalRevenue = await Payment.sum('amount', { where: { status: 'completed' } });
    const totalSearches = await VinSearch.count();

    const recentUsers = await User.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    const recentPayments = await Payment.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['email', 'firstName', 'lastName'] }]
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalReports,
        totalRevenue: totalRevenue || 0,
        totalSearches
      },
      recentUsers,
      recentPayments
    });

  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = search ? {
      [Op.or]: [
        { email: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      users: rows,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit)
    });

  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, reportCredits, isAdmin } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (reportCredits !== undefined) user.reportCredits = reportCredits;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isActive: user.isActive,
        reportCredits: user.reportCredits,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['reportCredits', 'ASC']]
    });

    res.json({
      success: true,
      products
    });

  } catch (error) {
    logger.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, reportCredits, isActive } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (reportCredits !== undefined) product.reportCredits = reportCredits;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    res.json({
      success: true,
      product
    });

  } catch (error) {
    logger.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['email', 'firstName', 'lastName'] }]
    });

    res.json({
      success: true,
      payments: rows,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit)
    });

  } catch (error) {
    logger.error('Get payments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getVinSearches = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await VinSearch.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [{ 
        model: User, 
        attributes: ['email', 'firstName', 'lastName'],
        required: false 
      }]
    });

    res.json({
      success: true,
      searches: rows,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit)
    });

  } catch (error) {
    logger.error('Get VIN searches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
