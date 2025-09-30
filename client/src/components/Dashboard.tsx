import React, { useState, useEffect } from 'react';

interface Lead {
  id: string;
  action: string;
  timestamp: string;
  charged: boolean;
  chargeDetails?: any;
  customerData?: any;
}

interface LeadStats {
  total: number;
  thisMonth: number;
  charged: number;
  pending: number;
}

interface DashboardProps {
  assessorId: string;
  token: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ assessorId, token, onLogout }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch leads and stats in parallel
      const [leadsResponse, statsResponse] = await Promise.all([
        fetch(`/api/leads/assessor/${assessorId}`, { headers }),
        fetch(`/api/leads/stats/${assessorId}`, { headers })
      ]);

      if (leadsResponse.ok && statsResponse.ok) {
        const leadsData = await leadsResponse.json();
        const statsData = await statsResponse.json();

        setLeads(leadsData.leads || []);
        setStats(statsData.stats || null);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Assessor Dashboard</h1>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Leads</h3>
          <div className="stat-number">{stats?.total || 0}</div>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <div className="stat-number">{stats?.thisMonth || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Charged</h3>
          <div className="stat-number">{stats?.charged || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Payment</h3>
          <div className="stat-number">{stats?.pending || 0}</div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="leads-section">
        <h2>Recent Leads</h2>

        {leads.length === 0 ? (
          <div className="no-leads">
            <p>No leads yet. Your leads will appear here when customers contact you.</p>
          </div>
        ) : (
          <div className="leads-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Charge</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{formatDate(lead.timestamp)}</td>
                    <td>
                      <span className="lead-type">
                        {lead.action === 'contact_request' ? 'Phone Contact' : lead.action}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${lead.charged ? 'charged' : 'pending'}`}>
                        {lead.charged ? 'Charged' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      {lead.charged ? '£5.00' : '£5.00 (pending)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-button">
            Update Profile
          </button>
          <button className="action-button">
            Billing History
          </button>
          <button className="action-button">
            Coverage Areas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;