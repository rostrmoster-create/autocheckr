const express = require('express');
const { validateVin, searchVin } = require('../controllers/vinController');
const { protect } = require('../middleware/auth');
const { vinSearchLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/validate', validateVin);
router.post('/search', vinSearchLimiter, protect, searchVin);

module.exports = router;
