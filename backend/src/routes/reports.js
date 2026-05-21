const express = require('express');
const router = express.Router();
const { createReport, getAllReports, getReportById } = require('../controllers/reportsController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReport);
router.get('/', protect, getAllReports);
router.get('/:id', protect, getReportById);

module.exports = router;