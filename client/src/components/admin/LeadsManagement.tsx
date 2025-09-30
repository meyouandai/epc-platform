import React, { useState, useEffect } from 'react';

interface AdminLead {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyAddress: string;
  postcode: string;
  epcType: 'Residential' | 'Commercial';
  urgency: 'Standard' | 'Urgent';
  status: 'new' | 'contacted' | 'quoted' | 'completed' | 'cancelled';
  assignedAssessor?: string;
  assessorId?: string;
  quoteAmount?: number;
  createdAt: Date;
  lastUpdated?: Date;
  specialRequirements?: string;
}

interface AreaLeadData {
  areaId: string;
  areaName: string;
  topPostcodes: PostcodeLeadData[];
  recentLeads: RecentLead[];
  totalLeads: number;
  totalRevenue: number;
  missedRevenue: number;
  coverageScore: number;
  trend: number;
}

interface PostcodeLeadData {
  postcode: string;
  leadCount: number;
  assessorCount: number;
  maxAssessors: number;
  revenue: number;
  trend: number;
  needsCoverage: boolean;
}

interface AssessorInfo {
  id: string;
  name: string;
  initials: string;
  company?: string;
}

interface RecentLead {
  id: string;
  postcode: string;
  fullPostcode: string;
  searchedAt: Date;
  customerDetails?: {
    address: string;
    phone: string;
    email: string;
    name: string;
  };
  assessors: AssessorInfo[];
  revenue: number;
}

interface LeadsManagementProps {
  token: string;
}

