const Campaign = require('../models/Campaign');
const User = require('../models/User');
const SimEvent = require('../models/SimEvent');
const Organization = require('../models/Organization');

// @desc    Track a click from a simulation email
// @route   GET /api/simulate/click/:campaignId/:userId
exports.trackClick = async (req, res) => {
    try {
        const { campaignId, userId } = req.params;

        const campaign = await Campaign.findById(campaignId);
        const user = await User.findById(userId);

        if (!campaign || !user) {
            return res.status(404).send('Invalid simulation link');
        }

        // Log the event
        await SimEvent.create({
            campaign: campaignId,
            user: userId,
            organization: user.organization,
            event: 'clicked',
            metadata: {
                ip: req.ip,
                device: req.headers['user-agent']
            }
        });

        // Update campaign stats
        await Campaign.findByIdAndUpdate(campaignId, { $inc: { 'stats.clicked': 1 } });

        // Update user risk score (simplified logic: +10 risk for every click)
        const newRisk = Math.min(100, user.riskScore + 10);
        await User.findByIdAndUpdate(userId, { riskScore: newRisk });

        // Redirect to "Gotcha" / Educational page
        // In a real app, this would be a full URL. For now, we redirect to a frontend page.
        res.redirect(`http://localhost:3000/simulation-warning.html?userId=${userId}&campaignId=${campaignId}`);
    } catch (error) {
        console.error('Tracking error:', error);
        res.status(500).send('An error occurred during verification');
    }
};
