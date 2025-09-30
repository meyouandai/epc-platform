import React, { useState, useEffect } from 'react';
import './AssessorLeads.css';

interface Lead {
  id: string;
  postcode: string;
  customerName: string;
  price: number;
  date: Date;
  address: string;
  phone: string;
  email: string;
  propertyType: 'residential' | 'commercial';
  bedrooms?: number;
  timeframe: 'immediate' | 'within_week' | 'within_month' | 'flexible';
  additionalInfo?: string;
}

interface AssessorLeadsProps {
  token: string;
  assessorId: string;
}

const AssessorLeads: React.FC<AssessorLeadsProps> = ({ token, assessorId }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(6);
  const [dateFilter, setDateFilter] = useState('last7'); // 'today', 'last7', 'last30', 'all'

  useEffect(() => {
    // Load mock leads data with current dates
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const mockLeads: Lead[] = [
      {
        id: 'lead-1',
        postcode: 'B1 3DL',
        customerName: 'Sarah Johnson',
        price: 3,
        date: new Date(today.getTime() + 9 * 60 * 60 * 1000 + 5 * 60 * 1000), // Today at 9:05
        address: '123 High Street, Birmingham, B1 3DL',
        phone: '07712 345678',
        email: 'sarah.johnson@email.com',
        propertyType: 'residential',
        bedrooms: 3,
        timeframe: 'immediate',
        additionalInfo: 'Property has recently been renovated. All rooms accessible.'
      },
      {
        id: 'lead-2',
        postcode: 'CV1 2NT',
        customerName: 'David Chen',
        price: 4,
        date: new Date(today.getTime() + 8 * 60 * 60 * 1000 + 30 * 60 * 1000), // Today at 8:30
        address: 'Unit 5, Business Park, Coventry, CV1 2NT',
        phone: '07856 234567',
        email: 'david.chen@business.co.uk',
        propertyType: 'commercial',
        timeframe: 'within_week',
        additionalInfo: 'Please call building manager to get access. Main entrance on West Street.'
      },
      {
        id: 'lead-3',
        postcode: 'B15 2TT',
        customerName: 'Emma Thompson',
        price: 2,
        date: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000 + 45 * 60 * 1000), // Yesterday at 16:45
        address: 'Flat 3B, Oak Court, Moseley, Birmingham, B15 2TT',
        phone: '07923 456789',
        email: 'emma.thompson@gmail.com',
        propertyType: 'residential',
        bedrooms: 2,
        timeframe: 'within_month',
        additionalInfo: 'Flat is on the 3rd floor. No lift available.'
      },
      {
        id: 'lead-4',
        postcode: 'LS1 4DP',
        customerName: 'Manchester Properties Ltd',
        price: 3,
        date: new Date(today.getTime() - 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000 + 20 * 60 * 1000), // Yesterday at 11:20
        address: 'Tower A, City Square, Leeds, LS1 4DP',
        phone: '0113 456 7890',
        email: 'contact@manchesterprops.com',
        propertyType: 'commercial',
        timeframe: 'flexible',
        additionalInfo: 'Large office complex. Multiple units to assess. Contact reception first.'
      },
      {
        id: 'lead-5',
        postcode: 'WV1 1SE',
        customerName: 'Robert Wilson',
        price: 3,
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 15 * 60 * 1000), // 2 days ago at 14:15
        address: '42 Market Street, Wolverhampton, WV1 1SE',
        phone: '07434 567890',
        email: 'r.wilson@email.com',
        propertyType: 'residential',
        bedrooms: 1,
        timeframe: 'immediate',
        additionalInfo: 'Studio apartment above shop. Side entrance.'
      },
      {
        id: 'lead-6',
        postcode: 'B12 9QW',
        customerName: 'Lisa Martinez',
        price: 4,
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000 + 30 * 60 * 1000), // 3 days ago at 10:30
        address: '15 Victorian Terrace, Selly Oak, Birmingham, B12 9QW',
        phone: '07567 890123',
        email: 'lisa.martinez@gmail.com',
        propertyType: 'residential',
        bedrooms: 4,
        timeframe: 'within_week',
        additionalInfo: 'Victorian terrace house. Original features preserved.'
      },
      {
        id: 'lead-7',
        postcode: 'CV2 4RT',
        customerName: 'Tech Solutions Ltd',
        price: 4,
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000 + 15 * 60 * 1000), // 3 days ago at 9:15
        address: 'Tech House, Innovation Drive, Coventry, CV2 4RT',
        phone: '024 7788 9900',
        email: 'facilities@techsolutions.co.uk',
        propertyType: 'commercial',
        timeframe: 'flexible',
        additionalInfo: 'Modern office building. 24/7 access available.'
      },
      {
        id: 'lead-8',
        postcode: 'LS2 8HG',
        customerName: 'Michael Brown',
        price: 2,
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000 + 45 * 60 * 1000), // 4 days ago at 15:45
        address: 'Flat 12, The Old Mill, Headingley, Leeds, LS2 8HG',
        phone: '07789 123456',
        email: 'm.brown@hotmail.com',
        propertyType: 'residential',
        bedrooms: 2,
        timeframe: 'within_month',
        additionalInfo: 'First floor flat in converted mill. Parking available.'
      }
    ];

    // Sort by date (most recent first)
    mockLeads.sort((a, b) => b.date.getTime() - a.date.getTime());
    setLeads(mockLeads);
    setIsLoading(false);
  }, [assessorId]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const leadDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const timeString = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    if (leadDate.getTime() === today.getTime()) {
      return `Today at ${timeString}`;
    } else if (leadDate.getTime() === yesterday.getTime()) {
      return `Yesterday at ${timeString}`;
    } else {
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatTimeframe = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return 'Immediate';
      case 'within_week': return 'Within 1 week';
      case 'within_month': return 'Within 1 month';
      case 'flexible': return 'Flexible';
      default: return timeframe;
    }
  };

  const toggleLead = (leadId: string) => {
    const newExpanded = new Set(expandedLeads);
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId);
    } else {
      newExpanded.add(leadId);
    }
    setExpandedLeads(newExpanded);
  };

  const getDateFilteredLeads = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return leads.filter(lead => {
      switch (dateFilter) {
        case 'today':
          const leadDate = new Date(lead.date.getFullYear(), lead.date.getMonth(), lead.date.getDate());
          return leadDate.getTime() === today.getTime();
        case 'last7':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return lead.date >= weekAgo;
        case 'last30':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return lead.date >= monthAgo;
        case 'all':
        default:
          return true;
      }
    });
  };

  const filteredLeads = getDateFilteredLeads().filter(lead =>
    lead.postcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalLeads = filteredLeads.length;
  const totalPages = Math.ceil(totalLeads / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const endIndex = startIndex + leadsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);
  const displayStart = totalLeads === 0 ? 0 : startIndex + 1;
  const displayEnd = Math.min(endIndex, totalLeads);

  // Reset to page 1 when search or date filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of leads list
    document.querySelector('.leads-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="leads-container">
        <div className="leads-header">
          <h1>My Leads</h1>
          <p>Loading your leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leads-container">
      <div className="leads-header">
        <h1>My Leads</h1>
        <p>Manage and track your EPC assessment leads</p>
      </div>

      <div className="leads-search">
        <div className="search-controls">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchTerm}
              placeholder="Search leads by postcode, name, or email..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search"
              >
                ×
              </button>
            )}
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="date-filter"
          >
            <option value="today">Today</option>
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="leads-summary-cards">
        <div className="summary-card">
          <div className="card-label">Total Leads</div>
          <div className="card-value">{filteredLeads.length}</div>
          <div className="card-sub">All matching leads</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Top Post Codes</div>
          <div className="card-value">
            {(() => {
              // Count leads per postcode area (first part before space)
              const postcodeCount: { [key: string]: number } = {};
              filteredLeads.forEach(lead => {
                const area = lead.postcode.split(' ')[0]; // Get WV1 from "WV1 2AB"
                postcodeCount[area] = (postcodeCount[area] || 0) + 1;
              });

              // Sort and get top postcodes
              const topPostcodes = Object.entries(postcodeCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);

              if (topPostcodes.length === 0) return '-';

              return (
                <div className="top-postcodes">
                  {topPostcodes.map(([code, count], index) => (
                    <div key={code} className="postcode-line">
                      {code}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
          <div className="card-sub">Most active areas</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Average Lead Price</div>
          <div className="card-value">
            £{filteredLeads.length > 0
              ? Math.round(filteredLeads.reduce((sum, lead) => sum + lead.price, 0) / filteredLeads.length)
              : 0}
          </div>
          <div className="card-sub">Per lead value</div>
        </div>
      </div>

      <div className="leads-list">
        {currentLeads.length === 0 ? (
          <div className="no-leads">
            {searchTerm ? 'No leads match your search.' : 'No leads yet.'}
          </div>
        ) : (
          currentLeads.map(lead => (
            <div key={lead.id} className={`lead-card ${expandedLeads.has(lead.id) ? 'expanded' : ''}`}>
              <div
                className="lead-header"
                onClick={() => toggleLead(lead.id)}
              >
                <div className="lead-basic-info">
                  <div className="lead-postcode">{lead.postcode}</div>
                  <div className="lead-date">{formatDate(lead.date)}</div>
                  <div className="lead-customer">{lead.customerName}</div>
                </div>
                <div className="lead-price">£{lead.price}</div>
                <svg
                  className={`chevron ${expandedLeads.has(lead.id) ? 'expanded' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {expandedLeads.has(lead.id) && (
                <div className="lead-details">
                  <div className="lead-details-columns">
                    <div className="contact-details">
                      <h4>Contact Details</h4>
                      <div className="detail-item">
                        <label>Address:</label>
                        <span>{lead.address}</span>
                      </div>
                      <div className="detail-item">
                        <label>Phone:</label>
                        <a href={`tel:${lead.phone}`} className="contact-link">{lead.phone}</a>
                      </div>
                      <div className="detail-item">
                        <label>Email:</label>
                        <a href={`mailto:${lead.email}`} className="contact-link">{lead.email}</a>
                      </div>
                    </div>

                    <div className="property-details">
                      <h4>Property Details</h4>
                      <div className="detail-item">
                        <label>Type:</label>
                        <span>{lead.propertyType.charAt(0).toUpperCase() + lead.propertyType.slice(1)}</span>
                      </div>
                      {lead.bedrooms && (
                        <div className="detail-item">
                          <label>Bedrooms:</label>
                          <span>{lead.bedrooms}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <label>Timeframe:</label>
                        <span>{formatTimeframe(lead.timeframe)}</span>
                      </div>
                    </div>
                  </div>

                  {lead.additionalInfo && (
                    <div className="additional-info">
                      <h4>Additional Information</h4>
                      <p>{lead.additionalInfo}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {totalLeads > 0 && (
        <div className="pagination-info bottom">
          <span className="showing-text">
            Showing {displayStart}-{displayEnd} of {totalLeads} leads
          </span>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}

      <div className="archive-notice">
        Leads older than 30 days can be found in <a href="#" className="archive-link">archived leads</a>
      </div>
    </div>
  );
};

export default AssessorLeads;