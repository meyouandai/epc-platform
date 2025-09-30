import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AssessorsManagement from './AssessorsManagement';
import CoverageManagement from './CoverageManagement';
import LeadsManagement from './LeadsManagement';
import PaymentsManagement from './PaymentsManagement';
import CreateAccount from './CreateAccount';
import AdminProfile from './AdminProfile';
import { apiCall } from '../../utils/api';

const AdminApp: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for existing admin auth
    const savedToken = localStorage.getItem('admin_token');
    const savedAdminId = localStorage.getItem('admin_id');
    const savedAdminName = localStorage.getItem('admin_name');

    if (savedToken && savedAdminId) {
      setToken(savedToken);
      setAdminId(savedAdminId);
      setAdminName(savedAdminName || 'Administrator');
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiCall('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setAdminId(data.admin.id);
        setAdminName(data.admin.name);

        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_id', data.admin.id);
        localStorage.setItem('admin_name', data.admin.name);
        localStorage.setItem('admin_email', data.admin.email || loginData.email);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_id');
    localStorage.removeItem('admin_name');
    localStorage.removeItem('admin_email');
    setToken(null);
    setAdminId(null);
    setAdminName('');
    setActiveSection('dashboard');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard token={token!} />;
      case 'assessors':
        return <AssessorsManagement token={token!} />;
      case 'coverages':
        return <CoverageManagement token={token!} />;
      case 'leads':
        return <LeadsManagement token={token!} />;
      case 'payments':
        return <PaymentsManagement token={token!} />;
      case 'create-account':
        return <CreateAccount token={token!} />;
      case 'profile':
        return <AdminProfile token={token!} />;
      default:
        return <AdminDashboard token={token!} />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-form">
          <h2>Administrator Login</h2>
          <p>Access the EPC platform administration panel</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="admin@epcplatform.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Enter admin password"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Login to Admin Panel
            </button>
          </form>

          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: admin@epcplatform.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-app">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        adminName={adminName}
      />

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminApp;