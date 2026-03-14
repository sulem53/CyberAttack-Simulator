const express = require('express');
const router = express.Router();
const { trackClick } = require('../controllers/simulationController');

router.get('/click/:campaignId/:userId', trackClick);

module.exports = router;
