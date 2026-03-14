const Campaign = require('../models/Campaign');
const User = require('../models/User');

// @desc    Create a new simulation campaign
// @route   POST /api/campaigns
exports.createCampaign = async (req, res) => {
    try {
        const { name, type, targetDepartments, template } = req.body;
        const orgId = req.user.organization;

        // If specific departments are selected, find relevant users
        let targetUserIds = [];
        if (targetDepartments && targetDepartments.length > 0) {
            const users = await User.find({ 
                organization: orgId, 
                department: { $in: targetDepartments },
                role: 'Employee'
            }).select('_id');
            targetUserIds = users.map(u => u._id);
        } else {
            // Target all employees in the organization
            const users = await User.find({ 
                organization: orgId, 
                role: 'Employee'
            }).select('_id');
            targetUserIds = users.map(u => u._id);
        }

        const campaign = await Campaign.create({
            name,
            type,
            organization: orgId,
            createdBy: req.user._id,
            targetDepartments,
            targets: targetUserIds,
            template,
            status: 'Draft'
        });

        res.status(201).json(campaign);
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all campaigns for an organization
// @route   GET /api/campaigns
exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ organization: req.user.organization })
            .sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Launch a campaign (change status to Active)
// @route   PUT /api/campaigns/:id/launch
exports.launchCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findOneAndUpdate(
            { _id: req.params.id, organization: req.user.organization },
            { status: 'Active', scheduledAt: Date.now() },
            { new: true }
        );

        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        // Logic to "send" emails would go here (or trigger a background worker)
        
        res.json(campaign);
    } catch (error) {
        console.error('Error launching campaign:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
