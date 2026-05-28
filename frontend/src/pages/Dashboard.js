import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllReports, deleteReport } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import Button from '../components/Button';
import './Dashboard.css';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchReports(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      reports.filter(r =>
        r.site_name.toLowerCase().includes(q) ||
        r.weather_condition?.toLowerCase().includes(q) ||
        (r.manager_name && r.manager_name.toLowerCase().includes(q))
      )
    );
  }, [search, reports]);

  const fetchReports = async () => {
    try {
      const res = await getAllReports();
      setReports(res.data.reports);
      setFiltered(res.data.reports);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReport(deleteId);
      setReports(prev => prev.filter(r => r.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="dash-container">
      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this report? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <header className="dash-header">
        <div className="dash-header-left">
          <span className="dash-logo">🏗️</span>
          <span className="dash-brand">Construction Daily Log</span>
        </div>
        <div className="dash-header-right">
          {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
          <span className="dash-welcome">👤 {user?.name}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-stats">
          <div className="stat-card">
            <span className="stat-number">{reports.length}</span>
            <span className="stat-label">Total Reports</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {reports.reduce((sum, r) => sum + Number(r.workers_present), 0)}
            </span>
            <span className="stat-label">Total Workers Logged</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {reports.filter(r => r.issues_encountered).length}
            </span>
            <span className="stat-label">Reports with Issues</span>
          </div>
        </div>

        <div className="dash-topbar">
          <h2 className="dash-title">
            {user?.role === 'admin' ? 'All Reports' : 'My Reports'}
          </h2>
          <Button variant="primary" size="md" onClick={() => navigate('/report/new')}>
            + New Report
          </Button>
        </div>

        <div className="dash-search">
          <input
            type="text"
            placeholder="🔍 Search by site name or weather..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="dash-empty">Loading reports...</div>
        ) : filtered.length === 0 ? (
          <div className="dash-empty">
            <p>📋 No reports found.</p>
            {search && <p>Try a different search term.</p>}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Site Name</th>
                    {user?.role === 'admin' && <th>Manager</th>}
                    <th>Workers</th>
                    <th>Weather</th>
                    <th>Issues</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((report) => (
                    <tr key={report.id}>
                      <td>{new Date(report.report_date).toLocaleDateString()}</td>
                      <td>{report.site_name}</td>
                      {user?.role === 'admin' && <td>{report.manager_name}</td>}
                      <td>{report.workers_present}</td>
                      <td>{report.weather_condition || '-'}</td>
                      <td>
                        {report.issues_encountered
                          ? <span className="badge-issue">⚠ Yes</span>
                          : <span className="badge-ok">✓ None</span>}
                      </td>
                      <td className="td-actions">
                        <Button variant="ghost" size="sm"
                          onClick={() => navigate(`/report/${report.id}`)}>
                          View
                        </Button>
                        {user?.role === 'admin' && (
                          <Button variant="danger" size="sm"
                            onClick={() => setDeleteId(report.id)}>
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="dash-cards">
              {filtered.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-card-top">
                    <span className="report-card-site">{report.site_name}</span>
                    <span className="report-card-date">
                      {new Date(report.report_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="report-card-bottom">
                    <span>👷 {report.workers_present}</span>
                    <span>🌤 {report.weather_condition || 'N/A'}</span>
                    {report.issues_encountered
                      ? <span className="badge-issue">⚠ Issues</span>
                      : <span className="badge-ok">✓ No issues</span>}
                    {user?.role === 'admin' && report.manager_name &&
                      <span>👤 {report.manager_name}</span>}
                  </div>
                  <div className="report-card-actions">
                    <Button variant="ghost" size="sm"
                      onClick={() => navigate(`/report/${report.id}`)}>
                      View
                    </Button>
                    {user?.role === 'admin' && (
                      <Button variant="danger" size="sm"
                        onClick={() => setDeleteId(report.id)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;