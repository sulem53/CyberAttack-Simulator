const express = require('express');
const router = express.Router();
const { createCampaign, getCampaigns, launchCampaign } = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('SuperAdmin', 'Admin'));

router.route('/')
    .get(getCampaigns)
    .post(createCampaign);

router.put('/:id/launch', launchCampaign);

module.exports = router;
