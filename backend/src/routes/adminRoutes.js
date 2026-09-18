const express = require('express');
const { 
  getDashboardStats,
  getUsers,
  updateUser,
  getProducts,
  updateProduct,
  getPayments,
  getVinSearches
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/products', getProducts);
router.put('/products/:id', updateProduct);
router.get('/payments', getPayments);
router.get('/vin-searches', getVinSearches);

module.exports = router;
