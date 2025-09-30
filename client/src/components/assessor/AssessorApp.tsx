import React, { useState, useEffect } from 'react';
import AssessorSidebar from './AssessorSidebar';
import AssessorDashboard from './AssessorDashboard';
import AssessorLeads from './AssessorLeads';
import AssessorPostCodes from './AssessorPostCodes';
import AssessorBilling from './AssessorBilling';
import AssessorProfile from './AssessorProfile';
import AssessorPublicProfile from './AssessorPublicProfile';
import './AssessorProfile.css';
import { RegionPreferencesProvider } from '../../contexts/RegionPreferencesContext';

const AssessorApp: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [assessorId, setAssessorId] = useState<string | null>(null);
  const [assessorName, setAssessorName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for existing assessor auth
    const savedToken = localStorage.getItem('assessor_token');
    const savedAssessorId = localStorage.getItem('assessor_id');
    const savedAssessorName = localStorage.getItem('assessor_name');

    if (savedToken && savedAssessorId) {
      setToken(savedToken);
      setAssessorId(savedAssessorId);
      setAssessorName(savedAssessorName || 'Assessor');
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Mock login for now - replace with real API later
      // Mock successful assessor login
      const mockToken = 'mock-assessor-token-' + Date.now();
      const mockAssessor = {
        id: 'assessor-1',
        name: 'John Smith',
        email: loginData.email
      };

      setToken(mockToken);
      setAssessorId(mockAssessor.id);
      setAssessorName(mockAssessor.name);

      localStorage.setItem('assessor_token', mockToken);
      localStorage.setItem('assessor_id', mockAssessor.id);
      localStorage.setItem('assessor_name', mockAssessor.name);
      localStorage.setItem('assessor_email', mockAssessor.email);

      // TODO: Replace with actual API call to /api/assessor/login
      console.log('Mock assessor login successful:', mockAssessor);
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('assessor_token');
    localStorage.removeItem('assessor_id');
    localStorage.removeItem('assessor_name');
    localStorage.removeItem('assessor_email');
    setToken(null);
    setAssessorId(null);
    setAssessorName('');
    setActiveSection('dashboard');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AssessorDashboard token={token!} assessorId={assessorId!} onSectionChange={setActiveSection} />;
      case 'leads':
        return <AssessorLeads token={token!} assessorId={assessorId!} />;
      case 'postcodes':
        return <AssessorPostCodes token={token!} assessorId={assessorId!} />;
      case 'billing':
        return <AssessorBilling token={token!} assessorId={assessorId!} />;
      case 'profile':
        return <AssessorPublicProfile token={token!} assessorId={assessorId!} assessorName={assessorName} />;
      case 'account':
        return <AssessorProfile token={token!} assessorId={assessorId!} assessorName={assessorName} trustLevel="bronze" />;
      default:
        return <AssessorDashboard token={token!} assessorId={assessorId!} onSectionChange={setActiveSection} />;
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
      <RegionPreferencesProvider assessorId={assessorId || undefined}>
        <div className="admin-login-container">
        <div className="admin-login-form">
          <h2>Assessor Login</h2>
          <p>Access your EPC assessor dashboard</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Login to Dashboard
            </button>
          </form>

          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: john.smith@test.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
      </RegionPreferencesProvider>
    );
  }

  return (
    <RegionPreferencesProvider assessorId={assessorId || undefined}>
      <div className="admin-app">
      <AssessorSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        assessorName={assessorName}
        trustLevel="bronze"
      />

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
    </RegionPreferencesProvider>
  );
};

export default AssessorApp;