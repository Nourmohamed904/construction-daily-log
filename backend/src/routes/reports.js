const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReportsAdmin,
  getReportById,
  deleteReport
} = require('../controllers/reportsController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReport);
router.get('/', protect, getAllReportsAdmin);
router.get('/:id', protect, getReportById);
router.delete('/:id', protect, deleteReport);

module.exports = router;