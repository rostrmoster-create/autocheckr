import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { vinAPI } from '../services/api';

const VinCheckPage = () => {
  const [searchParams] = useSearchParams();
  const [vin, setVin] = useState(searchParams.get('vin') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const vinParam = searchParams.get('vin');
    if (vinParam) {
      setVin(vinParam);
      handleSearch(vinParam);
    }
  }, [searchParams]);

  const handleSearch = async (vinToSearch = vin) => {
    if (!user) {
      navigate('/login?redirect=/vin-check?vin=' + vinToSearch);
      return;
    }

    setError('');
    setLoading(true);
    setVehicleData(null);

    try {
      const response = await vinAPI.search(vinToSearch);
      setVehicleData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to retrieve vehicle information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleVinChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
    if (value.length <= 17) {
      setVin(value);
    }
  };

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '70vh', background: 'var(--light-bg)' }}>
      <div className="container">
        <h1 className="text-center">VIN Lookup</h1>
        <p className="text-center mb-4">
          Enter a 17-character VIN to retrieve vehicle information
        </p>

        <div className="vin-input-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="vin-input"
              placeholder="Enter 17-character VIN"
              value={vin}
              onChange={handleVinChange}
              maxLength="17"
            />
            <div className="vin-example">
              Example: 1HGBH41JXMN109186
            </div>
            {error && <div className="alert alert-error mt-2">{error}</div>}
            <button 
              type="submit" 
              className="btn btn-primary btn-large" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading || vin.length !== 17}
            >
              {loading ? 'Searching...' : 'Search VIN'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center mt-4">
            <div className="spinner"></div>
            <p>Retrieving vehicle information...</p>
          </div>
        )}

        {vehicleData && (
          <div style={{ marginTop: '3rem' }}>
            {vehicleData.vehicle._isMockData && (
              <div className="alert alert-warning">
                <strong>Development Mode:</strong> This is mock data for demonstration purposes only.
                In production, this will be replaced with real vehicle history data.
              </div>
            )}

            <VehiclePreview 
              vehicle={vehicleData.vehicle} 
              hasFullReport={vehicleData.hasFullReport}
              reportId={vehicleData.reportId}
              navigate={navigate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const VehiclePreview = ({ vehicle, hasFullReport, reportId, navigate }) => {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Vehicle Found</h2>
        </div>
        
        <div className="report-item">
          <div className="report-label">VIN</div>
          <div className="report-value" style={{ fontFamily: 'monospace', fontWeight: '600' }}>
            {vehicle.vin}
          </div>
        </div>

        <div className="report-item">
          <div className="report-label">Year</div>
          <div className="report-value">{vehicle.year}</div>
        </div>

        <div className="report-item">
          <div className="report-label">Make</div>
          <div className="report-value">{vehicle.make}</div>
        </div>

        <div className="report-item">
          <div className="report-label">Model</div>
          <div className="report-value">{vehicle.model}</div>
        </div>

        {vehicle.trim && (
          <div className="report-item">
            <div className="report-label">Trim</div>
            <div className="report-value">{vehicle.trim}</div>
          </div>
        )}

        <div className="report-item">
          <div className="report-label">Body Style</div>
          <div className="report-value">{vehicle.bodyStyle || 'N/A'}</div>
        </div>

        <div className="report-item">
          <div className="report-label">Vehicle Type</div>
          <div className="report-value">{vehicle.vehicleType || 'N/A'}</div>
        </div>
      </div>

      {hasFullReport ? (
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate(`/report/${reportId}`)}
            className="btn btn-primary btn-large"
          >
            View Your Full Report
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'white' }}>Full Vehicle History Available</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Unlock the complete vehicle history report including accidents, title history,
              ownership records, service history, and more.
            </p>
            <button 
              onClick={() => navigate('/pricing?vehicleId=' + vehicle.id)}
              className="btn btn-large"
              style={{ background: 'white', color: 'var(--primary-color)', marginTop: '1rem' }}
            >
              Unlock Full Report
            </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <LockedSection title="Accident & Damage History" />
            <LockedSection title="Mileage History" />
            <LockedSection title="Title Information" />
            <LockedSection title="Ownership History" />
            <LockedSection title="Service Records" />
            <LockedSection title="Recall Information" />
          </div>
        </div>
      )}
    </div>
  );
};

const LockedSection = ({ title }) => (
  <div className="card" style={{ opacity: 0.6, position: 'relative' }}>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '2rem'
    }}>
      🔒
    </div>
    <h4>{title}</h4>
    <p style={{ color: 'var(--text-light)' }}>
      Full information available in the complete report
    </p>
  </div>
);

export default VinCheckPage;
