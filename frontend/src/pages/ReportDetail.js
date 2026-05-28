import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReportById, deleteReport } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import ConfirmModal from '../components/ConfirmModal';
import Button from '../components/Button';
import './ReportDetail.css';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getReportById(id);
        setReport(res.data.report);
      } catch (err) {
        console.error('Failed to fetch report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteReport(id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(26, 26, 46);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Construction Daily Report', 20, 22);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    const fields = [
      ['Site Name', report.site_name],
      ['Date', new Date(report.report_date).toLocaleDateString()],
      ['Workers Present', String(report.workers_present)],
      ['Weather', report.weather_condition || 'N/A'],
    ];
    let y = 50;
    fields.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label + ':', 20, y);
      doc.setFont(undefined, 'normal');
      doc.text(value, 80, y);
      y += 12;
    });
    y += 8;
    doc.setFont(undefined, 'bold');
    doc.text('Tasks Completed:', 20, y);
    y += 8;
    doc.setFont(undefined, 'normal');
    const tasks = doc.splitTextToSize(report.tasks_completed, 170);
    doc.text(tasks, 20, y);
    y += tasks.length * 7 + 10;
    if (report.issues_encountered) {
      doc.setFont(undefined, 'bold');
      doc.text('Issues Encountered:', 20, y);
      y += 8;
      doc.setFont(undefined, 'normal');
      const issues = doc.splitTextToSize(report.issues_encountered, 170);
      doc.text(issues, 20, y);
    }
    doc.save(`report-${report.site_name}-${report.report_date}.pdf`);
  };

  if (loading) return <div className="detail-loading">Loading report...</div>;
  if (!report) return <div className="detail-loading">Report not found.</div>;

  return (
    <div className="detail-container">
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this report? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="detail-card">
        <div className="detail-header">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            ← Back
          </Button>
          <h2 className="detail-title">📋 Report Detail</h2>
          <div className="detail-header-actions">
            <Button variant="primary" size="sm" onClick={exportPDF}>
              ⬇ PDF
            </Button>
            {user?.role === 'admin' && (
              <Button variant="danger" size="sm" onClick={() => setShowConfirm(true)}>
                🗑 Delete
              </Button>
            )}
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-field">
            <span className="detail-label">Site Name</span>
            <span className="detail-value">{report.site_name}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Date</span>
            <span className="detail-value">
              {new Date(report.report_date).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Workers Present</span>
            <span className="detail-value">👷 {report.workers_present}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Weather</span>
            <span className="detail-value">🌤 {report.weather_condition || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-section">
          <span className="detail-label">Tasks Completed</span>
          <p className="detail-text">{report.tasks_completed}</p>
        </div>

        {report.issues_encountered && (
          <div className="detail-section">
            <span className="detail-label">⚠ Issues Encountered</span>
            <p className="detail-text issue">{report.issues_encountered}</p>
          </div>
        )}

        <p className="detail-meta">
          Submitted on {new Date(report.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ReportDetail;