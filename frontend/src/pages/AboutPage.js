import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaDatabase, FaUserShield, FaCheckCircle } from 'react-icons/fa';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ color: 'white' }}>About AutoCheckr</h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)' }}>
            Providing transparent vehicle history information to help you make informed decisions
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '4rem 1rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="text-center mb-4">Our Mission</h2>
            <p style={{ fontSize: '1.125rem', textAlign: 'center' }}>
              AutoCheckr was created to provide accessible, comprehensive vehicle history reports
              that empower buyers and sellers with the information they need to make confident decisions.
              We believe transparency in the used vehicle market benefits everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '4rem 1rem', background: 'var(--light-bg)' }}>
        <div className="container">
          <h2 className="text-center mb-4">Our Values</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            <ValueCard 
              icon={<FaShieldAlt />}
              title="Accuracy"
              description="We compile information from multiple trusted data sources to provide the most complete picture possible."
            />
            <ValueCard 
              icon={<FaDatabase />}
              title="Transparency"
              description="We clearly indicate what data we have and don't have, never making false claims about a vehicle's history."
            />
            <ValueCard 
              icon={<FaUserShield />}
              title="Privacy"
              description="We protect your personal information and never sell your data to third parties."
            />
            <ValueCard 
              icon={<FaCheckCircle />}
              title="Reliability"
              description="Our reports are based on verified data sources and updated regularly to ensure accuracy."
            />
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section style={{ padding: '4rem 1rem' }}>
        <div className="container">
          <h2 className="text-center mb-4">How We're Different</h2>
          
          <div style={{ maxWidth: '800px', margin: '2rem auto 0' }}>
            <DifferenceItem 
              title="Honest Reporting"
              description="We never claim a vehicle is 'accident-free' just because we don't have records. We clearly state what we know and what we don't know."
            />
            <DifferenceItem 
              title="Fair Pricing"
              description="We offer competitive pricing with flexible packages to fit different needs, from individual buyers to dealerships."
            />
            <DifferenceItem 
              title="User-Friendly Reports"
              description="Our reports are designed to be easy to understand, with clear explanations and no confusing jargon."
            />
            <DifferenceItem 
              title="Customer Support"
              description="We provide real human support to answer your questions and help you understand your report."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ 
        padding: '4rem 1rem', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ color: 'white' }}>Start Your Vehicle Search Today</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.25rem', marginBottom: '2rem' }}>
            Join thousands of satisfied customers who trust AutoCheckr for their vehicle history needs
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

const ValueCard = ({ icon, title, description }) => (
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

const DifferenceItem = ({ title, description }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h4>{title}</h4>
    <p style={{ color: 'var(--text-light)' }}>{description}</p>
  </div>
);

export default AboutPage;
