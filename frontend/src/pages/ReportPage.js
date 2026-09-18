import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportAPI } from '../services/api';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle,
  FaDownload,
  FaPrint 
} from 'react-icons/fa';

const ReportPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await reportAPI.get(id);
      setReport(response.data.report);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load report');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('PDF download functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className="alert alert-error">{error}</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-3">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div style={{ background: 'var(--light-bg)', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container">
        {report._isMockData && (
          <div className="alert alert-warning no-print">
            <strong>Development Mode:</strong> This report contains mock data for demonstration purposes only.
          </div>
        )}

        {/* Report Header */}
        <div className="card">
          <div className="flex-between">
            <div>
              <h1>Vehicle History Report</h1>
              <p className="text-light">
                Report Date: {new Date(report.purchaseDate).toLocaleDateString()}
              </p>
            </div>
            <div className="no-print" style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handlePrint} className="btn btn-outline">
                <FaPrint style={{ marginRight: '0.5rem' }} />
                Print
              </button>
              <button onClick={handleDownload} className="btn btn-primary">
                <FaDownload style={{ marginRight: '0.5rem' }} />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="report-section">
          <h3>Vehicle Information</h3>
          
          <div className="report-item">
            <div className="report-label">VIN</div>
            <div className="report-value" style={{ fontFamily: 'monospace', fontWeight: '600' }}>
              {report.vehicle.vin}
            </div>
          </div>

          <div className="report-item">
            <div className="report-label">Year / Make / Model</div>
            <div className="report-value">
              {report.vehicle.year} {report.vehicle.make} {report.vehicle.model}
            </div>
          </div>

          {report.vehicle.trim && (
            <div className="report-item">
              <div className="report-label">Trim</div>
              <div className="report-value">{report.vehicle.trim}</div>
            </div>
          )}

          <div className="report-item">
            <div className="report-label">Body Style</div>
            <div className="report-value">{report.vehicle.bodyStyle || 'N/A'}</div>
          </div>

          <div className="report-item">
            <div className="report-label">Vehicle Type</div>
            <div className="report-value">{report.vehicle.vehicleType || 'N/A'}</div>
          </div>

          {report.vehicle.engine && (
            <div className="report-item">
              <div className="report-label">Engine</div>
              <div className="report-value">{report.vehicle.engine}</div>
            </div>
          )}

          {report.vehicle.transmission && (
            <div className="report-item">
              <div className="report-label">Transmission</div>
              <div className="report-value">{report.vehicle.transmission}</div>
            </div>
          )}

          {report.vehicle.fuelType && (
            <div className="report-item">
              <div className="report-label">Fuel Type</div>
              <div className="report-value">{report.vehicle.fuelType}</div>
            </div>
          )}

          {report.vehicle.drivetrain && (
            <div className="report-item">
              <div className="report-label">Drivetrain</div>
              <div className="report-value">{report.vehicle.drivetrain}</div>
            </div>
          )}

          {report.vehicle.countryOfManufacture && (
            <div className="report-item">
              <div className="report-label">Country of Manufacture</div>
              <div className="report-value">{report.vehicle.countryOfManufacture}</div>
            </div>
          )}
        </div>

        {/* Accident & Damage History */}
        <AccidentSection accidents={report.history?.accidentRecords || []} />

        {/* Mileage History */}
        <MileageSection mileage={report.history?.mileageHistory || []} />

        {/* Title History */}
        <TitleSection titles={report.history?.titleHistory || []} />

        {/* Ownership History */}
        <OwnershipSection ownership={report.history?.ownershipHistory} />

        {/* Service History */}
        <ServiceSection services={report.history?.serviceHistory || []} />

        {/* Recalls */}
        <RecallSection recalls={report.history?.recalls || []} />

        {/* Theft Records */}
        <TheftSection thefts={report.history?.theftRecords || []} />

        {/* Vehicle Specifications */}
        {report.vehicle.specifications && (
          <SpecificationsSection specs={report.vehicle.specifications} />
        )}

        {/* Disclaimer */}
        <div className="card" style={{ marginTop: '2rem', background: 'var(--light-bg)' }}>
          <h4>Important Information</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
            This report is based on information available from data sources checked at the time of report generation.
            AutoCheckr compiles information from various sources, but cannot guarantee the completeness or accuracy 
            of all information. The absence of information does not mean that an event did not occur. This report 
            should be used as one tool in the vehicle evaluation process. We recommend having the vehicle inspected 
            by a qualified mechanic before purchase.
          </p>
        </div>
      </div>
    </div>
  );
};

