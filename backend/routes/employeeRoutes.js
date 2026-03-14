const express = require('express');
const router = express.Router();
const { getEmployees, addEmployee, deleteEmployee, bulkUpload, updateRisk } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('SuperAdmin', 'Admin', 'HR'));

router.route('/')
    .get(getEmployees)
    .post(addEmployee);

router.post('/bulk', bulkUpload);
router.post('/update-risk', updateRisk);
router.delete('/:id', deleteEmployee);

module.exports = router;
