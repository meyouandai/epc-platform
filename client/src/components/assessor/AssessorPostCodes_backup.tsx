import React, { useState, useEffect } from 'react';
import './AssessorPostCodes.css';

interface CountyData {
  id: string;
  name: string;
  myPostcodes: number;
  availablePostcodes: number;
  totalPostcodes: number;
  potentialLeads: number;
  districts: DistrictData[];
}

interface DistrictData {
  id: string;
  name: string;
  myPostcodes: number;
  availablePostcodes: number;
  leadsLast30Days: number;
  postcodes: PostcodeData[];
}

interface PostcodeData {
  code: string;
  isCovered: boolean;
  isMyArea: boolean;
  leadsLast30Days: number;
  averageValue: number;
  competition: number;
}

interface AssessorPostCodesProps {
  token: string;
  assessorId: string;
}

const AssessorPostCodes: React.FC<AssessorPostCodesProps> = ({ token, assessorId }) => {
  const [counties, setCounties] = useState<CountyData[]>([]);
  const [expandedCounties, setExpandedCounties] = useState<Set<string>>(new Set());
  const [expandedDistricts, setExpandedDistricts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'available' | 'high-value' | null>(null);

  useEffect(() => {
    fetchMyPostcodeData();
  }, [assessorId]);

  const fetchMyPostcodeData = async () => {
    try {
      // Mock data for demo - replace with real API call
      const mockData: CountyData[] = [
        {
          id: 'london-central',
          name: 'London (Central)',
          myPostcodes: 3,
          availablePostcodes: 18,
          totalPostcodes: 80,
          potentialLeads: 156,
          districts: [
            {
              id: 'city-of-london',
              name: 'City of London',
              myPostcodes: 1,
              availablePostcodes: 15,
              leadsLast30Days: 89,
              postcodes: [
                { code: 'EC1A', isCovered: false, isMyArea: true, leadsLast30Days: 12, averageValue: 185, competition: 1 },
                { code: 'EC1M', isCovered: false, isMyArea: false, leadsLast30Days: 8, averageValue: 165, competition: 0 },
                { code: 'EC1N', isCovered: false, isMyArea: false, leadsLast30Days: 3, averageValue: 155, competition: 0 },
                { code: 'EC1R', isCovered: false, isMyArea: false, leadsLast30Days: 5, averageValue: 170, competition: 0 },
                { code: 'EC1V', isCovered: true, isMyArea: false, leadsLast30Days: 7, averageValue: 160, competition: 2 },
                { code: 'EC2A', isCovered: false, isMyArea: false, leadsLast30Days: 9, averageValue: 195, competition: 0 },
                { code: 'EC2M', isCovered: false, isMyArea: false, leadsLast30Days: 4, averageValue: 150, competition: 0 },
                { code: 'EC2V', isCovered: false, isMyArea: false, leadsLast30Days: 1, averageValue: 140, competition: 0 },
                { code: 'EC3A', isCovered: false, isMyArea: false, leadsLast30Days: 5, averageValue: 175, competition: 0 },
                { code: 'EC4M', isCovered: false, isMyArea: false, leadsLast30Days: 9, averageValue: 190, competition: 0 }
              ]
            },
            {
              id: 'westminster',
              name: 'Westminster',
              myPostcodes: 2,
              availablePostcodes: 3,
              leadsLast30Days: 127,
              postcodes: [
                { code: 'SW1A', isCovered: true, isMyArea: true, leadsLast30Days: 18, averageValue: 220, competition: 4 },
                { code: 'SW1E', isCovered: true, isMyArea: true, leadsLast30Days: 12, averageValue: 210, competition: 3 },
                { code: 'SW1H', isCovered: true, isMyArea: false, leadsLast30Days: 8, averageValue: 195, competition: 2 },
                { code: 'SW1P', isCovered: true, isMyArea: false, leadsLast30Days: 15, averageValue: 215, competition: 4 },
                { code: 'SW1V', isCovered: false, isMyArea: false, leadsLast30Days: 14, averageValue: 205, competition: 0 }
              ]
            }
          ]
        },
        {
          id: 'west-midlands',
          name: 'West Midlands',
          myPostcodes: 2,
          availablePostcodes: 8,
          totalPostcodes: 45,
          potentialLeads: 89,
          districts: [
            {
              id: 'birmingham-central',
              name: 'Birmingham Central',
              myPostcodes: 2,
              availablePostcodes: 3,
              leadsLast30Days: 45,
              postcodes: [
                { code: 'B1', isCovered: false, isMyArea: true, leadsLast30Days: 15, averageValue: 125, competition: 1 },
                { code: 'B2', isCovered: false, isMyArea: true, leadsLast30Days: 12, averageValue: 130, competition: 1 },
                { code: 'B3', isCovered: false, isMyArea: false, leadsLast30Days: 8, averageValue: 120, competition: 0 },
                { code: 'B4', isCovered: true, isMyArea: false, leadsLast30Days: 10, averageValue: 135, competition: 2 }
              ]
            },
            {
              id: 'solihull',
              name: 'Solihull',
              myPostcodes: 0,
              availablePostcodes: 2,
              leadsLast30Days: 12,
              postcodes: [
                { code: 'B90', isCovered: true, isMyArea: false, leadsLast30Days: 6, averageValue: 145, competition: 1 },
                { code: 'B91', isCovered: false, isMyArea: false, leadsLast30Days: 6, averageValue: 140, competition: 0 }
              ]
            }
          ]
        }
      ];

      setCounties(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching postcode data:', error);
      setLoading(false);
    }
  };

  const toggleCountyExpansion = (countyId: string) => {
    const newExpanded = new Set(expandedCounties);
    if (newExpanded.has(countyId)) {
      newExpanded.delete(countyId);
    } else {
      newExpanded.add(countyId);
    }
    setExpandedCounties(newExpanded);
  };

  const toggleDistrictExpansion = (districtId: string) => {
    const newExpanded = new Set(expandedDistricts);
    if (newExpanded.has(districtId)) {
      newExpanded.delete(districtId);
    } else {
      newExpanded.add(districtId);
    }
    setExpandedDistricts(newExpanded);
  };

  const handleCardFilter = (filterType: 'available' | 'high-value') => {
    if (activeFilter === filterType) {
      setActiveFilter(null);
      setSearchTerm('');
    } else {
      setActiveFilter(filterType);
      setSearchTerm('');
    }
  };

  const filterCounties = () => {
    let filtered = counties;

    if (activeFilter === 'available') {
      filtered = filtered.filter(county => county.availablePostcodes > 0);
    } else if (activeFilter === 'high-value') {
      filtered = filtered.filter(county =>
        county.districts.some(district =>
          district.postcodes.some(postcode =>
            !postcode.isCovered && postcode.averageValue > 180
          )
        )
      );
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(county =>
        county.name.toLowerCase().includes(searchLower) ||
        county.districts.some(district =>
          district.name.toLowerCase().includes(searchLower) ||
          district.postcodes.some(postcode =>
            postcode.code.toLowerCase().includes(searchLower)
          )
        )
      );
    }

    return filtered;
  };

  const getTotalStats = () => {
    return counties.reduce((acc, county) => ({
      myPostcodes: acc.myPostcodes + county.myPostcodes,
      availablePostcodes: acc.availablePostcodes + county.availablePostcodes,
      totalPostcodes: acc.totalPostcodes + county.totalPostcodes,
      potentialLeads: acc.potentialLeads + county.potentialLeads
    }), { myPostcodes: 0, availablePostcodes: 0, totalPostcodes: 0, potentialLeads: 0 });
  };

  const getPostcodeStatusBadge = (postcode: PostcodeData) => {
    if (postcode.isMyArea) {
      return <span className="status-badge my-area">My Area</span>;
    } else if (postcode.isCovered) {
      return <span className="status-badge covered">Covered</span>;
    } else {
      return <span className="status-badge available">Available</span>;
    }
  };

  // Auto-expand logic when searching
  const shouldAutoExpand = searchTerm.trim() !== '';

  React.useEffect(() => {
    if (shouldAutoExpand) {
      const newExpandedCounties = new Set<string>();
      const newExpandedDistricts = new Set<string>();

      counties.forEach(county => {
        const hasMatch = county.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          county.districts.some(district =>
            district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            district.postcodes.some(postcode =>
              postcode.code.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );

        if (hasMatch) {
          newExpandedCounties.add(county.id);
          county.districts.forEach(district => {
            const districtHasMatch = district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              district.postcodes.some(postcode =>
                postcode.code.toLowerCase().includes(searchTerm.toLowerCase())
              );
            if (districtHasMatch) {
              newExpandedDistricts.add(district.id);
            }
          });
        }
      });

      setExpandedCounties(newExpandedCounties);
      setExpandedDistricts(newExpandedDistricts);
    } else {
      setExpandedCounties(new Set());
      setExpandedDistricts(new Set());
    }
  }, [searchTerm, counties]);

  if (loading) {
    return (
      <div className="coverage-loading">
        <div className="loading-spinner"></div>
        <p>Loading your postcode areas...</p>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="coverage-management">
      <div className="coverage-header">
        <div className="header-content">
          <div>
            <h1>My Post Codes</h1>
            <p>Manage your coverage areas and discover new opportunities</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card success">
          <div className="card-label">My Areas</div>
          <div className="card-value">{stats.myPostcodes}</div>
          <div className="card-sub">Active postcodes</div>
        </div>
        <div
          className={`summary-card primary ${activeFilter === 'available' ? 'active-filter' : ''}`}
          onClick={() => handleCardFilter('available')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-label">Available</div>
          <div className="card-value">{stats.availablePostcodes}</div>
          <div className="card-sub">{activeFilter === 'available' ? 'Click to clear filter' : 'Postcodes to claim'}</div>
        </div>
        <div
          className={`summary-card warning ${activeFilter === 'high-value' ? 'active-filter' : ''}`}
          onClick={() => handleCardFilter('high-value')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-label">High Value</div>
          <div className="card-value">{counties.reduce((count, county) =>
            count + county.districts.reduce((districtCount, district) =>
              districtCount + district.postcodes.filter(p => !p.isCovered && p.averageValue > 180).length, 0), 0)}</div>
          <div className="card-sub">{activeFilter === 'high-value' ? 'Click to clear filter' : '£180+ average'}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Potential Leads</div>
          <div className="card-value">{stats.potentialLeads}</div>
          <div className="card-sub">Last 30 days</div>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-box">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search areas or postcodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Coverage Areas */}
      <div className="coverage-areas">
        {filterCounties().map(county => {
          const isCountyExpanded = expandedCounties.has(county.id);

          return (
            <div key={county.id} className="area-section">
              {/* Area Header */}
              <div
                className={`area-header ${isCountyExpanded ? 'expanded' : ''}`}
                onClick={() => toggleCountyExpansion(county.id)}
              >
                <div className="area-title">
                  <span>{isCountyExpanded ? '▼' : '▶'}</span>
                  <span className="area-name">{county.name}</span>
                </div>
              </div>

              {/* Area Content */}
              {isCountyExpanded && (
                <div className="area-content">
                  {county.districts.map(district => {
                    const isDistrictExpanded = expandedDistricts.has(district.id);

                    return (
                      <div key={district.id} className="district-section">
                        <div
                          className="district-header"
                          onClick={() => toggleDistrictExpansion(district.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span>{isDistrictExpanded ? '▼' : '▶'}</span>
                          <h3 className="district-name">{district.name}</h3>
                        </div>

                        {isDistrictExpanded && (
                          <>
                            <div className="area-actions">
                              <a href="#" className="action-link">Select All</a>
                              <a href="#" className="action-link">Pause</a>
                            </div>

                            <div className="postcodes-pills-container">
                              {district.postcodes.map(postcode => {
                                let pillClass = 'postcode-pill';
                                if (postcode.isMyArea) {
                                  pillClass += ' my-area';
                                } else if (postcode.isCovered) {
                                  pillClass += ' covered';
                                } else {
                                  pillClass += ' available';
                                }

                                // Calculate price based on average value (simplified)
                                const price = Math.round(postcode.averageValue / 10);

                                return (
                                  <div
                                    key={postcode.code}
                                    className={pillClass}
                                    onClick={() => {
                                      if (!postcode.isCovered) {
                                        console.log('Selected postcode:', postcode.code);
                                      }
                                    }}
                                  >
                                    <span className="pill-code">{postcode.code}</span>
                                    <span className="pill-price">£{price}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessorPostCodes;