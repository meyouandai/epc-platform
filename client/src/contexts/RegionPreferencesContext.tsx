import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RegionPreferences {
  [region: string]: string[];
}

interface RegionPreferencesContextType {
  preferences: RegionPreferences;
  updatePreferences: (newPreferences: RegionPreferences) => void;
  isLoading: boolean;
}

const RegionPreferencesContext = createContext<RegionPreferencesContextType | undefined>(undefined);

interface RegionPreferencesProviderProps {
  children: ReactNode;
  assessorId?: string;
}

export const RegionPreferencesProvider: React.FC<RegionPreferencesProviderProps> = ({
  children,
  assessorId
}) => {
  const [preferences, setPreferences] = useState<RegionPreferences>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial preferences
    // In a real app, this would fetch from API based on assessorId
    const loadPreferences = () => {
      // Simulate API call delay
      setTimeout(() => {
        // Check localStorage first for any saved preferences
        const savedPrefs = localStorage.getItem(`regionPrefs_${assessorId || 'default'}`);

        if (savedPrefs) {
          setPreferences(JSON.parse(savedPrefs));
        } else {
          // Default mock preferences
          const defaultPreferences = {
            "West Midlands": ["Birmingham", "Wolverhampton"],
            "Yorkshire": ["Leeds", "Sheffield"]
          };
          setPreferences(defaultPreferences);
          // Save to localStorage
          localStorage.setItem(
            `regionPrefs_${assessorId || 'default'}`,
            JSON.stringify(defaultPreferences)
          );
        }
        setIsLoading(false);
      }, 100);
    };

    loadPreferences();
  }, [assessorId]);

  const updatePreferences = (newPreferences: RegionPreferences) => {
    setPreferences(newPreferences);
    // Save to localStorage for persistence during session
    localStorage.setItem(
      `regionPrefs_${assessorId || 'default'}`,
      JSON.stringify(newPreferences)
    );

    // In a real app, this would also save to API
    console.log('Saving preferences:', newPreferences);
  };

  return (
    <RegionPreferencesContext.Provider value={{ preferences, updatePreferences, isLoading }}>
      {children}
    </RegionPreferencesContext.Provider>
  );
};

export const useRegionPreferences = () => {
  const context = useContext(RegionPreferencesContext);
  if (!context) {
    throw new Error('useRegionPreferences must be used within a RegionPreferencesProvider');
  }
  return context;
};