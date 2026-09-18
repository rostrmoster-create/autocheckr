import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { adminAPI } from '../services/api';
import { 
  FaUsers, 
  FaFileAlt, 
  FaDollarSign, 
  FaSearch,
  FaEdit,
  FaBan,
  FaCheckCircle 
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState([]);
  const [vinSearches, setVinSearches] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.isAdmin) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, paymentsRes, productsRes, searchesRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getUsers({ limit: 10 }),
        adminAPI.getPayments({ limit: 10 }),
        adminAPI.getProducts(),
        adminAPI.getVinSearches({ limit: 20 })
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setPayments(paymentsRes.data.payments);
      setProducts(productsRes.data.products);
      setVinSearches(searchesRes.data.searches);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !currentStatus });
      fetchDashboardData();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleUpdateCredits = async (userId) => {
    const credits = prompt('Enter new credit amount:');
    if (credits !== null) {
      try {
        await adminAPI.updateUser(userId, { reportCredits: parseInt(credits) });
        fetchDashboardData();
      } catch (error) {
        alert('Failed to update credits');
      }
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--light-bg)', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container-wide">
        <h1>Admin Dashboard</h1>

        {/* Stats Overview */}
        {activeTab === 'overview' && stats && (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              <StatCard 
                icon={<FaUsers />}
                label="Total Users"
                value={stats.totalUsers}
                color="var(--primary-color)"
              />
              <StatCard 
                icon={<FaFileAlt />}
                label="Total Reports"
                value={stats.totalReports}
                color="var(--secondary-color)"
              />
              <StatCard 
                icon={<FaDollarSign />}
                label="Total Revenue"
                value={`$${stats.totalRevenue.toFixed(2)}`}
                color="var(--warning-color)"
              />
              <StatCard 
                icon={<FaSearch />}
                label="Total Searches"
                value={stats.totalSearches}
                color="#8b5cf6"
              />
            </div>

            {/* Recent Activity */}
            <div style={{ marginTop: '3rem' }}>
              <h3>Recent Payments</h3>
              <div className="card">
                <div className="table">
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>User</th>
                        <th>Amount</th>
                        <th>Product</th>
                        <th>Status</th>
                        <th>Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(payment => (
                        <tr key={payment.id}>
                          <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                          <td>{payment.User?.email}</td>
                          <td>${payment.amount}</td>
                          <td>{payment.productType}</td>
                          <td>
                            <span className={`badge badge-${payment.status === 'completed' ? 'success' : 'warning'}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td>{payment.creditsGranted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '2rem',
          borderBottom: '2px solid var(--border-color)',
          marginBottom: '2rem'
        }}>
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            Overview
          </TabButton>
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            Users
          </TabButton>
          <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
            Products
          </TabButton>
          <TabButton active={activeTab === 'searches'} onClick={() => setActiveTab('searches')}>
            VIN Searches
          </TabButton>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h3>User Management</h3>
            <div className="table">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Credits</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.reportCredits}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleUpdateCredits(user.id)}
                            className="btn btn-small btn-outline"
                            title="Edit Credits"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                            className={`btn btn-small ${user.isActive ? 'btn-outline' : 'btn-primary'}`}
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? <FaBan /> : <FaCheckCircle />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="card">
            <h3>Product Management</h3>
            <div className="table">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Credits</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.reportCredits}</td>
                      <td>
                        <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-small btn-outline">
                          <FaEdit /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIN Searches Tab */}
        {activeTab === 'searches' && (
          <div className="card">
            <h3>Recent VIN Searches</h3>
            <div className="table">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>VIN</th>
                    <th>User</th>
                    <th>IP Address</th>
                    <th>Success</th>
                  </tr>
                </thead>
                <tbody>
                  {vinSearches.map(search => (
                    <tr key={search.id}>
                      <td>{new Date(search.createdAt).toLocaleString()}</td>
                      <td style={{ fontFamily: 'monospace' }}>{search.vin}</td>
                      <td>{search.User?.email || 'Guest'}</td>
                      <td>{search.ipAddress}</td>
                      <td>
                        <span className={`badge ${search.success ? 'badge-success' : 'badge-danger'}`}>
                          {search.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ 
        background: color, 
        color: 'white',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.75rem'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '2rem', fontWeight: '700', color }}>
          {value}
        </div>
        <div style={{ color: 'var(--text-light)' }}>{label}</div>
      </div>
    </div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: '1rem 1.5rem',
      background: 'transparent',
      border: 'none',
      borderBottom: active ? '3px solid var(--primary-color)' : '3px solid transparent',
      color: active ? 'var(--primary-color)' : 'var(--text-light)',
      fontWeight: active ? '600' : '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
  >
    {children}
  </button>
);

export default AdminDashboard;
