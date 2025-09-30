import React, { useState, useEffect } from 'react';
import './AssessorPostCodes.css';
import { useRegionPreferences } from '../../contexts/RegionPreferencesContext';

interface PostcodeData {
  code: string;
  price: number;
  unavailable?: boolean; // taken by another assessor
}

interface AssessorPostCodesProps {
  token: string;
  assessorId: string;
}

const AssessorPostCodes: React.FC<AssessorPostCodesProps> = ({ token, assessorId }) => {
  const { preferences, isLoading } = useRegionPreferences();
  const [selectedForEdit, setSelectedForEdit] = useState<Set<string>>(new Set()); // For bulk operations
  const [activePostcodes, setActivePostcodes] = useState<Set<string>>(new Set()); // Green state
  const [pausedPostcodes, setPausedPostcodes] = useState<Set<string>>(new Set()); // Orange state
  const [searchTerm, setSearchTerm] = useState('');
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [showStateButtons, setShowStateButtons] = useState<{ [key: string]: boolean }>({}); // Track which cities show state buttons

  // Consolidated regions data
  const regions: { [key: string]: { [key: string]: PostcodeData[] } } = {
    "West Midlands": {
      "Birmingham": [
        { code: "B1", price: 4 }, { code: "B2", price: 4 }, { code: "B3", price: 3 },
        { code: "B4", price: 3, unavailable: true }, { code: "B5", price: 5 }, { code: "B6", price: 3 },
        { code: "B7", price: 3, unavailable: true }, { code: "B8", price: 4 }, { code: "B9", price: 3 }
      ],
      "Coventry": [
        { code: "CV1", price: 3 }, { code: "CV2", price: 3 }, { code: "CV3", price: 4 },
        { code: "CV4", price: 4 }, { code: "CV5", price: 3 }, { code: "CV6", price: 3 }
      ],
      "Wolverhampton": [
        { code: "WV1", price: 3 }, { code: "WV2", price: 3 }, { code: "WV3", price: 3 }
      ]
    },
    "Greater London": {
      "Central London": [
        { code: "EC1", price: 6 }, { code: "EC2", price: 6, unavailable: true }, { code: "EC3", price: 5 },
        { code: "EC4", price: 5 }, { code: "WC1", price: 5, unavailable: true }, { code: "WC2", price: 5 }
      ],
      "North London": [
        { code: "N1", price: 5 }, { code: "N2", price: 4 }, { code: "N3", price: 4 },
        { code: "N4", price: 4 }, { code: "N5", price: 5 }, { code: "N6", price: 4 }
      ],
      "East London": [
        { code: "E1", price: 4 }, { code: "E2", price: 4 }, { code: "E3", price: 4 }
      ]
    },
    "Yorkshire": {
      "Leeds": [
        { code: "LS1", price: 4 }, { code: "LS2", price: 4 }, { code: "LS3", price: 3 },
        { code: "LS4", price: 3 }, { code: "LS5", price: 3 }, { code: "LS6", price: 3 }
      ],
      "Sheffield": [
        { code: "S1", price: 4 }, { code: "S2", price: 3 }, { code: "S3", price: 3 },
        { code: "S4", price: 3 }, { code: "S5", price: 3 }, { code: "S6", price: 3 }
      ],
      "York": [
        { code: "YO1", price: 4 }, { code: "YO10", price: 3 }, { code: "YO31", price: 3 }
      ]
    },
    "North West": {
      "Manchester": [
        { code: "M1", price: 4 }, { code: "M2", price: 4 }, { code: "M3", price: 4 },
        { code: "M4", price: 3 }, { code: "M5", price: 3 }, { code: "M6", price: 3 }
      ],
      "Liverpool": [
        { code: "L1", price: 4 }, { code: "L2", price: 4 }, { code: "L3", price: 4 },
        { code: "L4", price: 3 }, { code: "L5", price: 3 }, { code: "L6", price: 3 }
      ],
      "Preston": [
        { code: "PR1", price: 3 }, { code: "PR2", price: 3 }, { code: "PR3", price: 3 }
      ]
    },
    "South East": {
      "Brighton": [
        { code: "BN1", price: 4 }, { code: "BN2", price: 4 }, { code: "BN3", price: 4 }
      ],
      "Portsmouth": [
        { code: "PO1", price: 3 }, { code: "PO2", price: 3 }, { code: "PO3", price: 3 }
      ],
      "Southampton": [
        { code: "SO14", price: 3 }, { code: "SO15", price: 3 }, { code: "SO16", price: 3 }
      ]
    }
  };


  // Handle search and auto-expand
  useEffect(() => {
    if (!searchTerm) {
      setOpenSections({});
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const newOpenSections: { [key: string]: boolean } = { ...openSections };

    Object.entries(regions).forEach(([county, cities]) => {
      const countyMatch = county.toLowerCase().includes(searchLower);

      Object.entries(cities).forEach(([city, postcodes]) => {
        const exactPostcodeMatch = postcodes.some(({code}) =>
          code.toLowerCase() === searchLower
        );
        const cityMatch = city.toLowerCase().includes(searchLower);

        if (countyMatch) {
          newOpenSections[county] = true;
        } else if (cityMatch || exactPostcodeMatch) {
          newOpenSections[county] = true;
          newOpenSections[`${county}-${city}`] = true;
        }
      });
    });

    setOpenSections(newOpenSections);
  }, [searchTerm]);

  const filterRegions = () => {
    let baseRegions = regions;

    // Filter by user preferences from context
    if (preferences && Object.keys(preferences).length > 0) {
      const preferenceFiltered: { [key: string]: { [key: string]: PostcodeData[] } } = {};

      Object.entries(preferences).forEach(([region, selectedCities]) => {
        if (regions[region]) {
          const filteredCities: { [key: string]: PostcodeData[] } = {};
          selectedCities.forEach(city => {
            if (regions[region][city]) {
              filteredCities[city] = regions[region][city];
            }
          });
          if (Object.keys(filteredCities).length > 0) {
            preferenceFiltered[region] = filteredCities;
          }
        }
      });

      baseRegions = preferenceFiltered;
    }

    // Then apply search filter if there's a search term
    if (!searchTerm) return baseRegions;

    const searchLower = searchTerm.toLowerCase();
    const filtered: { [key: string]: { [key: string]: PostcodeData[] } } = {};

    Object.entries(baseRegions).forEach(([county, cities]) => {
      const filteredCities: { [key: string]: PostcodeData[] } = {};

      Object.entries(cities).forEach(([city, postcodes]) => {
        if (
          city.toLowerCase().includes(searchLower) ||
          county.toLowerCase().includes(searchLower) ||
          postcodes.some(({code}) => code.toLowerCase().includes(searchLower))
        ) {
          filteredCities[city] = postcodes;
        }
      });

      if (Object.keys(filteredCities).length > 0) {
        filtered[county] = filteredCities;
      }
    });

    return filtered;
  };

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectAllPostcodes = (county: string, city: string, postcodes: PostcodeData[]) => {
    const cityKey = `${county}-${city}`;
    const newSelected = new Set(selectedForEdit);
    const availablePostcodes = postcodes.filter(({unavailable}) => !unavailable);
    const allSelected = availablePostcodes.every(({code}) => selectedForEdit.has(code));

    availablePostcodes.forEach(({code}) => {
      if (allSelected) {
        newSelected.delete(code);
      } else {
        newSelected.add(code);
      }
    });

    setSelectedForEdit(newSelected);

    // Show state buttons when "Select All" is used and postcodes are selected
    const newShowStateButtons = { ...showStateButtons };
    if (!allSelected && availablePostcodes.length > 0) {
      newShowStateButtons[cityKey] = true;
    } else {
      newShowStateButtons[cityKey] = false;
    }
    setShowStateButtons(newShowStateButtons);
  };

  const getCountyIndicator = (county: string) => {
    let activeCount = 0;
    let pausedCount = 0;

    Object.keys(regions[county]).forEach(city => {
      activeCount += getCityActiveCount(county, city);
      pausedCount += getCityPausedCount(county, city);
    });

    const totalCount = activeCount + pausedCount;
    if (totalCount === 0) return null;

    return {
      count: activeCount > 0 ? activeCount : pausedCount,
      isPaused: activeCount === 0
    };
  };

  const getCityActiveCount = (county: string, city: string) => {
    return regions[county][city].filter(({code}) =>
      activePostcodes.has(code)
    ).length;
  };

  const getCityPausedCount = (county: string, city: string) => {
    return regions[county][city].filter(({code}) =>
      pausedPostcodes.has(code)
    ).length;
  };

  const getTotalActivePostcodes = () => {
    return activePostcodes.size;
  };

  const getTotalPausedPostcodes = () => {
    return pausedPostcodes.size;
  };

  if (isLoading) {
    return (
      <div className="postcode-selector">
        <div className="postcode-header">
          <h1>Post Codes</h1>
          <p>Loading your region preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="postcode-selector">
      <div className="postcode-header">
        <h1>Post Codes</h1>
        <p>Select the post codes where you want to receive leads</p>
      </div>

      <div className="postcode-search">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={searchTerm}
            placeholder="Search post codes or cities..."
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
      </div>

      <div className="postcode-stats">
        <div className="stat-card">
          <div className="stat-label">Active Post Codes</div>
          <div className="stat-value active">{getTotalActivePostcodes()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Paused Post Codes</div>
          <div className="stat-value paused">{getTotalPausedPostcodes()}</div>
        </div>
      </div>

      <div className="regions-container">
        {Object.entries(filterRegions()).map(([county, cities]) => (
          <div key={county} className="region-section">
            <div
              className={`region-header ${openSections[county] ? 'expanded' : ''}`}
              onClick={() => toggleSection(county)}
            >
              <div className="region-title">
                <svg
                  className={`chevron ${openSections[county] ? 'expanded' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <span>{county}</span>
                {getCountyIndicator(county) && (
                  <span className={`count-badge ${
                    getCountyIndicator(county)!.isPaused ? 'paused' : 'active'
                  }`}>
                    {getCountyIndicator(county)!.count}
                  </span>
                )}
              </div>
            </div>

            {openSections[county] && (
              <div className="cities-container">
                {Object.entries(cities).map(([city, postcodes]) => {
                  const cityKey = `${county}-${city}`;
                  // City-level pausing removed - now using individual postcode states
                  const activeCount = getCityActiveCount(county, city);
                  const pausedCount = getCityPausedCount(county, city);
                  const totalCount = activeCount + pausedCount;

                  return (
                    <div key={city} className="city-section">
                      <div
                        className={`city-header ${openSections[cityKey] ? 'expanded' : ''}`}
                        onClick={() => toggleSection(cityKey)}
                      >
                        <div className="city-title">
                          <svg
                            className={`chevron ${openSections[cityKey] ? 'expanded' : ''}`}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                          <span>{city}</span>
                          {totalCount > 0 && (
                            <span className={`count-badge ${activeCount > 0 ? 'active' : 'paused'}`}>
                              {activeCount > 0 ? activeCount : pausedCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {openSections[cityKey] && (
                        <>
                          <div className="city-actions">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAllPostcodes(county, city, postcodes);
                              }}
                              className="action-link"
                            >
                              {postcodes.filter(p => !p.unavailable).every(({code}) => selectedForEdit.has(code)) ? 'Deselect all' : 'Select all'}
                            </button>

                            {/* State Action Buttons - appear when "Select All" is pressed */}
                            {showStateButtons[cityKey] && (() => {
                              const selectedCodes = postcodes.filter(({code}) => selectedForEdit.has(code)).map(({code}) => code);
                              const allActive = selectedCodes.every(code => activePostcodes.has(code));
                              const allPaused = selectedCodes.every(code => pausedPostcodes.has(code));
                              const allOff = selectedCodes.every(code => !activePostcodes.has(code) && !pausedPostcodes.has(code));

                              return (
                                <>
                                  {!allActive && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newActive = new Set(activePostcodes);
                                        const newPaused = new Set(pausedPostcodes);

                                        selectedCodes.forEach(code => {
                                          newActive.add(code);
                                          newPaused.delete(code);
                                        });

                                        setActivePostcodes(newActive);
                                        setPausedPostcodes(newPaused);
                                        setSelectedForEdit(new Set()); // Clear selection
                                        setShowStateButtons({}); // Hide state buttons
                                      }}
                                      className="action-link"
                                    >
                                      Active
                                    </button>
                                  )}
                                  {!allPaused && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newActive = new Set(activePostcodes);
                                        const newPaused = new Set(pausedPostcodes);

                                        selectedCodes.forEach(code => {
                                          newPaused.add(code);
                                          newActive.delete(code);
                                        });

                                        setActivePostcodes(newActive);
                                        setPausedPostcodes(newPaused);
                                        setSelectedForEdit(new Set()); // Clear selection
                                        setShowStateButtons({}); // Hide state buttons
                                      }}
                                      className="action-link"
                                    >
                                      Pause
                                    </button>
                                  )}
                                  {!allOff && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newActive = new Set(activePostcodes);
                                        const newPaused = new Set(pausedPostcodes);

                                        selectedCodes.forEach(code => {
                                          newActive.delete(code);
                                          newPaused.delete(code);
                                        });

                                        setActivePostcodes(newActive);
                                        setPausedPostcodes(newPaused);
                                        setSelectedForEdit(new Set()); // Clear selection
                                        setShowStateButtons({}); // Hide state buttons
                                      }}
                                      className="action-link"
                                    >
                                      Off
                                    </button>
                                  )}
                                </>
                              );
                            })()}

                            {false && ( // Removed old city-level pause - now using individual postcode states
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Old city-level pause logic - now handled by individual postcodes
                                }}
                                className="action-link"
                              >
                                Pause
                              </button>
                            )}
                          </div>

                          <div className="postcodes-container">
                            {postcodes.map(({code, price, unavailable}) => (
                              <button
                                key={code}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (unavailable) return; // Can't select unavailable postcodes

                                  // Don't allow individual selection when bulk mode is active
                                  if (showStateButtons[cityKey]) {
                                    return;
                                  }

                                  // Cycle through states: Available → Active → Paused → Available
                                  const newActive = new Set(activePostcodes);
                                  const newPaused = new Set(pausedPostcodes);

                                  if (activePostcodes.has(code)) {
                                    // Active → Paused
                                    newActive.delete(code);
                                    newPaused.add(code);
                                  } else if (pausedPostcodes.has(code)) {
                                    // Paused → Available (off)
                                    newPaused.delete(code);
                                  } else {
                                    // Available → Active
                                    newActive.add(code);
                                  }

                                  setActivePostcodes(newActive);
                                  setPausedPostcodes(newPaused);
                                }}
                                className={`postcode-pill ${
                                  unavailable
                                    ? 'unavailable'
                                    : selectedForEdit.has(code)
                                      ? 'selected'
                                      : activePostcodes.has(code)
                                        ? 'active'
                                        : pausedPostcodes.has(code)
                                          ? 'paused'
                                          : ''
                                } ${showStateButtons[cityKey] ? 'bulk-mode' : ''}`}
                                disabled={unavailable}
                              >
                                <span>{code}</span>
                                <span className="pill-price">£{price}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessorPostCodes;