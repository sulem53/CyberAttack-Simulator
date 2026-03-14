const Organization = require('../models/Organization');
const User = require('../models/User');
const Campaign = require('../models/Campaign');

// @desc    Get organization-wide stats
// @route   GET /api/org/stats
exports.getOrgStats = async (req, res) => {
    try {
        const orgId = req.user.organization;

        const totalEmployees = await User.countDocuments({ organization: orgId, role: 'Employee' });
        const activeCampaigns = await Campaign.countDocuments({ organization: orgId, status: 'Active' });
        const org = await Organization.findById(orgId);

        // Placeholder for high risk alerts calculation
        const highRiskAlerts = await User.countDocuments({ organization: orgId, riskScore: { $gt: 80 } });

        res.json({
            orgName: org.name,
            totalEmployees,
            avgRiskScore: org.avgRiskScore,
            activeCampaigns,
            highRiskAlerts
        });
    } catch (error) {
        console.error('Error fetching org stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
