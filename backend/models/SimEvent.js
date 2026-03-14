const mongoose = require('mongoose');

const SimEventSchema = new mongoose.Schema({
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    event: { type: String, enum: ['opened', 'clicked', 'submitted', 'reported'], required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: {
        ip: String,
        device: String,
        details: String
    }
});

module.exports = mongoose.model('SimEvent', SimEventSchema);
