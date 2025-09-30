import React, { useState, useEffect } from 'react';
import './PostCodeRegionsPreferences.css';
import { useRegionPreferences } from '../../contexts/RegionPreferencesContext';

interface RegionData {
  [key: string]: string[]; // region -> cities
}

interface PostCodeRegionsPreferencesProps {
  token: string;
  assessorId: string;
  onSave?: (selectedRegions: { [key: string]: string[] }) => void;
}

const PostCodeRegionsPreferences: React.FC<PostCodeRegionsPreferencesProps> = ({
  token,
  assessorId,
  onSave
}) => {
  const { preferences, updatePreferences, isLoading } = useRegionPreferences();
  const [selectedRegions, setSelectedRegions] = useState<{ [key: string]: string[] }>({});
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Available regions and cities (same structure as main page)
  const availableRegions: RegionData = {
    "West Midlands": ["Birmingham", "Coventry", "Wolverhampton"],
    "Greater London": ["Central London", "North London", "East London"],
    "Yorkshire": ["Leeds", "Sheffield", "York"],
    "North West": ["Manchester", "Liverpool", "Preston"],
    "South East": ["Brighton", "Portsmouth", "Southampton"]
  };

  // Load existing preferences from context
  useEffect(() => {
    if (!isLoading && preferences) {
      setSelectedRegions(preferences);
    }
  }, [preferences, isLoading]);

  const toggleSection = (regionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [regionId]: !prev[regionId]
    }));
  };

  const getRegionSelectedCount = (region: string) => {
    return (selectedRegions[region] || []).length;
  };

  const toggleAllCitiesInRegion = (region: string) => {
    const newSelected = { ...selectedRegions };
    const selectedCities = selectedRegions[region] || [];
    const availableCities = availableRegions[region];
    const allSelected = selectedCities.length === availableCities.length;

    if (allSelected) {
      // Deselect all cities in region
      delete newSelected[region];
    } else {
      // Select all cities in region
      newSelected[region] = [...availableCities];
    }

    setSelectedRegions(newSelected);
    setHasChanges(true);
  };

  const toggleCity = (region: string, city: string) => {
    const newSelected = { ...selectedRegions };
    const currentCities = newSelected[region] || [];

    if (currentCities.includes(city)) {
      // Remove city
      const updatedCities = currentCities.filter(c => c !== city);
      if (updatedCities.length === 0) {
        delete newSelected[region];
      } else {
        newSelected[region] = updatedCities;
      }
    } else {
      // Add city
      newSelected[region] = [...currentCities, city];
    }

    setSelectedRegions(newSelected);
    setHasChanges(true);
  };

  const isCitySelected = (region: string, city: string) => {
    return (selectedRegions[region] || []).includes(city);
  };

  const handleSave = () => {
    // Save to context (and localStorage)
    updatePreferences(selectedRegions);
    if (onSave) {
      onSave(selectedRegions);
    }
    setHasChanges(false);
    // Show success message
    console.log('Preferences saved successfully');
  };

  const getTotalSelectedCities = () => {
    return Object.values(selectedRegions).reduce((total, cities) => total + cities.length, 0);
  };

  const filterRegions = () => {
    if (!searchTerm) return availableRegions;

    const searchLower = searchTerm.toLowerCase();
    const filtered: RegionData = {};

    Object.entries(availableRegions).forEach(([region, cities]) => {
      if (region.toLowerCase().includes(searchLower) ||
          cities.some(city => city.toLowerCase().includes(searchLower))) {
        filtered[region] = cities;
      }
    });

    return filtered;
  };

  // Auto-expand regions when searching
  useEffect(() => {
    if (searchTerm) {
      const newOpenSections: { [key: string]: boolean } = {};
      Object.keys(filterRegions()).forEach(region => {
        newOpenSections[region] = true;
      });
      setOpenSections(newOpenSections);
    }
  }, [searchTerm]);

  return (
    <div className="regions-preferences">
      <div className="preferences-header">
        <h2>Post Code Regions</h2>
        <p>Select the regions and cities where you want to work. Only selected areas will appear on your Post Codes page.</p>
      </div>

      <div className="preferences-stats">
        <div className="stat-card">
          <div className="stat-label">Selected Cities</div>
          <div className="stat-value">{getTotalSelectedCities()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Selected Regions</div>
          <div className="stat-value">{Object.keys(selectedRegions).length}</div>
        </div>
      </div>

      <div className="preferences-search">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={searchTerm}
            placeholder="Search regions or cities..."
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

      <div className="regions-selection-container">
        {Object.entries(filterRegions()).map(([region, cities]) => (
          <div key={region} className="region-selection-section">
            <div
              className={`region-selection-header ${openSections[region] ? 'expanded' : ''}`}
              onClick={() => toggleSection(region)}
            >
              <div className="region-selection-title">
                <svg
                  className={`chevron ${openSections[region] ? 'expanded' : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>

                <span className="region-name">{region}</span>

                {getRegionSelectedCount(region) > 0 && (
                  <span className="selection-count">
                    {getRegionSelectedCount(region)} selected
                  </span>
                )}
              </div>
            </div>

            {openSections[region] && (
              <>
                <div className="region-actions">
                  <button
                    onClick={() => toggleAllCitiesInRegion(region)}
                    className="select-all-link"
                  >
                    {getRegionSelectedCount(region) === cities.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                <div className="cities-selection-container">
                  {cities.map(city => (
                    <label key={city} className="city-checkbox-label">
                      <input
                        type="checkbox"
                        checked={isCitySelected(region, city)}
                        onChange={() => toggleCity(region, city)}
                        className="city-checkbox"
                      />
                      <span className="checkbox-custom"></span>
                      <span className="city-name">{city}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="preferences-actions">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`save-button ${hasChanges ? 'has-changes' : ''}`}
        >
          {hasChanges ? 'Save Changes' : 'Saved'}
        </button>
      </div>
    </div>
  );
};

export default PostCodeRegionsPreferences;