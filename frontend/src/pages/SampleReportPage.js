import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaDownload } from 'react-icons/fa';

const SampleReportPage = () => {
  const navigate = useNavigate();

  const sampleData = {
    vehicle: {
      vin: '1HGBH41JXMN109186',
      year: 2020,
      make: 'Honda',
      model: 'Accord',
      trim: 'EX-L',
      bodyStyle: 'Sedan',
      vehicleType: 'Passenger Car',
      engine: '1.5L Turbo I4',
      transmission: 'CVT Automatic',
      fuelType: 'Gasoline',
      drivetrain: 'FWD',
      countryOfManufacture: 'USA'
    },
    mileageHistory: [
      { date: '2023-06-15', mileage: 35000, source: 'Service Record' },
      { date: '2022-12-10', mileage: 28000, source: 'State Inspection' },
      { date: '2022-06-05', mileage: 21000, source: 'Service Record' },
      { date: '2021-12-01', mileage: 14000, source: 'Service Record' }
    ],
    titleHistory: [
      {
        date: '2020-03-15',
        event: 'Original Title',
        state: 'CA',
        titleBrand: 'Clean'
      }
    ],
    ownershipHistory: {
      numberOfOwners: 1,
      records: [
        { startDate: '2020-03-15', state: 'CA', type: 'Personal' }
      ]
    },
    serviceHistory: [
      { date: '2023-06-15', mileage: 35000, type: 'Oil Change & Tire Rotation', location: 'Honda Dealer' },
      { date: '2023-03-10', mileage: 32000, type: 'Brake Inspection', location: 'Honda Dealer' },
      { date: '2022-12-05', mileage: 28000, type: 'Oil Change', location: 'Quick Lube' }
    ]
  };

  return (
    <div style={{ background: 'var(--light-bg)', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container">
        <div className="alert alert-info">
          <strong>Sample Report</strong> - This is an example of what a full AutoCheckr vehicle history report looks like.
          Real reports contain actual vehicle data when available.
        </div>

        {/* Report Header */}
        <div className="card">
          <div className="flex-between">
            <div>
              <h1>Vehicle History Report</h1>
              <p className="text-light">Sample Report - For Demonstration Only</p>
            </div>
            <button className="btn btn-primary">
              <FaDownload style={{ marginRight: '0.5rem' }} />
              Download Sample PDF
            </button>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="report-section">
          <h3>Vehicle Information</h3>
          
          <div className="report-item">
            <div className="report-label">VIN</div>
            <div className="report-value" style={{ fontFamily: 'monospace', fontWeight: '600' }}>
              {sampleData.vehicle.vin}
            </div>
          </div>

          <div className="report-item">
            <div className="report-label">Year / Make / Model</div>
            <div className="report-value">
              {sampleData.vehicle.year} {sampleData.vehicle.make} {sampleData.vehicle.model} {sampleData.vehicle.trim}
            </div>
          </div>

          <div className="report-item">
            <div className="report-label">Body Style</div>
            <div className="report-value">{sampleData.vehicle.bodyStyle}</div>
          </div>

          <div className="report-item">
            <div className="report-label">Engine</div>
            <div className="report-value">{sampleData.vehicle.engine}</div>
          </div>

          <div className="report-item">
            <div className="report-label">Transmission</div>
            <div className="report-value">{sampleData.vehicle.transmission}</div>
          </div>

          <div className="report-item">
            <div className="report-label">Drivetrain</div>
            <div className="report-value">{sampleData.vehicle.drivetrain}</div>
          </div>
        </div>

        {/* Accident History */}
        <div className="report-section">
          <h3>Accident & Damage History</h3>
          <div className="flex-center" style={{ padding: '2rem', background: 'var(--light-bg)', borderRadius: '0.5rem' }}>
            <FaCheckCircle style={{ color: 'var(--secondary-color)', fontSize: '2rem', marginRight: '1rem' }} />
            <div>
              <strong>No records available from the data sources checked.</strong>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                This does not guarantee the vehicle has never been in an accident.
              </p>
            </div>
          </div>
        </div>

        {/* Mileage History */}
        <div className="report-section">
          <h3>Mileage History</h3>
          {sampleData.mileageHistory.map((record, index) => (
            <div key={index} className="report-item">
              <div className="report-label">{new Date(record.date).toLocaleDateString()}</div>
              <div className="report-value">
                <strong>{record.mileage.toLocaleString()} miles</strong>
                <span style={{ marginLeft: '1rem', color: 'var(--text-light)' }}>
                  ({record.source})
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Title History */}
        <div className="report-section">
          <h3>Title History</h3>
          <div className="card">
            <div className="flex-between mb-2">
              <strong>Title Event #1</strong>
              <span className="badge badge-success">Clean</span>
            </div>
            
            <div className="report-item">
              <div className="report-label">Date</div>
              <div className="report-value">{new Date(sampleData.titleHistory[0].date).toLocaleDateString()}</div>
            </div>
            
            <div className="report-item">
              <div className="report-label">State</div>
              <div className="report-value">{sampleData.titleHistory[0].state}</div>
            </div>
            
            <div className="report-item">
              <div className="report-label">Event</div>
              <div className="report-value">{sampleData.titleHistory[0].event}</div>
            </div>
          </div>
        </div>

        {/* Ownership */}
        <div className="report-section">
          <h3>Ownership History</h3>
          <div className="card" style={{ background: 'var(--light-bg)' }}>
            <h4>Number of Owners: {sampleData.ownershipHistory.numberOfOwners}</h4>
          </div>
        </div>

        {/* Service History */}
        <div className="report-section">
          <h3>Service Records</h3>
          <div className="table">
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mileage</th>
                  <th>Service Type</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.serviceHistory.map((service, index) => (
                  <tr key={index}>
                    <td>{new Date(service.date).toLocaleDateString()}</td>
                    <td>{service.mileage.toLocaleString()}</td>
                    <td>{service.type}</td>
                    <td>{service.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <h3 style={{ color: 'white' }}>Ready to Check Your Vehicle?</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Get a comprehensive vehicle history report with real data for any vehicle.
          </p>
          <button 
            onClick={() => navigate('/vin-check')}
            className="btn btn-large"
            style={{ background: 'white', color: 'var(--primary-color)', marginTop: '1rem' }}
          >
            Check a VIN Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SampleReportPage;
