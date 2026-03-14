const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Phishing', 'Social Engineering', 'Malware'], default: 'Phishing' },
    status: { type: String, enum: ['Draft', 'Active', 'Completed'], default: 'Draft' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetDepartments: [{ type: String }],
    targets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    template: {
        subject: String,
        body: String,
        sender: String,
        attackType: String // e.g., "Urgency", "Authority", "Reward"
    },
    stats: {
        sent: { type: Number, default: 0 },
        opened: { type: Number, default: 0 },
        clicked: { type: Number, default: 0 },
        submitted: { type: Number, default: 0 },
        reported: { type: Number, default: 0 }
    },
    scheduledAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', CampaignSchema);
