import React, { useState, useEffect } from 'react';
import { apiCall } from '../../utils/api';

interface Assessor {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  verified: boolean;
  status: 'pending' | 'active' | 'health_risk' | 'inactive' | 'new';
  rating: number;
  reviewCount: number;
  price: string;
  coverageAreas: string[];
  coordinates: { lat: number; lng: number };
  stripeCustomerId?: string;
  createdAt: Date;
  approvedAt?: Date;
  healthRiskReasons?: string[];
}

interface AssessorsManagementProps {
  token: string;
}

type StatusTab = 'pending' | 'active' | 'health_risk' | 'inactive' | 'new';

const AssessorsManagement: React.FC<AssessorsManagementProps> = ({ token }) => {
  const [assessors, setAssessors] = useState<Assessor[]>([]);
  const [filteredAssessors, setFilteredAssessors] = useState<Assessor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<StatusTab | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessors();
  }, []);

  useEffect(() => {
    // Set smart default tab when assessors are loaded
    if (assessors.length > 0 && activeTab === null) {
      const pendingCount = assessors.filter(a => a.status === 'pending').length;
      const healthRiskCount = assessors.filter(a => a.status === 'health_risk').length;

      if (pendingCount > 0) {
        setActiveTab('pending');
      } else if (healthRiskCount > 0) {
        setActiveTab('health_risk');
      } else {
        setActiveTab('active'); // Show active as fallback
      }
    }
  }, [assessors, activeTab]);

  useEffect(() => {
    // Filter assessors based on active tab and search term
    let filtered = assessors;

    // If searching, search across ALL assessors regardless of tab
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = assessors.filter(assessor => {
        // Check if name starts with search term (first or last name)
        const nameParts = assessor.name.toLowerCase().split(' ');
        const nameMatches = nameParts.some(part => part.startsWith(searchLower));

        // Check if email starts with search term
        const emailMatches = assessor.email.toLowerCase().startsWith(searchLower);

        // Check if company starts with search term
        const companyMatches = assessor.company &&
          assessor.company.toLowerCase().startsWith(searchLower);

        return nameMatches || emailMatches || companyMatches;
      });
    } else {
      // Only apply tab filter when NOT searching
      if (activeTab) {
        filtered = filtered.filter(assessor => assessor.status === activeTab);
      }
    }

    setFilteredAssessors(filtered);
  }, [searchTerm, assessors, activeTab]);

  const fetchAssessors = async () => {
    try {
      const response = await apiCall('/api/admin/assessors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssessors(data.assessors || []);
      } else {
        console.error('Failed to fetch assessors');
      }
    } catch (error) {
      console.error('Error fetching assessors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (assessorId: string, currentVerified: boolean) => {
    try {
      const newStatus = currentVerified ? 'inactive' : 'active';
      const response = await apiCall(`/api/admin/assessors/${assessorId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        // Refresh assessors list
        fetchAssessors();
      } else {
        alert('Failed to update assessor status');
      }
    } catch (error) {
      console.error('Failed to update assessor:', error);
      alert('Failed to update assessor status');
    }
  };

  const toggleCardExpansion = (assessorId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(assessorId)) {
      newExpanded.delete(assessorId);
    } else {
      newExpanded.add(assessorId);
    }
    setExpandedCards(newExpanded);
  };

  const formatMemberSince = (date: Date) => {
    return new Date(date).toLocaleDateString('en-UK', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusCounts = () => {
    return {
      pending: assessors.filter(a => a.status === 'pending').length,
      active: assessors.filter(a => a.status === 'active').length,
      health_risk: assessors.filter(a => a.status === 'health_risk').length,
      inactive: assessors.filter(a => a.status === 'inactive').length,
      new: assessors.filter(a => a.status === 'new').length,
    };
  };

  const getCoverageDisplay = (areas: string[]) => {
    // Group by region and show counts (mock data for now)
    const regionCounts = {
      'Greater London': 28,
      'Essex': 12,
      'Kent': 15
    };

    return Object.entries(regionCounts).map(([region, count]) => (
      <span key={region} className="coverage-item">
        {region} ({count})
      </span>
    ));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'active': return 'status-active';
      case 'health_risk': return 'status-health-risk';
      case 'inactive': return 'status-inactive';
      case 'new': return 'status-new';
      default: return 'status-active';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Approval';
      case 'active': return 'Active';
      case 'health_risk': return 'Health Risk';
      case 'inactive': return 'Inactive';
      case 'new': return 'New';
      default: return 'Active';
    }
  };

  // Mock lead statistics (will connect to real data later)
  const getLeadStats = () => ({
    last24h: 3,
    last7d: 12,
    last30d: 45,
    allTime: 167
  });

  // Mock billing data (will connect to real data later)
  const getBillingInfo = () => ({
    outstanding: '£125.00',
    term: 'Monthly',
    due: '2025-10-01',
    lastPaid: '2025-09-01'
  });

  if (loading) {
    return (
      <div className="assessors-loading">
        <div className="loading-spinner"></div>
        <p>Loading assessors...</p>
      </div>
    );
  }

  return (
    <div className="assessors-management">
      <div className="assessors-header">
        <div className="header-content">
          <div>
            <h1>Assessors Management</h1>
            <p>Manage EPC assessors on the platform</p>
          </div>
          <button className="add-assessor-btn">
            + Add New Assessor
          </button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="search-results">
          {searchTerm && (
            <p>{filteredAssessors.length} assessor{filteredAssessors.length !== 1 ? 's' : ''} found across all categories</p>
          )}
        </div>
      </div>

      <div className={`status-tabs ${searchTerm ? 'search-active' : ''}`}>
        {(() => {
          const counts = getStatusCounts();
          const tabs = [
            { key: 'pending', label: 'Pending Approval', count: counts.pending, priority: 1 },
            { key: 'health_risk', label: 'Account Health Risk', count: counts.health_risk, priority: 2 },
            { key: 'active', label: 'Active', count: counts.active, priority: 3 },
            { key: 'new', label: 'New', count: counts.new, priority: 4 },
            { key: 'inactive', label: 'Inactive', count: counts.inactive, priority: 5 }
          ];

          return tabs.map(tab => (
            <button
              key={tab.key}
              className={`status-tab ${activeTab === tab.key && !searchTerm ? 'active' : ''} ${tab.count > 0 ? 'has-items' : ''} ${searchTerm ? 'disabled' : ''}`}
              onClick={() => !searchTerm && setActiveTab(tab.key as StatusTab)}
              disabled={!!searchTerm}
            >
              <span className="tab-label">{tab.label}</span>
              <span className={`tab-count ${tab.count > 0 ? 'has-count' : ''}`}>
                {tab.count}
              </span>
            </button>
          ));
        })()}
      </div>

      <div className="assessors-list">
        {filteredAssessors.map((assessor) => {
          const isExpanded = expandedCards.has(assessor.id);
          const leadStats = getLeadStats();
          const billingInfo = getBillingInfo();

          return (
            <div key={assessor.id} className={`assessor-card ${isExpanded ? 'expanded' : ''}`}>
              {/* Collapsed View */}
              <div className="card-header" onClick={() => toggleCardExpansion(assessor.id)}>
                <div className="assessor-basic-info">
                  <div className="status-and-name">
                    <span className={`status-badge ${getStatusBadgeClass(assessor.status)}`}>
                      {getStatusLabel(assessor.status)}
                    </span>
                    <h3 className="assessor-name">{assessor.name}</h3>
                  </div>
                  {assessor.company && (
                    <p className="company-name">{assessor.company}</p>
                  )}
                  <p className="contact-number">{assessor.phone}</p>
                </div>
                <div className="card-toggle">
                  <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
                </div>
              </div>

              {/* Expanded View */}
              {isExpanded && (
                <div className="card-expanded-content">
                  <div className="expanded-grid">
                    {/* Basic Details */}
                    <div className="detail-section">
                      <h4>Contact Information</h4>
                      <div className="detail-row">
                        <span className="label">Email:</span>
                        <span className="value">{assessor.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Member since:</span>
                        <span className="value">{formatMemberSince(assessor.createdAt)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Rating:</span>
                        <span className="value">
                          ⭐ {assessor.rating}/5 ({assessor.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="detail-row">
                        <a href="#" className="view-profile-link">
                          View Public Profile →
                        </a>
                      </div>
                    </div>

                    {/* Coverage Areas */}
                    <div className="detail-section">
                      <h4>Coverage Areas</h4>
                      <div className="coverage-areas">
                        {getCoverageDisplay(assessor.coverageAreas)}
                      </div>
                    </div>

                    {/* Lead Statistics */}
                    <div className="detail-section">
                      <h4>Lead Statistics</h4>
                      <div className="stats-grid">
                        <div className="stat-item">
                          <span className="stat-value">{leadStats.last24h}</span>
                          <span className="stat-label">Last 24h</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{leadStats.last7d}</span>
                          <span className="stat-label">Last 7d</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{leadStats.last30d}</span>
                          <span className="stat-label">Last 30d</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-value">{leadStats.allTime}</span>
                          <span className="stat-label">All Time</span>
                        </div>
                      </div>
                    </div>

                    {/* Billing Information */}
                    <div className="detail-section">
                      <h4>Billing Information</h4>
                      <div className="billing-grid">
                        <div className="billing-item">
                          <span className="billing-label">Outstanding:</span>
                          <span className="billing-value outstanding">{billingInfo.outstanding}</span>
                        </div>
                        <div className="billing-item">
                          <span className="billing-label">Term:</span>
                          <span className="billing-value">{billingInfo.term}</span>
                        </div>
                        <div className="billing-item">
                          <span className="billing-label">Due:</span>
                          <span className="billing-value">{billingInfo.due}</span>
                        </div>
                        <div className="billing-item">
                          <span className="billing-label">Last Paid:</span>
                          <span className="billing-value">{billingInfo.lastPaid}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="detail-section">
                      <h4>Actions</h4>
                      <div className="action-buttons">
                        <button className="action-btn edit-btn">Edit Details</button>
                        <button className="action-btn history-btn">Payment History</button>
                        <button
                          className={`action-btn ${assessor.verified ? 'deactivate-btn' : 'activate-btn'}`}
                          onClick={() => handleToggleVerification(assessor.id, assessor.verified)}
                        >
                          {assessor.verified ? 'Deactivate Account' : 'Activate Account'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAssessors.length === 0 && !loading && (
        <div className="no-results">
          {searchTerm ? (
            <div>
              <h3>No assessors found for "{searchTerm}"</h3>
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </button>
            </div>
          ) : activeTab === 'pending' ? (
            <div>
              <h3>✅ No pending approvals</h3>
              <p>All assessor applications have been processed. Great job!</p>
            </div>
          ) : activeTab === 'health_risk' ? (
            <div>
              <h3>✅ No account health risks</h3>
              <p>All assessors are in good standing with no issues requiring attention.</p>
            </div>
          ) : (
            <div>
              <h3>No {getStatusLabel(activeTab!).toLowerCase()} assessors</h3>
              <p>There are currently no assessors in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessorsManagement;