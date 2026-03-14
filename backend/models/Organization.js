const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    industry: { type: String, enum: ['Finance', 'IT', 'Healthcare', 'Education', 'Other'], default: 'Other' },
    size: { type: String },
    avgRiskScore: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Organization', OrganizationSchema);
