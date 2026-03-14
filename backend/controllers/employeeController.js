const User = require('../models/User');

// @desc    Get all employees for an organization
// @route   GET /api/employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ 
            organization: req.user.organization,
            role: 'Employee'
        }).sort({ fullName: 1 });
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a single employee
// @route   POST /api/employees
exports.addEmployee = async (req, res) => {
    try {
        const { fullName, email, department } = req.body;
        const orgId = req.user.organization;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Employee already exists' });

        const employee = await User.create({
            fullName,
            email,
            department,
            role: 'Employee',
            organization: orgId,
            password: 'Password123' // Default password as per planning
        });

        res.status(201).json(employee);
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await User.findOneAndDelete({ 
            _id: req.params.id, 
            organization: req.user.organization,
            role: 'Employee'
        });

        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee removed' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Bulk upload employees (simplified for now via JSON array, can expand to CSV parser)
// @route   POST /api/employees/bulk
exports.bulkUpload = async (req, res) => {
    try {
        const { employees } = req.body; // Expecting array of { fullName, email, department }
        const orgId = req.user.organization;

        const results = { success: 0, failed: 0, errors: [] };

        for (const emp of employees) {
            try {
                const exists = await User.findOne({ email: emp.email });
                if (exists) {
                    results.failed++;
                    results.errors.push(`${emp.email} already exists`);
                    continue;
                }

                await User.create({
                    ...emp,
                    role: 'Employee',
                    organization: orgId,
                    password: 'Password123'
                });
                results.success++;
            } catch (err) {
                results.failed++;
                results.errors.push(`${emp.email}: ${err.message}`);
            }
        }

        res.json(results);
    } catch (error) {
        console.error('Bulk upload error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update employee risk score based on quiz performance
// @route   POST /api/employees/update-risk
exports.updateRisk = async (req, res) => {
    try {
        const { reduction } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newRisk = Math.max(0, user.riskScore - (reduction || 0));
        user.riskScore = newRisk;
        await user.save();

        res.json({ message: 'Risk score updated', newRiskScore: newRisk });
    } catch (error) {
        console.error('Error updating risk:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