const LeadsManagement: React.FC<LeadsManagementProps> = ({ token }) => {
  const [areaLeads, setAreaLeads] = useState<AreaLeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const [expandedLeads, setExpandedLeads] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      // Mock data for demo
      const mockAreaLeads: AreaLeadData[] = [
        {
          areaId: 'london-central',
          areaName: 'London (Central)',
          totalLeads: 312,
          totalRevenue: 1248,
          missedRevenue: 156,
          coverageScore: 88,
          trend: 12,
          topPostcodes: [
            { postcode: 'WC1', leadCount: 45, assessorCount: 4, maxAssessors: 4, revenue: 180, trend: 15, needsCoverage: false },
            { postcode: 'EC1', leadCount: 42, assessorCount: 3, maxAssessors: 4, revenue: 126, trend: -5, needsCoverage: true },
            { postcode: 'SW1', leadCount: 38, assessorCount: 4, maxAssessors: 4, revenue: 152, trend: 8, needsCoverage: false },
            { postcode: 'W1', leadCount: 35, assessorCount: 2, maxAssessors: 4, revenue: 70, trend: 22, needsCoverage: true },
            { postcode: 'SE1', leadCount: 32, assessorCount: 4, maxAssessors: 4, revenue: 128, trend: 10, needsCoverage: false }
          ],
          recentLeads: [
            {
              id: 'lc-001',
              postcode: 'WC1',
              fullPostcode: 'WC1A 2AB',
              searchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              customerDetails: {
                name: 'Oliver Thompson',
                address: '25 Russell Square, London WC1A 2AB',
                phone: '07700 900111',
                email: 'oliver.t@email.com'
              },
              assessors: [
                { id: 'a1', name: 'Michael Davis', initials: 'MD', company: 'Central EPC' },
                { id: 'a2', name: 'Emma Wilson', initials: 'EW' },
                { id: 'a3', name: 'James Brown', initials: 'JB' },
                { id: 'a4', name: 'Sophie Taylor', initials: 'ST' }
              ],
              revenue: 20
            },
            {
              id: 'lc-002',
              postcode: 'EC1',
              fullPostcode: 'EC1A 4HD',
              searchedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
              customerDetails: {
                name: 'Sarah Mitchell',
                address: '10 Fleet Street, London EC1A 4HD',
                phone: '07700 900222',
                email: 'sarah.m@email.com'
              },
              assessors: [
                { id: 'a5', name: 'David Johnson', initials: 'DJ' },
                { id: 'a6', name: 'Lucy Chen', initials: 'LC', company: 'Pro Assessments' },
                { id: 'a7', name: 'Tom Williams', initials: 'TW' }
              ],
              revenue: 15
            }
          ]
        },
        {
          areaId: 'london-north',
          areaName: 'London (North)',
          totalLeads: 245,
          totalRevenue: 980,
          missedRevenue: 120,
          coverageScore: 85,
          trend: 8,
          topPostcodes: [
            { postcode: 'N3', leadCount: 42, assessorCount: 2, maxAssessors: 4, revenue: 84, trend: 15, needsCoverage: true },
            { postcode: 'NW1', leadCount: 38, assessorCount: 4, maxAssessors: 4, revenue: 152, trend: 8, needsCoverage: false },
            { postcode: 'N7', leadCount: 35, assessorCount: 3, maxAssessors: 4, revenue: 105, trend: -5, needsCoverage: true },
            { postcode: 'N1', leadCount: 28, assessorCount: 4, maxAssessors: 4, revenue: 112, trend: 12, needsCoverage: false },
            { postcode: 'NW3', leadCount: 25, assessorCount: 1, maxAssessors: 4, revenue: 25, trend: 22, needsCoverage: true }
          ],
          recentLeads: [
            {
              id: 'ln-001',
              postcode: 'N3',
              fullPostcode: 'N3 2AB',
              searchedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
              customerDetails: {
                name: 'James Wilson',
                address: '42 Finchley Road, London N3 2AB',
                phone: '07700 900123',
                email: 'james.wilson@email.com'
              },
              assessors: [
                { id: 'a8', name: 'John Smith', initials: 'JS', company: 'EPC Pro' },
                { id: 'a9', name: 'Sarah Walker', initials: 'SW' }
              ],
              revenue: 10
            }
          ]
        },
        {
          areaId: 'london-east',
          areaName: 'London (East)',
          totalLeads: 189,
          totalRevenue: 642,
          missedRevenue: 210,
          coverageScore: 68,
          trend: 35,
          topPostcodes: [
            { postcode: 'E14', leadCount: 55, assessorCount: 2, maxAssessors: 4, revenue: 110, trend: 35, needsCoverage: true },
            { postcode: 'E1', leadCount: 32, assessorCount: 3, maxAssessors: 4, revenue: 96, trend: 18, needsCoverage: true },
            { postcode: 'E8', leadCount: 28, assessorCount: 1, maxAssessors: 4, revenue: 28, trend: 42, needsCoverage: true },
            { postcode: 'E15', leadCount: 22, assessorCount: 4, maxAssessors: 4, revenue: 88, trend: -8, needsCoverage: false },
            { postcode: 'E11', leadCount: 18, assessorCount: 2, maxAssessors: 4, revenue: 36, trend: 5, needsCoverage: true }
          ],
          recentLeads: [
            {
              id: 'le-001',
              postcode: 'E14',
              fullPostcode: 'E14 5HQ',
              searchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
              customerDetails: {
                name: 'Emma Thompson',
                address: '15 Canary Wharf, London E14 5HQ',
                phone: '07700 900456',
                email: 'emma.t@email.com'
              },
              assessors: [
                { id: 'a10', name: 'Mark Arnold', initials: 'MA' },
                { id: 'a11', name: 'Lisa Chen', initials: 'LC', company: 'Green Cert' }
              ],
              revenue: 10
            }
          ]
        },
        {
          areaId: 'birmingham',
          areaName: 'Birmingham',
          totalLeads: 156,
          totalRevenue: 520,
          missedRevenue: 80,
          coverageScore: 75,
          trend: 10,
          topPostcodes: [
            { postcode: 'B1', leadCount: 35, assessorCount: 3, maxAssessors: 4, revenue: 105, trend: 10, needsCoverage: true },
            { postcode: 'B15', leadCount: 28, assessorCount: 4, maxAssessors: 4, revenue: 112, trend: -3, needsCoverage: false },
            { postcode: 'B23', leadCount: 22, assessorCount: 2, maxAssessors: 4, revenue: 44, trend: 25, needsCoverage: true },
            { postcode: 'B32', leadCount: 18, assessorCount: 4, maxAssessors: 4, revenue: 72, trend: 8, needsCoverage: false },
            { postcode: 'B45', leadCount: 15, assessorCount: 1, maxAssessors: 4, revenue: 15, trend: 45, needsCoverage: true }
          ],
          recentLeads: [
            {
              id: 'b-001',
              postcode: 'B1',
              fullPostcode: 'B1 2FF',
              searchedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
              customerDetails: {
                name: 'Robert Davies',
                address: '8 New Street, Birmingham B1 2FF',
                phone: '07700 900789',
                email: 'rob.davies@email.com'
              },
              assessors: [
                { id: 'a12', name: 'David Brown', initials: 'DB' },
                { id: 'a13', name: 'Rachel Green', initials: 'RG' },
                { id: 'a14', name: 'Tom Wilson', initials: 'TW' }
              ],
              revenue: 15
            }
          ]
        },
        {
          areaId: 'manchester',
          areaName: 'Manchester',
          totalLeads: 134,
          totalRevenue: 428,
          missedRevenue: 60,
          coverageScore: 80,
          trend: 15,
          topPostcodes: [
            { postcode: 'M1', leadCount: 28, assessorCount: 4, maxAssessors: 4, revenue: 112, trend: 15, needsCoverage: false },
            { postcode: 'M4', leadCount: 22, assessorCount: 3, maxAssessors: 4, revenue: 66, trend: 12, needsCoverage: true },
            { postcode: 'M15', leadCount: 20, assessorCount: 4, maxAssessors: 4, revenue: 80, trend: -10, needsCoverage: false },
            { postcode: 'M20', leadCount: 18, assessorCount: 2, maxAssessors: 4, revenue: 36, trend: 28, needsCoverage: true },
            { postcode: 'M32', leadCount: 12, assessorCount: 4, maxAssessors: 4, revenue: 48, trend: 5, needsCoverage: false }
          ],
          recentLeads: [
            {
              id: 'm-001',
              postcode: 'M1',
              fullPostcode: 'M1 3DZ',
              searchedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
              customerDetails: {
                name: 'Charlotte Miller',
                address: '23 Market Street, Manchester M1 3DZ',
                phone: '07700 900321',
                email: 'c.miller@email.com'
              },
              assessors: [
                { id: 'a15', name: 'Alex Turner', initials: 'AT' },
                { id: 'a16', name: 'Kate Wilson', initials: 'KW' },
                { id: 'a17', name: 'Ryan Hughes', initials: 'RH' },
                { id: 'a18', name: 'Jessica Lee', initials: 'JL' }
              ],
              revenue: 20
            }
          ]
        },
        {
          areaId: 'cardiff',
          areaName: 'Cardiff',
          totalLeads: 98,
          totalRevenue: 284,
          missedRevenue: 108,
          coverageScore: 62,
          trend: 32,
          topPostcodes: [
            { postcode: 'CF10', leadCount: 25, assessorCount: 2, maxAssessors: 4, revenue: 50, trend: 32, needsCoverage: true },
            { postcode: 'CF24', leadCount: 20, assessorCount: 1, maxAssessors: 4, revenue: 20, trend: 55, needsCoverage: true },
            { postcode: 'CF14', leadCount: 18, assessorCount: 3, maxAssessors: 4, revenue: 54, trend: 8, needsCoverage: true },
            { postcode: 'CF23', leadCount: 15, assessorCount: 2, maxAssessors: 4, revenue: 30, trend: 22, needsCoverage: true },
            { postcode: 'CF5', leadCount: 10, assessorCount: 0, maxAssessors: 4, revenue: 0, trend: 0, needsCoverage: true }
          ],
          recentLeads: [
            {
              id: 'cf-001',
              postcode: 'CF10',
              fullPostcode: 'CF10 3NP',
              searchedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
              customerDetails: {
                name: 'Morgan Evans',
                address: '12 Cathedral Road, Cardiff CF10 3NP',
                phone: '07700 900654',
                email: 'morgan.evans@email.com'
              },
              assessors: [
                { id: 'a19', name: 'Ryan Hughes', initials: 'RH' },
                { id: 'a20', name: 'Katie Roberts', initials: 'KR' }
              ],
              revenue: 10
            }
          ]
        }
      ];

      setAreaLeads(mockAreaLeads);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverviewStats = () => {
    const totalRevenue = areaLeads.reduce((sum, area) => sum + area.totalRevenue, 0);
    const missedRevenue = areaLeads.reduce((sum, area) => sum + area.missedRevenue, 0);
    const totalLeads = areaLeads.reduce((sum, area) => sum + area.totalLeads, 0);
    const avgCoverageScore = areaLeads.length > 0
      ? Math.round(areaLeads.reduce((sum, area) => sum + area.coverageScore, 0) / areaLeads.length)
      : 0;

    return {
      totalRevenue,
      missedRevenue,
      totalLeads,
      avgCoverageScore
    };
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 1) return `${days} days ago`;
    if (days === 1) return 'Yesterday';
    if (hours > 1) return `${hours} hours ago`;
    if (hours === 1) return '1 hour ago';
    return 'Just now';
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleAreaExpansion = (areaId: string) => {
    setExpandedAreas(prev =>
      prev.includes(areaId)
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const toggleLeadExpansion = (leadId: string) => {
    setExpandedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const filteredAreas = areaLeads.filter(area => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      area.areaName.toLowerCase().includes(searchLower) ||
      area.topPostcodes.some(p => p.postcode.toLowerCase().includes(searchLower)) ||
      area.recentLeads.some(lead =>
        lead.postcode.toLowerCase().includes(searchLower) ||
        lead.customerDetails?.name.toLowerCase().includes(searchLower)
      )
    );
  });

  if (loading) {
    return (
      <div className="leads-loading">
        <div className="loading-spinner"></div>
        <p>Loading lead analytics...</p>
      </div>
    );
  }

  const stats = getOverviewStats();

  return (
    <div className="leads-management">
      <div className="leads-header">
        <div className="header-content">
          <div>
            <h1>Lead Distribution</h1>
            <p>Monitor customer demand and identify revenue opportunities</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by area, postcode, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="period-filter-dropdown"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-label">Total Leads</div>
          <div className="card-value">{stats.totalLeads}</div>
          <div className="card-sub">Last {dateRange} days</div>
        </div>
        <div className="summary-card success">
          <div className="card-label">Revenue Generated</div>
          <div className="card-value">£{stats.totalRevenue.toLocaleString()}</div>
          <div className="card-sub">From assessor exposures</div>
        </div>
        <div className="summary-card danger">
          <div className="card-label">Missed Revenue</div>
          <div className="card-value">£{stats.missedRevenue.toLocaleString()}</div>
          <div className="card-sub">Due to coverage gaps</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Coverage Score</div>
          <div className="card-value">{stats.avgCoverageScore}%</div>
          <div className="card-sub">Platform average</div>
        </div>
      </div>

      {/* Area Cards with Expandable Content */}
      <div className="area-analytics-section">
        <div className="area-analytics-grid">
          {filteredAreas.map(area => (
            <div key={area.areaId} className="area-analytics-card">
              <div
                className="area-header"
                onClick={() => toggleAreaExpansion(area.areaId)}
              >
                <div className="area-info">
                  <h3>{area.areaName}</h3>
                  <div className="area-stats">
                    <span className="lead-count">{area.totalLeads} leads</span>
                  </div>
                </div>
                <span className={`area-trend-indicator ${area.trend >= 0 ? 'positive' : 'negative'}`}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    {area.trend >= 0 ? (
                      <path d="M6 2L10 8H2L6 2Z" fill="currentColor"/>
                    ) : (
                      <path d="M6 10L10 4H2L6 10Z" fill="currentColor"/>
                    )}
                  </svg>
                  {Math.abs(area.trend)}%
                </span>
              </div>

              {expandedAreas.includes(area.areaId) && (
                <div className="area-expanded-content">
                  {/* Top Postcodes Section */}
                  <div className="area-postcodes">
                    <h4>Top Postcodes</h4>
                    {area.topPostcodes.map((postcode, idx) => (
                      <div key={`${area.areaId}-${postcode.postcode}`} className="postcode-row">
                        <div className="postcode-info">
                          <div className="postcode-code">{postcode.postcode}</div>
                          <div className="postcode-stats">
                            <span className="lead-count">{postcode.leadCount} leads</span>
                          </div>
                        </div>
                        <div className="postcode-indicators">
                          {postcode.needsCoverage && (
                            <span className="needs-coverage-badge">Needs Coverage</span>
                          )}
                          <span className={`trend-indicator ${postcode.trend >= 0 ? 'positive' : 'negative'}`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              {postcode.trend >= 0 ? (
                                <path d="M6 2L10 8H2L6 2Z" fill="currentColor"/>
                              ) : (
                                <path d="M6 10L10 4H2L6 10Z" fill="currentColor"/>
                              )}
                            </svg>
                            {Math.abs(postcode.trend)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Leads Section */}
                  <div className="area-recent-leads">
                    <div className="recent-leads-header">
                      <h4>Recent Leads</h4>
                      <button className="view-all-btn">View all leads</button>
                    </div>
                    <div className="area-leads-list">
                      {area.recentLeads.map(lead => (
                        <div
                          key={lead.id}
                          className={`area-lead-item ${expandedLeads.includes(lead.id) ? 'expanded' : ''}`}
                        >
                          <div
                            className="area-lead-header"
                            onClick={() => toggleLeadExpansion(lead.id)}
                          >
                            <div className="lead-basic-info">
                              <span className="expand-icon">{expandedLeads.includes(lead.id) ? '▼' : '▶'}</span>
                              <span className="lead-postcode">{lead.postcode}</span>
                              <span className="lead-time">{formatTimeAgo(lead.searchedAt)}</span>
                            </div>
                            <div className="assessor-circles">
                              {lead.assessors.length === 4 ? (
                                // Show all 4 when exactly 4 assessors
                                lead.assessors.map((assessor: AssessorInfo, idx: number) => (
                                  <div
                                    key={assessor.id}
                                    className="assessor-circle"
                                    style={{
                                      zIndex: 4 - idx,
                                      marginLeft: idx > 0 ? '-10px' : '0'
                                    }}
                                    title={assessor.name}
                                  >
                                    {assessor.initials}
                                  </div>
                                ))
                              ) : lead.assessors.length > 4 ? (
                                // Show first 3 + overflow for more than 4
                                <>
                                  {lead.assessors.slice(0, 3).map((assessor: AssessorInfo, idx: number) => (
                                    <div
                                      key={assessor.id}
                                      className="assessor-circle"
                                      style={{
                                        zIndex: 3 - idx,
                                        marginLeft: idx > 0 ? '-10px' : '0'
                                      }}
                                      title={assessor.name}
                                    >
                                      {assessor.initials}
                                    </div>
                                  ))}
                                  <div
                                    className="assessor-circle more"
                                    style={{
                                      zIndex: 0,
                                      marginLeft: '-10px'
                                    }}
                                  >
                                    +{lead.assessors.length - 3}
                                  </div>
                                </>
                              ) : (
                                // Show filled circles + empty dotted circles for missing slots
                                <>
                                  {lead.assessors.map((assessor: AssessorInfo, idx: number) => (
                                    <div
                                      key={assessor.id}
                                      className="assessor-circle"
                                      style={{
                                        zIndex: 4 - idx,
                                        marginLeft: idx > 0 ? '-10px' : '0'
                                      }}
                                      title={assessor.name}
                                    >
                                      {assessor.initials}
                                    </div>
                                  ))}
                                  {Array.from({ length: 4 - lead.assessors.length }).map((_, idx) => (
                                    <div
                                      key={`empty-${idx}`}
                                      className="assessor-circle empty"
                                      style={{
                                        zIndex: 4 - (lead.assessors.length + idx),
                                        marginLeft: (lead.assessors.length + idx) > 0 ? '-10px' : '0'
                                      }}
                                      title="Available slot"
                                    >
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>

                          {expandedLeads.includes(lead.id) && lead.customerDetails && (
                            <div className="area-lead-details">
                              <div className="customer-section">
                                <div className="info-row">
                                  <span className="label">Full Address:</span>
                                  <span>{lead.customerDetails.address}</span>
                                </div>
                                <div className="info-row">
                                  <span className="label">Contact:</span>
                                  <span>{lead.customerDetails.name} • {lead.customerDetails.phone}</span>
                                </div>
                              </div>
                              <div className="assessors-section">
                                <span className="label">Assessors</span>
                                <div className="assessor-pills">
                                  {lead.assessors.map((assessor: AssessorInfo) => (
                                    <div key={assessor.id} className="assessor-pill">
                                      {assessor.name}
                                      {assessor.company && <span className="company"> ({assessor.company})</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredAreas.length === 0 && (
        <div className="no-results">
          <h3>No leads found for "{searchTerm}"</h3>
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadsManagement;