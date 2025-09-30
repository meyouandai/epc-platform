import React, { useState, useEffect } from 'react';

interface DashboardMetrics {
  totalLeads: number;
  totalRevenue: number;
  totalOverdue: number;
  newAssessors: number;
  activeAssessors: number;
  totalDistricts: number;
  trends?: {
    totalLeads: number;
    totalRevenue: number;
    totalOverdue: number;
    newAssessors: number;
    activeAssessors: number;
    totalDistricts: number;
  };
}

interface AdminDashboardProps {
  token: string;
}

type DateFilter = 'today' | '7days' | '30days' | 'custom';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('30days');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchDashboardMetrics();
  }, [dateFilter]);

  const fetchDashboardMetrics = async () => {
    try {
      const params = new URLSearchParams({ period: dateFilter });

      if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
        params.append('startDate', customDateRange.start);
        params.append('endDate', customDateRange.end);
      }

      const response = await fetch(`/api/admin/dashboard?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      } else {
        console.error('Failed to fetch dashboard metrics');
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
    setLoading(true);
  };

  const handleCustomDateSubmit = () => {
    if (customDateRange.start && customDateRange.end) {
      setLoading(true);
      fetchDashboardMetrics();
    }
  };

  const renderTrendIndicator = (value: number) => {
    if (value === 0) return null;

    const isPositive = value > 0;
    return (
      <span className={`trend-indicator ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '↗' : '↘'} {Math.abs(value)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard metrics...</p>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Leads',
      value: metrics?.totalLeads || 0,
      icon: '📈',
      subtitle: 'Customer inquiries',
      trend: metrics?.trends?.totalLeads || 0
    },
    {
      title: 'Total Revenue',
      value: `£${metrics?.totalRevenue || 0}`,
      icon: '💰',
      subtitle: 'Platform earnings',
      trend: metrics?.trends?.totalRevenue || 0
    },
    {
      title: 'Total Overdue',
      value: metrics?.totalOverdue || 0,
      icon: '⚠️',
      subtitle: 'Unpaid leads',
      trend: metrics?.trends?.totalOverdue || 0
    },
    {
      title: 'New Assessors',
      value: metrics?.newAssessors || 0,
      icon: '👤',
      subtitle: getSubtitleForFilter(),
      trend: metrics?.trends?.newAssessors || 0
    },
    {
      title: 'Active Assessors',
      value: metrics?.activeAssessors || 0,
      icon: '✅',
      subtitle: 'Verified accounts',
      trend: metrics?.trends?.activeAssessors || 0
    },
    {
      title: 'Total Districts',
      value: metrics?.totalDistricts || 0,
      icon: '🗺️',
      subtitle: 'Coverage areas',
      trend: metrics?.trends?.totalDistricts || 0
    }
  ];

  function getSubtitleForFilter() {
    switch (dateFilter) {
      case 'today': return 'Today';
      case '7days': return 'Last 7 days';
      case '30days': return 'Last 30 days';
      case 'custom': return 'Custom period';
      default: return 'Last 30 days';
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Dashboard</h1>
          </div>

          <div className="date-filters">
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value as DateFilter)}
              className="date-filter-dropdown"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="custom">Custom range</option>
            </select>

            {dateFilter === 'custom' && (
              <div className="custom-date-range">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="date-input"
                />
                <span>to</span>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="date-input"
                />
                <button onClick={handleCustomDateSubmit} className="apply-btn">
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        {metricCards.map((card, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">{card.icon}</span>
              <h3>{card.title}</h3>
            </div>
            <div className="metric-value-container">
              <div className="metric-value">{card.value}</div>
              {renderTrendIndicator(card.trend)}
            </div>
            <div className="metric-subtitle">{card.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">👨‍💼</span>
            <div className="activity-details">
              <p><strong>New assessor registered</strong></p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📋</span>
            <div className="activity-details">
              <p><strong>Lead generated in SW1A</strong></p>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">💰</span>
            <div className="activity-details">
              <p><strong>Payment processed</strong></p>
              <span className="activity-time">6 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🗺️</span>
            <div className="activity-details">
              <p><strong>Coverage area updated</strong></p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;