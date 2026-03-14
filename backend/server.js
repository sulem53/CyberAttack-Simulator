require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5502;

// Routes
const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/orgRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const simulationRoutes = require('./routes/simulationRoutes');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve Static Frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/simulate', simulationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: "OK",
        message: "AttackSimulator API is running"
    });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {

    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI is missing in .env file");
        process.exit(1);
    }

    try {

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });

        console.log("✅ MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error("❌ MongoDB Connection Error:", error.message);

        if (error.message.includes("querySrv ECONNREFUSED")) {
            console.error("👉 Your DNS or network is blocking MongoDB SRV records");
            console.error("👉 Solution: Use Standard connection string OR change DNS to 8.8.8.8");
        }

        process.exit(1);
    }
}

startServer();