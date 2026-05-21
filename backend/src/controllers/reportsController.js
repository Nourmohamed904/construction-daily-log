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
    const report = await pool.query(
      'SELECT * FROM daily_reports WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (report.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ report: report.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createReport, getAllReports, getReportById };