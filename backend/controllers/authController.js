const User = require('../models/User');
const Organization = require('../models/Organization');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, organization: user.organization },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '30d' }
    );
};

// @desc    Register a new organization and Super Admin
// @route   POST /api/auth/register
exports.registerOrganization = async (req, res) => {
    try {
        const { 
            companyName, domain, industry, size, 
            adminName, adminEmail, password 
        } = req.body;

        // Check if organization or user exists
        const orgExists = await Organization.findOne({ domain });
        if (orgExists) return res.status(400).json({ message: 'Organization with this domain already exists' });

        const userExists = await User.findOne({ email: adminEmail });
        if (userExists) return res.status(400).json({ message: 'User with this email already exists' });

        // Create Organization
        const organization = await Organization.create({
            name: companyName,
            domain,
            industry,
            size
        });

        // Create Super Admin User
        const user = await User.create({
            fullName: adminName,
            email: adminEmail,
            password,
            role: 'SuperAdmin',
            organization: organization._id
        });

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user)
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            organizationId: user.organization,
            token: generateToken(user)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
