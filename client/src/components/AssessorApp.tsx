import React, { useState, useEffect } from 'react';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';

const AssessorApp: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [assessorId, setAssessorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on page load
    const savedToken = localStorage.getItem('assessor_token');
    const savedAssessorId = localStorage.getItem('assessor_id');

    if (savedToken && savedAssessorId) {
      // Verify token is still valid
      verifyToken(savedToken, savedAssessorId);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string, assessorId: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setToken(token);
        setAssessorId(assessorId);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('assessor_token');
        localStorage.removeItem('assessor_id');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('assessor_token');
      localStorage.removeItem('assessor_id');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken: string, newAssessorId: string) => {
    setToken(newToken);
    setAssessorId(newAssessorId);
  };

  const handleLogout = () => {
    localStorage.removeItem('assessor_token');
    localStorage.removeItem('assessor_id');
    setToken(null);
    setAssessorId(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="assessor-app">
      {token && assessorId ? (
        <Dashboard
          assessorId={assessorId}
          token={token}
          onLogout={handleLogout}
        />
      ) : (
        <AuthForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default AssessorApp;