const AccidentSection = ({ accidents }) => (
  <div className="report-section">
    <h3>Accident & Damage History</h3>
    
    {accidents.length === 0 ? (
      <div className="flex-center" style={{ padding: '2rem', background: 'var(--light-bg)', borderRadius: '0.5rem' }}>
        <FaCheckCircle style={{ color: 'var(--secondary-color)', fontSize: '2rem', marginRight: '1rem' }} />
        <div>
          <strong>No records available from the data sources checked.</strong>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            This does not guarantee the vehicle has never been in an accident.
          </p>
        </div>
      </div>
    ) : (
      <div>
        {accidents.map((accident, index) => (
          <div key={index} className="card" style={{ marginBottom: '1rem' }}>
            <div className="flex-between mb-2">
              <strong>Accident #{index + 1}</strong>
              {accident.severity && (
                <span className={`badge ${getSeverityBadgeClass(accident.severity)}`}>
                  {accident.severity}
                </span>
              )}
            </div>
            
            {accident.date && (
              <div className="report-item">
                <div className="report-label">Date</div>
                <div className="report-value">{new Date(accident.date).toLocaleDateString()}</div>
              </div>
            )}
            
            {accident.location && (
              <div className="report-item">
                <div className="report-label">Location</div>
                <div className="report-value">{accident.location}</div>
              </div>
            )}
            
            {accident.description && (
              <div className="report-item">
                <div className="report-label">Description</div>
                <div className="report-value">{accident.description}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const MileageSection = ({ mileage }) => (
  <div className="report-section">
    <h3>Mileage History</h3>
    
    {mileage.length === 0 ? (
      <p>No mileage records available from the data sources checked.</p>
    ) : (
      <div>
        <div style={{ marginTop: '2rem' }}>
          {mileage.map((record, index) => (
            <div key={index} className="report-item">
              <div className="report-label">{new Date(record.date).toLocaleDateString()}</div>
              <div className="report-value">
                <strong>{record.mileage.toLocaleString()} miles</strong>
                {record.source && <span style={{ marginLeft: '1rem', color: 'var(--text-light)' }}>
                  ({record.source})
                </span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const TitleSection = ({ titles }) => (
  <div className="report-section">
    <h3>Title History</h3>
    
    {titles.length === 0 ? (
      <div className="flex-center" style={{ padding: '2rem', background: 'var(--light-bg)', borderRadius: '0.5rem' }}>
        <FaCheckCircle style={{ color: 'var(--secondary-color)', fontSize: '2rem', marginRight: '1rem' }} />
        <div>
          <strong>No title issues found in the data sources checked.</strong>
        </div>
      </div>
    ) : (
      <div>
        {titles.map((title, index) => (
          <div key={index} className="card" style={{ marginBottom: '1rem' }}>
            <div className="flex-between mb-2">
              <strong>Title Event #{index + 1}</strong>
              <span className={`badge ${getTitleBadgeClass(title.titleBrand)}`}>
                {title.titleBrand || 'Unknown'}
              </span>
            </div>
            
            {title.date && (
              <div className="report-item">
                <div className="report-label">Date</div>
                <div className="report-value">{new Date(title.date).toLocaleDateString()}</div>
              </div>
            )}
            
            {title.state && (
              <div className="report-item">
                <div className="report-label">State</div>
                <div className="report-value">{title.state}</div>
              </div>
            )}
            
            {title.event && (
              <div className="report-item">
                <div className="report-label">Event</div>
                <div className="report-value">{title.event}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const OwnershipSection = ({ ownership }) => (
  <div className="report-section">
    <h3>Ownership History</h3>
    
    {!ownership || ownership.numberOfOwners === 0 ? (
      <p>No ownership records available from the data sources checked.</p>
    ) : (
      <div>
        <div className="card" style={{ marginBottom: '1rem', background: 'var(--light-bg)' }}>
          <h4>Number of Owners: {ownership.numberOfOwners}</h4>
        </div>
        
        {ownership.records && ownership.records.map((owner, index) => (
          <div key={index} className="card" style={{ marginBottom: '1rem' }}>
            <strong>Owner #{index + 1}</strong>
            
            {owner.startDate && (
              <div className="report-item">
                <div className="report-label">Ownership Period</div>
                <div className="report-value">
                  {new Date(owner.startDate).toLocaleDateString()}
                  {owner.endDate && ` - ${new Date(owner.endDate).toLocaleDateString()}`}
                  {!owner.endDate && ' - Present'}
                </div>
              </div>
            )}
            
            {owner.state && (
              <div className="report-item">
                <div className="report-label">Location</div>
                <div className="report-value">{owner.state}</div>
              </div>
            )}
            
            {owner.type && (
              <div className="report-item">
                <div className="report-label">Use Type</div>
                <div className="report-value">{owner.type}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const ServiceSection = ({ services }) => (
  <div className="report-section">
    <h3>Service Records</h3>
    
    {services.length === 0 ? (
      <p>No service records available from the data sources checked.</p>
    ) : (
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
            {services.map((service, index) => (
              <tr key={index}>
                <td>{new Date(service.date).toLocaleDateString()}</td>
                <td>{service.mileage ? service.mileage.toLocaleString() : 'N/A'}</td>
                <td>{service.type}</td>
                <td>{service.location || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const RecallSection = ({ recalls }) => (
  <div className="report-section">
    <h3>Recall Information</h3>
    
    {recalls.length === 0 ? (
      <div className="flex-center" style={{ padding: '2rem', background: 'var(--light-bg)', borderRadius: '0.5rem' }}>
        <FaCheckCircle style={{ color: 'var(--secondary-color)', fontSize: '2rem', marginRight: '1rem' }} />
        <div>
          <strong>No open recalls found.</strong>
        </div>
      </div>
    ) : (
      <div>
        {recalls.map((recall, index) => (
          <div key={index} className="card" style={{ 
            marginBottom: '1rem',
            borderLeft: '4px solid var(--warning-color)' 
          }}>
            <div className="flex-between mb-2">
              <strong>Recall #{recall.recallNumber || index + 1}</strong>
              <span className={`badge ${recall.status === 'Open' ? 'badge-warning' : 'badge-success'}`}>
                {recall.status || 'Unknown'}
              </span>
            </div>
            
            {recall.date && (
              <div className="report-item">
                <div className="report-label">Date Issued</div>
                <div className="report-value">{new Date(recall.date).toLocaleDateString()}</div>
              </div>
            )}
            
            {recall.manufacturer && (
              <div className="report-item">
                <div className="report-label">Manufacturer</div>
                <div className="report-value">{recall.manufacturer}</div>
              </div>
            )}
            
            {recall.description && (
              <div className="report-item">
                <div className="report-label">Description</div>
                <div className="report-value">{recall.description}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const TheftSection = ({ thefts }) => (
  <div className="report-section">
    <h3>Theft / Recovery Records</h3>
    
    {thefts.length === 0 ? (
      <div className="flex-center" style={{ padding: '2rem', background: 'var(--light-bg)', borderRadius: '0.5rem' }}>
        <FaCheckCircle style={{ color: 'var(--secondary-color)', fontSize: '2rem', marginRight: '1rem' }} />
        <div>
          <strong>No theft records found in the data sources checked.</strong>
        </div>
      </div>
    ) : (
      <div>
        {thefts.map((theft, index) => (
          <div key={index} className="card" style={{ 
            marginBottom: '1rem',
            borderLeft: '4px solid var(--danger-color)' 
          }}>
            <strong>Theft Record #{index + 1}</strong>
            
            {theft.date && (
              <div className="report-item">
                <div className="report-label">Date</div>
                <div className="report-value">{new Date(theft.date).toLocaleDateString()}</div>
              </div>
            )}
            
            {theft.status && (
              <div className="report-item">
                <div className="report-label">Status</div>
                <div className="report-value">{theft.status}</div>
              </div>
            )}
            
            {theft.location && (
              <div className="report-item">
                <div className="report-label">Location</div>
                <div className="report-value">{theft.location}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const SpecificationsSection = ({ specs }) => (
  <div className="report-section">
    <h3>Vehicle Specifications</h3>
    
    {Object.entries(specs).map(([key, value]) => (
      value && (
        <div key={key} className="report-item">
          <div className="report-label">{formatSpecLabel(key)}</div>
          <div className="report-value">{value}</div>
        </div>
      )
    ))}
  </div>
);

// Helper functions
const getSeverityBadgeClass = (severity) => {
  const lower = severity?.toLowerCase();
  if (lower === 'minor') return 'badge-info';
  if (lower === 'moderate') return 'badge-warning';
  if (lower === 'severe' || lower === 'major') return 'badge-danger';
  return 'badge-info';
};

const getTitleBadgeClass = (brand) => {
  const lower = brand?.toLowerCase();
  if (lower === 'clean') return 'badge-success';
  if (lower === 'salvage' || lower === 'flood' || lower === 'fire') return 'badge-danger';
  if (lower === 'rebuilt') return 'badge-warning';
  return 'badge-info';
};

const formatSpecLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

export default ReportPage;
