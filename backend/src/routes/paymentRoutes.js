const express = require('express');
const { 
  createCheckoutSession, 
  webhook, 
  verifySession 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-checkout', protect, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);
router.get('/verify/:sessionId', protect, verifySession);

module.exports = router;
