const pool = require('../db/db');

// CREATE a new daily report
const createReport = async (req, res) => {
  const {
    site_name,
    report_date,
    workers_present,
    tasks_completed,
    issues_encountered,
    weather_condition,
  } = req.body;

  try {
    const newReport = await pool.query(
      `INSERT INTO daily_reports 
        (user_id, site_name, report_date, workers_present, tasks_completed, issues_encountered, weather_condition) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        req.user.id,
        site_name,
        report_date,
        workers_present,
        tasks_completed,
        issues_encountered,
        weather_condition,
      ]
    );

    res.status(201).json({
      message: 'Report created successfully',
      report: newReport.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all reports for the logged-in user
const getAllReports = async (req, res) => {
  try {
    const reports = await pool.query(
      'SELECT * FROM daily_reports WHERE user_id = $1 ORDER BY report_date DESC',
      [req.user.id]
    );

    res.status(200).json({
      count: reports.rows.length,
      reports: reports.rows,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET a single report by ID
const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    // Admin can view any report, manager can only view their own
    const query = req.user.role === 'admin'
      ? 'SELECT dr.*, u.name as manager_name FROM daily_reports dr JOIN users u ON dr.user_id = u.id WHERE dr.id = $1'
      : 'SELECT * FROM daily_reports WHERE id = $1 AND user_id = $2';

    const values = req.user.role === 'admin' ? [id] : [id, req.user.id];
    const report = await pool.query(query, values);

    if (report.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ report: report.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a report
const deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    // Admin can delete any report, manager can only delete their own
    const query = req.user.role === 'admin'
      ? 'DELETE FROM daily_reports WHERE id = $1 RETURNING *'
      : 'DELETE FROM daily_reports WHERE id = $1 AND user_id = $2 RETURNING *';

    const values = req.user.role === 'admin' ? [id] : [id, req.user.id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found or unauthorized' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all reports — admin sees all, manager sees own
const getAllReportsAdmin = async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? 'SELECT dr.*, u.name as manager_name FROM daily_reports dr JOIN users u ON dr.user_id = u.id ORDER BY dr.report_date DESC'
      : 'SELECT * FROM daily_reports WHERE user_id = $1 ORDER BY report_date DESC';

    const values = req.user.role === 'admin' ? [] : [req.user.id];
    const reports = await pool.query(query, values);

    res.status(200).json({ count: reports.rows.length, reports: reports.rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createReport, getAllReports, getAllReportsAdmin, getReportById, deleteReport };