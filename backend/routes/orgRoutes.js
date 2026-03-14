const express = require('express');
const router = express.Router();
const { getOrgStats } = require('../controllers/orgController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('SuperAdmin', 'Admin'), getOrgStats);

module.exports = router;
