import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vinAPI } from '../services/api';
import { 
  FaClipboardCheck, 
  FaTachometerAlt, 
  FaCertificate, 
  FaUsers,
  FaTools,
  FaExclamationTriangle 
} from 'react-icons/fa';

const HomePage = () => {
  const [vin, setVin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await vinAPI.validate(vin);
      if (response.data.success) {
        navigate(`/vin-check?vin=${response.data.vin}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid VIN');
    } finally {
      setLoading(false);
    }
  };

  const handleVinChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
    if (value.length <= 17) {
      setVin(value);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Know the History Before You Buy</h1>
          <p>
            Check a vehicle's history using its VIN and make a more informed purchase.
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
                {loading ? 'Checking...' : 'Check VIN'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 1rem', background: 'var(--light-bg)' }}>
        <div className="container">
          <h2 className="text-center mb-4">What's Included in Our Reports</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            <FeatureCard 
              icon={<FaClipboardCheck />}
              title="Accident & Damage History"
              description="View reported accidents, damage records, and severity when available."
            />
            <FeatureCard 
              icon={<FaTachometerAlt />}
              title="Mileage History"
              description="Track odometer readings over time and identify potential rollback."
            />
            <FeatureCard 
              icon={<FaCertificate />}
              title="Title Information"
              description="Check for salvage, rebuilt, flood, or other title brands."
            />
            <FeatureCard 
              icon={<FaUsers />}
              title="Ownership History"
              description="See the number of previous owners and ownership timeline."
            />
            <FeatureCard 
              icon={<FaTools />}
              title="Service Records"
              description="View reported maintenance and service history."
            />
            <FeatureCard 
              icon={<FaExclamationTriangle />}
              title="Recall Information"
              description="Check for open recalls and safety information."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '4rem 1rem' }}>
        <div className="container">
          <h2 className="text-center mb-4">How It Works</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            <StepCard 
              number="1"
              title="Enter VIN"
              description="Provide the 17-character Vehicle Identification Number."
            />
            <StepCard 
              number="2"
              title="Review Vehicle Information"
              description="See basic vehicle details and a free preview."
            />
            <StepCard 
              number="3"
              title="Purchase Full Report"
              description="Choose a package and unlock the complete history."
            />
            <StepCard 
              number="4"
              title="Get Your Report"
              description="Access, download, and print your detailed report."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '4rem 1rem', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ color: 'white' }}>Ready to Check a Vehicle?</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.25rem', marginBottom: '2rem' }}>
            Get started with a comprehensive vehicle history report today.
          </p>
          <button 
            onClick={() => navigate('/vin-check')}
            className="btn btn-large"
            style={{ background: 'white', color: 'var(--primary-color)' }}
          >
            Check a VIN Now
          </button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="card" style={{ textAlign: 'center' }}>
    <div style={{ 
      fontSize: '3rem', 
      color: 'var(--primary-color)', 
      marginBottom: '1rem' 
    }}>
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ 
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'var(--primary-color)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: '700',
      margin: '0 auto 1rem'
    }}>
      {number}
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default HomePage;
