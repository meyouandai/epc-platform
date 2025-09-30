import React, { useState, useEffect } from 'react';

interface CountyData {
  id: string;
  name: string;
  assessorCount: number;
  districtCount: number;
  totalPostcodes: number;
  activePostcodes: number;
  districts: DistrictData[];
}

interface DistrictData {
  id: string;
  name: string;
  assessorCount: number;
  leadsLast30Days: number;
  leadsPrevious30Days: number;
  postcodes: PostcodeData[];
}

interface PostcodeData {
  code: string;
  assessorCount: number;
  leadsLast30Days: number;
  leadsPrevious30Days?: number;
}

interface CoverageManagementProps {
  token: string;
}

const CoverageManagement: React.FC<CoverageManagementProps> = ({ token }) => {
  const [counties, setCounties] = useState<CountyData[]>([]);
  const [expandedCounties, setExpandedCounties] = useState<Set<string>>(new Set());
  const [expandedDistricts, setExpandedDistricts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'low' | 'gaps' | null>(null);

  useEffect(() => {
    fetchCoverageData();
  }, []);

  const fetchCoverageData = async () => {
    try {
      const response = await fetch('/api/admin/coverage', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch coverage data');
      }

      const data = await response.json();

      if (data.success) {
        // Transform the backend data to match the frontend interface
        const transformedData: CountyData[] = data.areas.map((area: any) => ({
          id: area.areaCode.toLowerCase(),
          name: area.areaName,
          assessorCount: area.assessorCount,
          districtCount: 1, // Simplified for now
          totalPostcodes: area.postcodeCount,
          activePostcodes: area.postcodeCount,
          districts: [
            {
              id: area.areaCode.toLowerCase() + '-district',
              name: area.areaName,
              assessorCount: area.assessorCount,
              leadsLast30Days: area.totalLeads,
              leadsPrevious30Days: area.totalLeads,
              postcodes: []
            }
          ]
        }));

        setCounties(transformedData);
      } else {
        setCounties([]);
      }
    } catch (error) {
      console.error('Error fetching coverage data:', error);
      setCounties([]);
    } finally {
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

  const getTotalStats = () => {
    return counties.reduce(
      (acc, county) => ({
        totalAssessors: acc.totalAssessors + county.assessorCount,
        totalCounties: acc.totalCounties + 1,
        totalDistricts: acc.totalDistricts + county.districtCount,
        totalPostcodes: acc.totalPostcodes + county.totalPostcodes,
        activePostcodes: acc.activePostcodes + county.activePostcodes
      }),
      { totalAssessors: 0, totalCounties: 0, totalDistricts: 0, totalPostcodes: 0, activePostcodes: 0 }
    );
  };

  const handleCardFilter = (filterType: 'low' | 'gaps') => {
    if (activeFilter === filterType) {
      setActiveFilter(null); // Toggle off if same filter clicked
    } else {
      setActiveFilter(filterType);
      setSearchTerm(''); // Clear search when filtering
    }
  };

  const isLowCoverage = (assessorCount: number) => {
    return assessorCount > 0 && assessorCount <= 2; // 1-2 assessors = low coverage
  };

  const isCoverageGap = (assessorCount: number) => {
    return assessorCount === 0; // 0 assessors = coverage gap
  };

  const getTrendIndicator = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null;

    const percentChange = Math.round(((current - previous) / previous) * 100);

    if (current > previous) {
      return (
        <span className="trend-indicator trend-up">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 9L6 5L10 9" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          +{percentChange}%
        </span>
      );
    }

    if (current < previous) {
      return (
        <span className="trend-indicator trend-down">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 3L6 7L10 3" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {percentChange}%
        </span>
      );
    }

    return (
      <span className="trend-indicator trend-stable">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L10 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        0%
      </span>
    );
  };

  // Auto-expand logic when searching
  const shouldAutoExpand = searchTerm.trim() !== '';

  React.useEffect(() => {
    if (shouldAutoExpand) {
      // Auto-expand counties and districts when searching
      const newExpandedCounties = new Set<string>();
      const newExpandedDistricts = new Set<string>();

      counties.forEach(county => {
        const hasMatch = county.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          county.districts.some(district =>
            district.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            district.postcodes.some(postcode =>
              postcode.code.toLowerCase().startsWith(searchTerm.toLowerCase())
            )
          );

        if (hasMatch) {
          newExpandedCounties.add(county.id);

          // Also expand districts that have matching postcodes
          county.districts.forEach(district => {
            const districtHasMatch = district.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
              district.postcodes.some(postcode =>
                postcode.code.toLowerCase().startsWith(searchTerm.toLowerCase())
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
      // Collapse all when search is cleared
      setExpandedCounties(new Set());
      setExpandedDistricts(new Set());
    }
  }, [searchTerm, counties]);

  const filteredCounties = counties.filter(county => {
    // First apply search filter
    const searchMatch = county.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      county.districts.some(district =>
        district.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        district.postcodes.some(postcode =>
          postcode.code.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
      );

    if (searchTerm && !searchMatch) return false;

    // Then apply card filters
    if (activeFilter === 'low') {
      return county.districts.some(district => isLowCoverage(district.assessorCount));
    }
    if (activeFilter === 'gaps') {
      return county.districts.some(district => isCoverageGap(district.assessorCount));
    }

    return searchTerm ? searchMatch : true;
  }).map(county => ({
    ...county,
    districts: county.districts.filter(district => {
      // When searching, include districts that have matching postcodes
      if (searchTerm) {
        const districtMatch = district.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          district.postcodes.some(postcode =>
            postcode.code.toLowerCase().startsWith(searchTerm.toLowerCase())
          );
        if (!districtMatch) return false;
      }

      if (activeFilter === 'low') {
        return isLowCoverage(district.assessorCount);
      }
      if (activeFilter === 'gaps') {
        return isCoverageGap(district.assessorCount);
      }
      return true;
    }).map(district => ({
      ...district,
      postcodes: district.postcodes.filter(postcode => {
        // When searching, only show matching postcodes
        if (searchTerm) {
          return postcode.code.toLowerCase().startsWith(searchTerm.toLowerCase());
        }
        return true;
      })
    }))
  }));

  if (loading) {
    return (
      <div className="coverage-loading">
        <div className="loading-spinner"></div>
        <p>Loading coverage data...</p>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="coverage-management">
      <div className="coverage-header">
        <div className="header-content">
          <div>
            <h1>Coverage Management</h1>
            <p>Manage assessor coverage areas across counties and postcodes (Updated Structure)</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-label">Total Assessors</div>
          <div className="card-value">{stats.totalAssessors}</div>
          <div className="card-sub">Across all regions</div>
        </div>
        <div className="summary-card success">
          <div className="card-label">Total Coverage</div>
          <div className="card-value">{Math.round((stats.activePostcodes / stats.totalPostcodes) * 100)}%</div>
          <div className="card-sub">{stats.activePostcodes} of {stats.totalPostcodes} areas</div>
        </div>
        <div
          className={`summary-card warning ${activeFilter === 'low' ? 'active-filter' : ''}`}
          onClick={() => handleCardFilter('low')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-label">Low Coverage</div>
          <div className="card-value">{Math.floor((stats.totalPostcodes - stats.activePostcodes) * 0.6)}</div>
          <div className="card-sub">{activeFilter === 'low' ? 'Click to clear filter' : 'Areas need attention'}</div>
        </div>
        <div
          className={`summary-card danger ${activeFilter === 'gaps' ? 'active-filter' : ''}`}
          onClick={() => handleCardFilter('gaps')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-label">Coverage Gaps</div>
          <div className="card-value">{stats.totalPostcodes - stats.activePostcodes}</div>
          <div className="card-sub">{activeFilter === 'gaps' ? 'Click to clear filter' : 'No assessors'}</div>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search counties, districts, or postcodes..."
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
        {activeFilter && (
          <div className="filter-indicator">
            <span>Showing {activeFilter === 'low' ? 'Low Coverage' : 'Coverage Gaps'} areas</span>
            <button
              className="clear-filter-btn"
              onClick={() => setActiveFilter(null)}
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Coverage Table */}
      <div className="coverage-table">
        <div className="table-header">
          <div className="header-row">
            <div className="header-cell"></div>
            <div className="header-cell name-col">Area</div>
            <div className="header-cell">Assessors</div>
            <div className="header-cell">Districts</div>
            <div className="header-cell">Postcodes</div>
            <div className="header-cell">Coverage</div>
            <div className="header-cell">Leads Last 30 Days</div>
          </div>
        </div>

        <div className="table-body">
          {filteredCounties.map((county) => {
            const isCountyExpanded = expandedCounties.has(county.id);
            const coveragePercentage = Math.round((county.activePostcodes / county.totalPostcodes) * 100);

            return (
              <div key={county.id} className="table-section">
                {/* County Row */}
                <div
                  className={`table-row county-row ${isCountyExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleCountyExpansion(county.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="table-cell">
                    <button
                      className="expand-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCountyExpansion(county.id);
                      }}
                    >
                      {isCountyExpanded ? '▼' : '▶'}
                    </button>
                  </div>
                  <div className="table-cell name-col">
                    <span className="location-name">{county.name}</span>
                  </div>
                  <div className="table-cell">
                    <span className="metric-value">{county.assessorCount}</span>
                  </div>
                  <div className="table-cell">
                    <span className="metric-value">{county.districtCount}</span>
                  </div>
                  <div className="table-cell">
                    <span className="metric-value">{county.activePostcodes}/{county.totalPostcodes}</span>
                  </div>
                  <div className="table-cell">
                    <div className="coverage-bar">
                      <div
                        className="coverage-fill"
                        style={{ width: `${coveragePercentage}%` }}
                      ></div>
                      <span className="coverage-text">{coveragePercentage}%</span>
                    </div>
                  </div>
                  <div className="table-cell">
                    <span className="metric-value">
                      {county.districts.reduce((sum, d) => sum + d.leadsLast30Days, 0)} {getTrendIndicator(
                        county.districts.reduce((sum, d) => sum + d.leadsLast30Days, 0),
                        county.districts.reduce((sum, d) => sum + d.leadsPrevious30Days, 0)
                      )}
                    </span>
                  </div>
                </div>

                {/* District Rows */}
                {isCountyExpanded && county.districts.map((district) => {
                  const isDistrictExpanded = expandedDistricts.has(district.id);
                  const activePostcodes = district.postcodes.filter(p => p.assessorCount > 0).length;
                  const districtCoverage = Math.round((activePostcodes / district.postcodes.length) * 100);

                  return (
                    <div key={district.id} className="district-section">
                      {/* District Row */}
                      <div
                        className="table-row district-row"
                        onClick={() => toggleDistrictExpansion(district.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="table-cell expand-col">
                          <button
                            className="expand-btn district-expand"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDistrictExpansion(district.id);
                            }}
                          >
                            {isDistrictExpanded ? '▼' : '▶'}
                          </button>
                        </div>
                        <div className="table-cell name-col">
                          <span className="district-name">{district.name}</span>
                        </div>
                        <div className="table-cell assessors-col">
                          <span className="assessor-count">{district.assessorCount}</span>
                        </div>
                        <div className="table-cell districts-col">
                          -
                        </div>
                        <div className="table-cell postcodes-col">
                          {activePostcodes}/{district.postcodes.length}
                        </div>
                        <div className="table-cell coverage-col">
                          <div className="coverage-bar small">
                            <div
                              className="coverage-fill"
                              style={{ width: `${districtCoverage}%` }}
                            ></div>
                            <span className="coverage-text">{districtCoverage}%</span>
                          </div>
                        </div>
                        <div className="table-cell">
                          <span
                            className="metric-value leads-count"
                            data-priority={district.leadsLast30Days > 30 && district.assessorCount < 4 ? 'high' : ''}
                          >
                            {district.leadsLast30Days} {getTrendIndicator(district.leadsLast30Days, district.leadsPrevious30Days)}
                          </span>
                        </div>
                      </div>

                      {/* Postcode Rows */}
                      {isDistrictExpanded && (
                        <div className="postcodes-list">
                          {district.postcodes.map((postcode, index) => (
                            <div key={index} className="table-row postcode-row">
                              <div className="table-cell expand-col"></div>
                              <div className="table-cell name-col">
                                <span className="postcode-name">{postcode.code}</span>
                              </div>
                              <div className="table-cell assessors-col">
                                <span
                                  className="assessor-count"
                                  data-capacity={postcode.assessorCount === 4 ? 'full' : postcode.assessorCount >= 2 ? 'medium' : 'low'}
                                >
                                  {postcode.assessorCount}/4
                                </span>
                              </div>
                              <div className="table-cell districts-col">
                                -
                              </div>
                              <div className="table-cell postcodes-col">
                                -
                              </div>
                              <div className="table-cell coverage-col">
                                -
                              </div>
                              <div className="table-cell">
                                <span
                                  className="metric-value leads-count"
                                  data-priority={postcode.leadsLast30Days > 8 && postcode.assessorCount < 2 ? 'high' : ''}
                                >
                                  {postcode.leadsLast30Days} {getTrendIndicator(postcode.leadsLast30Days, postcode.leadsPrevious30Days)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {filteredCounties.length === 0 && (
        <div className="no-results">
          <h3>No coverage areas found for "{searchTerm}"</h3>
          <button
            className="clear-search-btn"
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverageManagement;