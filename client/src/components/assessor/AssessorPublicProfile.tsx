import React, { useState, useEffect } from 'react';

interface AssessorPublicProfileProps {
  token: string;
  assessorId: string;
  assessorName: string;
}

interface ProfileData {
  photo?: string;
  companyDescription: string;
  displayNameOption: 'fullName' | 'businessName' | 'both';
  businessName: string;
  services: {
    energyCertificates: {
      domesticEPC: boolean;
      commercialEPC: boolean;
      displayEnergyCertificates: boolean;
    };
    propertyServices: {
      sapCalculations: boolean;
      floorPlans: boolean;
      photography: boolean;
      carbonMonoxide: boolean;
    };
    energyConsulting: {
      energyAudits: boolean;
      commercialEnergyAudits: boolean;
      retrofitAdvice: boolean;
      energyEfficiencyAdvice: boolean;
      greenDealAdvice: boolean;
      grantAssistance: boolean;
    };
  };
  pricing: {
    domesticEPC?: number;
    commercialEPC?: number;
    displayEnergyCertificates?: number;
  };
  serviceOptions: {
    sameDayService: boolean;
    onlineBooking: boolean;
    cardPayments: boolean;
    payAfterSurvey: boolean;
    freeQuotes: boolean;
    instantEPC: boolean;
  };
  portfolioImages: Array<{ id: number; url: string; title: string }>;
}

const SERVICES = {
  energyCertificates: {
    domesticEPC: "Domestic EPC Certificate",
    commercialEPC: "Commercial EPC Certificate",
    displayEnergyCertificates: "Display Energy Certificates (DECs)"
  },
  propertyServices: {
    sapCalculations: "SAP Calculations",
    floorPlans: "Floor Plans",
    photography: "Photography",
    carbonMonoxide: "Carbon Monoxide Testing"
  },
  energyConsulting: {
    energyAudits: "Energy Audits",
    commercialEnergyAudits: "Commercial Energy Audits",
    retrofitAdvice: "Retrofit Advice",
    energyEfficiencyAdvice: "Energy Efficiency Advice",
    greenDealAdvice: "Green Deal Advice",
    grantAssistance: "Grant Funding and Incentive Program Assistance"
  }
};

const SERVICE_OPTIONS = {
  sameDayService: "Same-Day Service",
  onlineBooking: "Instant Online Booking",
  cardPayments: "Card Payments Accepted",
  payAfterSurvey: "Pay After Survey",
  freeQuotes: "Free Quotes",
  instantEPC: "Instant EPC Certificate"
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const VerificationItem = ({ icon, label, value, badge }: {
  icon: string;
  label: string;
  value?: string;
  badge?: { text: string; className: string };
}) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px'
  }}>
    <span style={{ fontSize: '16px' }}>{icon}</span>
    <span style={{ flex: 1, color: '#374151' }}>{label}</span>
    {badge ? (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        background: badge.text === 'Verified' ? '#f3e8ff' : '#f3f4f6',
        color: badge.text === 'Verified' ? '#7c3aed' : '#6b7280'
      }}>
        {badge.text}
      </span>
    ) : (
      <span style={{ color: '#374151', fontWeight: '500' }}>{value}</span>
    )}
  </div>
);

