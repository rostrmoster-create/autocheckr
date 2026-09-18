const express = require('express');
const { 
  getReport, 
  getUserReports, 
  createPreviewReport,
  unlockReport 
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getUserReports);
router.get('/:id', protect, getReport);
router.post('/preview', protect, createPreviewReport);
router.post('/unlock', protect, unlockReport);

module.exports = router;
