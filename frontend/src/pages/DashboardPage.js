import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { reportAPI } from '../services/api';
import { FaFileAlt, FaDownload, FaEye, FaCreditCard } from 'react-icons/fa';

const DashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getAll();
      setReports(response.data.reports);
    } catch (err) {
      setError('Unable to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--light-bg)', minHeight: '80vh', padding: '2rem 1rem' }}>
      <div className="container">
        <h1>My Dashboard</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                background: 'var(--primary-color)', 
                color: 'white',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                <FaFileAlt />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                  {reports.filter(r => r.reportType === 'full_report').length}
                </div>
                <div style={{ color: 'var(--text-light)' }}>Total Reports</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                background: 'var(--secondary-color)', 
                color: 'white',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                <FaCreditCard />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary-color)' }}>
                  {user?.reportCredits || 0}
                </div>
                <div style={{ color: 'var(--text-light)' }}>Available Credits</div>
              </div>
            </div>
          </div>

          <div className="card">
            <button 
              onClick={() => navigate('/pricing')}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Buy More Credits
            </button>
            <button 
              onClick={() => navigate('/vin-check')}
              className="btn btn-outline mt-2"
              style={{ width: '100%' }}
            >
              Check New VIN
            </button>
          </div>
        </div>

        <div className="card mt-4">
          <h3>Account Information</h3>
          <div className="report-item">
            <div className="report-label">Name</div>
            <div className="report-value">{user?.firstName} {user?.lastName}</div>
          </div>
          <div className="report-item">
            <div className="report-label">Email</div>
            <div className="report-value">{user?.email}</div>
          </div>
        </div>

        <div className="card mt-4">
          <h3>My Reports</h3>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          {reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <FaFileAlt style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
              <h4>No Reports Yet</h4>
              <p style={{ color: 'var(--text-light)' }}>
                Check your first VIN to get started
              </p>
              <button 
                onClick={() => navigate('/vin-check')}
                className="btn btn-primary mt-3"
              >
                Check a VIN
              </button>
            </div>
          ) : (
            <div className="table">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>VIN</th>
                    <th>Vehicle</th>
                    <th>Report Type</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(report => (
                    <tr key={report.id}>
                      <td style={{ fontFamily: 'monospace' }}>{report.vehicle.vin}</td>
                      <td>
                        {report.vehicle.year} {report.vehicle.make} {report.vehicle.model}
                      </td>
                      <td>
                        <span className={`badge ${report.reportType === 'full_report' ? 'badge-success' : 'badge-info'}`}>
                          {report.reportType === 'full_report' ? 'Full Report' : 'Preview'}
                        </span>
                      </td>
                      <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {report.reportType === 'full_report' && (
                            <>
                              <button 
                                onClick={() => navigate(`/report/${report.id}`)}
                                className="btn btn-small btn-primary"
                                title="View Report"
                              >
                                <FaEye />
                              </button>
                              <button 
                                onClick={() => alert('Download functionality')}
                                className="btn btn-small btn-outline"
                                title="Download PDF"
                              >
                                <FaDownload />
                              </button>
                            </>
                          )}
                          {report.reportType === 'free_preview' && (
                            <button 
                              onClick={() => navigate('/pricing')}
                              className="btn btn-small btn-primary"
                            >
                              Unlock Full Report
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