const AssessorPublicProfile: React.FC<AssessorPublicProfileProps> = ({
  token,
  assessorId,
  assessorName
}) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    companyDescription: '',
    displayNameOption: 'fullName',
    businessName: '',
    services: {
      energyCertificates: {
        domesticEPC: true,
        commercialEPC: false,
        displayEnergyCertificates: false
      },
      propertyServices: {
        sapCalculations: false,
        floorPlans: false,
        photography: false,
        carbonMonoxide: false
      },
      energyConsulting: {
        energyAudits: false,
        commercialEnergyAudits: false,
        retrofitAdvice: false,
        energyEfficiencyAdvice: false,
        greenDealAdvice: false,
        grantAssistance: false
      }
    },
    pricing: {},
    serviceOptions: {
      sameDayService: false,
      onlineBooking: false,
      cardPayments: false,
      payAfterSurvey: false,
      freeQuotes: false,
      instantEPC: false
    },
    portfolioImages: []
  });

  const [characterCount, setCharacterCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const maxCharacters = 500;
  const maxImages = 10;

  useEffect(() => {
    // Mock data - replace with API call
    const mockProfileData: ProfileData = {
      photo: undefined,
      companyDescription: 'Professional EPC assessments with over 10 years of experience. We provide fast, reliable, and competitively priced energy performance certificates for residential and commercial properties.',
      displayNameOption: 'both',
      businessName: 'Energy Certs Pro',
      services: {
        energyCertificates: {
          domesticEPC: true,
          commercialEPC: false,
          displayEnergyCertificates: true
        },
        propertyServices: {
          sapCalculations: true,
          floorPlans: false,
          photography: true,
          carbonMonoxide: false
        },
        energyConsulting: {
          energyAudits: false,
          commercialEnergyAudits: false,
          retrofitAdvice: true,
          energyEfficiencyAdvice: true,
          greenDealAdvice: false,
          grantAssistance: false
        }
      },
      pricing: {
        domesticEPC: 75,
        displayEnergyCertificates: 120
      },
      serviceOptions: {
        sameDayService: true,
        onlineBooking: true,
        cardPayments: true,
        payAfterSurvey: false,
        freeQuotes: true,
        instantEPC: false
      },
      portfolioImages: []
    };

    setProfileData(mockProfileData);
    setCharacterCount(mockProfileData.companyDescription.length);
  }, [token, assessorId]);

  const getDisplayNameValue = () => {
    switch (profileData.displayNameOption) {
      case 'businessName':
        return profileData.businessName || 'Enter business name';
      case 'both':
        return `${profileData.businessName || 'Business Name'} - ${assessorName}`;
      default:
        return assessorName;
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxCharacters) {
      setProfileData(prev => ({ ...prev, companyDescription: text }));
      setCharacterCount(text.length);
    }
  };

  const handleServiceToggle = (category: string, service: string) => {
    setProfileData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [category]: {
          ...prev.services[category as keyof typeof prev.services],
          [service]: !(prev.services[category as keyof typeof prev.services] as any)[service]
        }
      }
    }));
  };

  const handleServiceOptionToggle = (option: string) => {
    setProfileData(prev => ({
      ...prev,
      serviceOptions: {
        ...prev.serviceOptions,
        [option]: !prev.serviceOptions[option as keyof typeof prev.serviceOptions]
      }
    }));
  };

  const handlePriceChange = (service: string, price: string) => {
    const numericPrice = price === '' ? undefined : parseFloat(price);
    setProfileData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [service]: numericPrice
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving profile data:', profileData);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };


  const removeImage = (id: number) => {
    setProfileData(prev => ({
      ...prev,
      portfolioImages: prev.portfolioImages.filter(img => img.id !== id)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (profileData.portfolioImages.length >= 10) return; // Max 10 images

      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          url: event.target?.result as string,
          title: file.name
        };
        setProfileData(prev => ({
          ...prev,
          portfolioImages: [...prev.portfolioImages, newPhoto].slice(0, 10)
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>Company Profile</h1>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#065f46',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '250px',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease'
        }}>
          <span style={{ fontSize: '20px' }}>✓</span>
          <span style={{ fontWeight: '500' }}>Profile saved successfully!</span>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile Image Section */}
          <Card>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '128px',
                    height: '128px',
                    background: '#f3f4f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    {profileData.photo ? (
                      <img src={profileData.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    )}
                  </div>
                  <button style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px 0' }}>Profile Photo</h2>
                  <p style={{ color: '#6b7280', margin: 0 }}>
                    Upload a professional photo or your logo to enhance your profile
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Name Section */}
          <Card>
            <CardContent>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Display Name</h2>
              <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px' }}>
                Choose how customers will see your name
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="displayName"
                    value="fullName"
                    checked={profileData.displayNameOption === 'fullName'}
                    onChange={(e) => setProfileData(prev => ({ ...prev, displayNameOption: e.target.value as any }))}
                    style={{ accentColor: '#667eea' }}
                  />
                  <span style={{ fontSize: '14px' }}>Personal name only</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="displayName"
                    value="businessName"
                    checked={profileData.displayNameOption === 'businessName'}
                    onChange={(e) => setProfileData(prev => ({ ...prev, displayNameOption: e.target.value as any }))}
                    style={{ accentColor: '#667eea' }}
                  />
                  <span style={{ fontSize: '14px' }}>Business name only</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="displayName"
                    value="both"
                    checked={profileData.displayNameOption === 'both'}
                    onChange={(e) => setProfileData(prev => ({ ...prev, displayNameOption: e.target.value as any }))}
                    style={{ accentColor: '#667eea' }}
                  />
                  <span style={{ fontSize: '14px' }}>Business name and personal name</span>
                </label>
              </div>

              <div style={{
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Preview:</div>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>
                  {getDisplayNameValue()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>About</h2>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                  {characterCount}/{maxCharacters} characters
                </span>
              </div>
              <textarea
                style={{
                  width: '100%',
                  height: '128px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                  resize: 'vertical'
                }}
                placeholder="Write a professional bio describing your experience and expertise..."
                maxLength={maxCharacters}
                value={profileData.companyDescription}
                onChange={handleDescriptionChange}
              />
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardContent>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>What You Offer</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Energy Certificates */}
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '16px'
                }}>
                  <h3 style={{
                    fontWeight: '500',
                    marginBottom: '12px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Energy Certificates
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {Object.entries(profileData.services.energyCertificates).map(([key, value]) => (
                      <div key={key} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s ease'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleServiceToggle('energyCertificates', key)}
                        onMouseEnter={(e) => { e.currentTarget.parentElement!.style.backgroundColor = '#f9fafb' }}
                        onMouseLeave={(e) => { e.currentTarget.parentElement!.style.backgroundColor = 'transparent' }}
                        >
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleServiceToggle('energyCertificates', key)}
                            style={{ width: '16px', height: '16px', accentColor: '#667eea' }}
                          />
                          <label style={{ fontSize: '14px', cursor: 'pointer', flex: 1 }}>
                            {SERVICES.energyCertificates[key as keyof typeof SERVICES.energyCertificates]}
                          </label>
                        </div>
                        {value && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '24px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>from £</span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="0"
                              value={profileData.pricing[key as keyof typeof profileData.pricing] || ''}
                              onChange={(e) => handlePriceChange(key, e.target.value)}
                              style={{
                                width: '60px',
                                padding: '4px 6px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Services */}
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '16px'
                }}>
                  <h3 style={{
                    fontWeight: '500',
                    marginBottom: '12px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Property Services
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {Object.entries(profileData.services.propertyServices).map(([key, value]) => (
                      <div key={key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onClick={() => handleServiceToggle('propertyServices', key)}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleServiceToggle('propertyServices', key)}
                          style={{ width: '16px', height: '16px', accentColor: '#667eea' }}
                        />
                        <label style={{ fontSize: '14px', cursor: 'pointer', flex: 1 }}>
                          {SERVICES.propertyServices[key as keyof typeof SERVICES.propertyServices]}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Energy Consulting */}
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '16px'
                }}>
                  <h3 style={{
                    fontWeight: '500',
                    marginBottom: '12px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Energy Consulting
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {Object.entries(profileData.services.energyConsulting).map(([key, value]) => (
                      <div key={key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onClick={() => handleServiceToggle('energyConsulting', key)}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleServiceToggle('energyConsulting', key)}
                          style={{ width: '16px', height: '16px', accentColor: '#667eea' }}
                        />
                        <label style={{ fontSize: '14px', cursor: 'pointer', flex: 1 }}>
                          {SERVICES.energyConsulting[key as keyof typeof SERVICES.energyConsulting]}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Options */}
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '16px'
                }}>
                  <h3 style={{
                    fontWeight: '500',
                    marginBottom: '12px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Customer Options
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {Object.entries(profileData.serviceOptions).map(([key, value]) => (
                      <div key={key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onClick={() => handleServiceOptionToggle(key)}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleServiceOptionToggle(key)}
                          style={{ width: '16px', height: '16px', accentColor: '#667eea' }}
                        />
                        <label style={{ fontSize: '14px', cursor: 'pointer', flex: 1 }}>
                          {SERVICE_OPTIONS[key as keyof typeof SERVICE_OPTIONS]}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card>
            <CardContent>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Photos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {/* Add Photo Box */}
                {profileData.portfolioImages.length < 10 && (
                  <label style={{
                    aspectRatio: '1',
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: '#f9fafb',
                    position: 'relative'
                  }}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>➕</div>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Add Photo</span>
                  </label>
                )}

                {/* Existing Portfolio Items */}
                {profileData.portfolioImages.map((image) => (
                  <div key={image.id} style={{ position: 'relative', aspectRatio: '1', background: '#f3f4f6', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}>
                    <img
                      src={image.url}
                      alt={image.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0)',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-end',
                      padding: '8px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0)' }}
                    >
                      <button
                        onClick={() => removeImage(image.id)}
                        style={{
                          background: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          color: '#dc2626'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '8px',
                      background: 'rgba(0,0,0,0.5)',
                      opacity: 0,
                      transition: 'opacity 0.2s'
                    }}>
                      <p style={{ color: 'white', fontSize: '14px', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {image.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '16px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  {profileData.portfolioImages.length}/{maxImages} images
                </p>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Sticky Save Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '240px', // Account for sidebar width
        right: 0,
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '16px',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
        zIndex: 999
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <button
            onClick={handleSave}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#5a67d8' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#667eea' }}
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Bottom spacing to prevent content being hidden behind sticky bar */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
};

export default AssessorPublicProfile;