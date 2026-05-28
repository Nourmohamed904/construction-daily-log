import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import './ReportForm.css';

const ReportForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    site_name: '',
    report_date: new Date().toISOString().split('T')[0],
    workers_present: '',
    tasks_completed: '',
    issues_encountered: '',
    weather_condition: 'Sunny',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createReport(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            ← Back
          </Button>
          <h2 className="form-title">📋 New Daily Report</h2>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input
              label="Site Name"
              type="text"
              name="site_name"
              placeholder="e.g. Cairo Tower Project"
              value={form.site_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Report Date"
              type="date"
              name="report_date"
              value={form.report_date}
              onChange={handleChange}
              required
            />
            <Input
              label="Workers Present"
              type="number"
              name="workers_present"
              placeholder="e.g. 45"
              value={form.workers_present}
              onChange={handleChange}
              required
            />
            <div className="input-group">
              <label className="input-label">Weather Condition</label>
              <select
                className="input-field"
                name="weather_condition"
                value={form.weather_condition}
                onChange={handleChange}
              >
                <option>Sunny</option>
                <option>Cloudy</option>
                <option>Rainy</option>
                <option>Windy</option>
                <option>Stormy</option>
              </select>
            </div>
          </div>

          <Input
            label="Tasks Completed"
            type="textarea"
            name="tasks_completed"
            placeholder="Describe what was completed today..."
            value={form.tasks_completed}
            onChange={handleChange}
            required
          />

          <Input
            label="Issues Encountered"
            optional
            type="textarea"
            name="issues_encountered"
            placeholder="Any problems, delays, or safety concerns?"
            value={form.issues_encountered}
            onChange={handleChange}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Submitting...' : '✓ Submit Report'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;