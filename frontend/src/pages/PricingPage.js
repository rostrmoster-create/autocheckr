import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { paymentAPI } from '../services/api';
import { FaCheck } from 'react-icons/fa';

const PricingPage = () => {
  const [searchParams] = useSearchParams();
  const [products] = useState([
    {
      id: '1',
      name: 'Single Report',
      description: 'One complete vehicle history report',
      price: 19.99,
      reportCredits: 1,
      features: [
        'Full vehicle history',
        'Accident & damage records',
        'Title information',
        'Ownership history',
        'Service records',
        'Recall information',
        'Printable report',
        'PDF download'
      ]
    },
    {
      id: '2',
      name: '3 Reports',
      description: 'Three vehicle history reports',
      price: 39.99,
      reportCredits: 3,
      features: [
        'All features from Single Report',
        'Best for comparing multiple vehicles',
        'Save $20 compared to single reports',
        'Reports never expire',
        'Priority support'
      ],
      featured: true
    },
    {
      id: '3',
      name: '5 Reports',
      description: 'Five vehicle history reports',
      price: 49.99,
      reportCredits: 5,
      features: [
        'All features from Single Report',
        'Best value for dealers',
        'Save $50 compared to single reports',
        'Reports never expire',
        'Priority support',
        'Bulk download options'
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const vehicleId = searchParams.get('vehicleId');

  const handlePurchase = async (product) => {
    if (!user) {
      const redirect = vehicleId 
        ? `/pricing?vehicleId=${vehicleId}`
        : '/pricing';
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }

    setLoading(true);
    setSelectedProduct(product.id);

    try {
      const response = await paymentAPI.createCheckout(product.id);
      window.location.href = response.data.url;
    } catch (error) {
      alert('Unable to process payment. Please try again.');
      setLoading(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div style={{ padding: '4rem 1rem', background: 'var(--light-bg)', minHeight: '80vh' }}>
      <div className="container">
        <div className="text-center mb-4">
          <h1>Choose Your Plan</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-light)' }}>
            Select the package that best fits your needs
          </p>
        </div>

        <div className="pricing-grid">
          {products.map(product => (
            <div 
              key={product.id} 
              className={`pricing-card ${product.featured ? 'featured' : ''}`}
            >
              {product.featured && (
                <div style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  marginBottom: '1rem',
                  fontWeight: '600'
                }}>
                  MOST POPULAR
                </div>
              )}
              
              <h3>{product.name}</h3>
              <p style={{ color: 'var(--text-light)', minHeight: '3rem' }}>
                {product.description}
              </p>
              
              <div className="pricing-price">
                ${product.price}
              </div>
              
              <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                {product.reportCredits} {product.reportCredits === 1 ? 'report' : 'reports'}
              </p>

              <ul className="pricing-features">
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <FaCheck style={{ color: 'var(--secondary-color)', marginRight: '0.5rem' }} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(product)}
                disabled={loading && selectedProduct === product.id}
                className={`btn btn-large ${product.featured ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', marginTop: '2rem' }}
              >
                {loading && selectedProduct === product.id ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h3>100% Money-Back Guarantee</h3>
          <p>
            If you're not satisfied with your report, contact us within 7 days for a full refund.
            No questions asked.
          </p>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2 className="text-center mb-4">Frequently Asked Questions</h2>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <FAQItem 
              question="How long do report credits last?"
              answer="Report credits never expire. Use them whenever you need them."
            />
            <FAQItem 
              question="Can I get a refund?"
              answer="Yes! We offer a 100% money-back guarantee within 7 days of purchase if you're not satisfied."
            />
            <FAQItem 
              question="What information is included in the report?"
              answer="Our reports include accident history, title information, ownership history, mileage records, service history, recall information, and more based on available data sources."
            />
            <FAQItem 
              question="How quickly will I receive my report?"
              answer="Reports are generated instantly after purchase. You can view, download, and print them immediately."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card" style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
      <div className="flex-between">
        <h4 style={{ marginBottom: 0 }}>{question}</h4>
        <span style={{ fontSize: '1.5rem' }}>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <p style={{ marginTop: '1rem', marginBottom: 0 }}>
          {answer}
        </p>
      )}
    </div>
  );
};

export default PricingPage;
