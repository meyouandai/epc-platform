import React, { useState } from 'react';
import PostCodeRegionsPreferences from './PostCodeRegionsPreferences';

interface AssessorProfileProps {
  token: string;
  assessorId: string;
  assessorName: string;
  trustLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface ProfileData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
    registrationDate: Date;
  };
  accountStatus: {
    isActive: boolean;
    isPaused: boolean;
    trustLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
    totalLeadsPurchased: number;
    accountAge: number;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    autoRenewPostcodes: boolean;
    maxDailySpend: number;
  };
  businessInfo: {
    companyNumber: string;
    vatNumber: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      postcode: string;
    };
  };
}

const AssessorProfile: React.FC<AssessorProfileProps> = ({
  token,
  assessorId,
  assessorName,
  trustLevel
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'settings' | 'postcodes' | 'security'>('account');
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Mock profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      name: assessorName,
      email: 'john.smith@epc-assessments.co.uk',
      phone: '+44 7700 900123',
      company: 'Smith Energy Solutions Ltd',
      registrationDate: new Date('2024-08-15')
    },
    accountStatus: {
      isActive: true,
      isPaused: false,
      trustLevel,
      totalLeadsPurchased: 234,
      accountAge: 5 // months
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      autoRenewPostcodes: true,
      maxDailySpend: 50
    },
    businessInfo: {
      companyNumber: '12345678',
      vatNumber: 'GB123456789',
      address: {
        line1: '123 Energy Street',
        line2: 'Business Park',
        city: 'Manchester',
        postcode: 'M1 2AB'
      }
    }
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getTrustLevelDisplay = (level: string) => {
    const displays = {
      bronze: { color: '#cd7f32', label: 'Bronze' },
      silver: { color: '#c0c0c0', label: 'Silver' },
      gold: { color: '#ffd700', label: 'Gold' },
      platinum: { color: '#e5e4e2', label: 'Platinum' }
    };
    return displays[level as keyof typeof displays] || displays.bronze;
  };

  const handlePauseAccount = () => {
    setProfileData(prev => ({
      ...prev,
      accountStatus: { ...prev.accountStatus, isPaused: true, isActive: false }
    }));
    setShowPauseModal(false);
  };

  const handleResumeAccount = () => {
    setProfileData(prev => ({
      ...prev,
      accountStatus: { ...prev.accountStatus, isPaused: false, isActive: true }
    }));
    setShowResumeModal(false);
  };

  return (
    <div className="assessor-profile">
      <div className="profile-header">
        <div className="profile-title-section">
          <h2>Account Settings</h2>
          <p>Manage your profile, preferences, and account status</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account Details
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          className={`tab-btn ${activeTab === 'postcodes' ? 'active' : ''}`}
          onClick={() => setActiveTab('postcodes')}
        >
          Post Code Regions
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      {/* Account Details Tab (formerly Overview) */}
      {activeTab === 'account' && (
        <div className="tab-content">
          {/* Account Summary - First */}
          <div className="profile-card" style={{marginBottom: '32px'}}>
            <h3>Account Summary</h3>
            <div className="profile-field">
              <span className="field-label">Account Status:</span>
              <span
                className="field-value"
                style={{
                  color: profileData.accountStatus.isPaused ? '#dc2626' : '#059669',
                  fontWeight: '600'
                }}
              >
                {profileData.accountStatus.isPaused ? 'Paused' : 'Active'}
              </span>
            </div>
            <div className="profile-field">
              <span className="field-label">Account Level:</span>
              <span
                className="trust-badge-profile"
                style={{
                  backgroundColor: getTrustLevelDisplay(profileData.accountStatus.trustLevel).color,
                  color: 'white'
                }}
              >
                {getTrustLevelDisplay(profileData.accountStatus.trustLevel).label}
              </span>
            </div>
            <div className="profile-field">
              <span className="field-label">Member Since:</span>
              <span className="field-value">{formatDate(profileData.personalInfo.registrationDate)}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Total Leads:</span>
              <span className="field-value">{profileData.accountStatus.totalLeadsPurchased}</span>
            </div>
          </div>

          {/* Personal Details */}
          <div className="profile-card" style={{marginBottom: '32px'}}>
            <h3>Personal Details</h3>
            <div className="profile-field">
              <span className="field-label">Full Name:</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span className="field-value">{profileData.personalInfo.name}</span>
                <button className="edit-btn" style={{fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>[Edit]</button>
              </div>
            </div>
            <div className="profile-field">
              <span className="field-label">Email Address:</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span className="field-value">{profileData.personalInfo.email}</span>
                <button className="edit-btn" style={{fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>[Edit]</button>
              </div>
            </div>
            <div className="profile-field">
              <span className="field-label">Phone Number:</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span className="field-value">{profileData.personalInfo.phone}</span>
                <button className="edit-btn" style={{fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>[Edit]</button>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="profile-card">
            <h3>Business Details</h3>
            <div className="profile-field">
              <span className="field-label">Trading/Business Name:</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span className="field-value">Smith Energy Solutions</span>
                <button className="edit-btn" style={{fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>[Edit]</button>
              </div>
            </div>
            <div className="profile-field">
              <span className="field-label">Company Name:</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span className="field-value">{profileData.personalInfo.company}</span>
                <button className="edit-btn" style={{fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>[Edit]</button>
              </div>
            </div>
            <div className="profile-field">
              <span className="field-label">Company Number:</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span className="field-value">{profileData.businessInfo.companyNumber}</span>
                <button className="edit-btn" style={{fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>[Edit]</button>
              </div>
            </div>
            <div className="profile-field">
              <span className="field-label">Registered Address:</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span className="field-value">{profileData.businessInfo.address.line1}, {profileData.businessInfo.address.line2}, {profileData.businessInfo.address.city}, {profileData.businessInfo.address.postcode}</span>
                <button className="edit-btn" style={{fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>[Edit]</button>
              </div>
            </div>
            <div className="profile-field">
              <span className="field-label">VAT Number:</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span className="field-value">{profileData.businessInfo.vatNumber}</span>
                <button className="edit-btn" style={{fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>[Edit]</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="tab-content">
          <div className="preferences-section">
            <h3>Lead Notifications</h3>
            <div className="preference-item">
              <div style={{marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: '500'}}>New Lead Alerts</div>
              <p className="preference-description" style={{marginLeft: 0, marginBottom: '12px'}}>How would you like to receive notifications when new leads match your postcodes?</p>
              <div style={{display: 'flex', gap: '24px'}}>
                <label className="preference-label" style={{opacity: 0.6, cursor: 'not-allowed'}}>
                  <input type="checkbox" checked disabled />
                  <span>Email (Required)</span>
                </label>
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.smsNotifications}
                    onChange={() => {/* Handle change */}}
                  />
                  <span>SMS</span>
                </label>
              </div>
            </div>

            <h3 style={{marginTop: '32px'}}>Account Notifications</h3>
            <div className="preference-item">
              <div style={{marginBottom: '8px', color: '#4b5563', fontSize: '14px', fontWeight: '500'}}>System Updates</div>
              <p className="preference-description" style={{marginLeft: 0, marginBottom: '12px'}}>Payment confirmations, spending limits reached, and account issues</p>
              <div style={{display: 'flex', gap: '24px'}}>
                <label className="preference-label" style={{opacity: 0.6, cursor: 'not-allowed'}}>
                  <input type="checkbox" checked disabled />
                  <span>Email (Required)</span>
                </label>
                <label className="preference-label">
                  <input
                    type="checkbox"
                    onChange={() => {/* Handle change */}}
                  />
                  <span>SMS</span>
                </label>
              </div>
            </div>

            <h3 style={{marginTop: '32px'}}>Marketing Communications</h3>
            <div className="preference-item">
              <label className="preference-label">
                <input
                  type="checkbox"
                  onChange={() => {/* Handle change */}}
                />
                <span>Partner Offers</span>
              </label>
              <p className="preference-description">Special offers from trusted EPC industry suppliers and partners</p>
            </div>
            <div className="preference-item">
              <label className="preference-label">
                <input
                  type="checkbox"
                  checked
                  onChange={() => {/* Handle change */}}
                />
                <span>Product Updates</span>
              </label>
              <p className="preference-description">New features and improvements to the platform</p>
            </div>
            <div className="preference-item">
              <label className="preference-label">
                <input
                  type="checkbox"
                  checked
                  onChange={() => {/* Handle change */}}
                />
                <span>Industry News</span>
              </label>
              <p className="preference-description">EPC regulation changes and market insights</p>
            </div>
          </div>
        </div>
      )}

      {/* Post Code Regions Tab */}
      {activeTab === 'postcodes' && (
        <div className="tab-content">
          <PostCodeRegionsPreferences
            token={token}
            assessorId={assessorId}
            onSave={(selectedRegions) => {
              console.log('Saved regions:', selectedRegions);
              // In real app, this would update the main Post Codes page filter
            }}
          />
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="tab-content">
          <div className="preferences-section">
            <h3>Account Security</h3>
            <div className="preference-item">
              <div className="preference-label" style={{justifyContent: 'space-between'}}>
                <div>
                  <div style={{fontWeight: '600', marginBottom: '4px'}}>Password</div>
                  <p className="preference-description" style={{margin: 0}}>Change your account password</p>
                </div>
                <button className="add-assessor-btn">Change Password</button>
              </div>
            </div>

            <div className="preference-item">
              <div className="preference-label" style={{justifyContent: 'space-between'}}>
                <div>
                  <div style={{fontWeight: '600', marginBottom: '4px'}}>Export Account Data</div>
                  <p className="preference-description" style={{margin: 0}}>Download all your account data and activity history</p>
                </div>
                <button className="add-assessor-btn">Export Data</button>
              </div>
            </div>

            <div className="preference-item" style={{borderBottom: 'none'}}>
              <div className="preference-label" style={{justifyContent: 'space-between'}}>
                <div>
                  <div style={{fontWeight: '600', marginBottom: '4px', color: '#dc2626'}}>Close Account</div>
                  <p className="preference-description" style={{margin: 0}}>Permanently delete your account and all data</p>
                </div>
                <button className="btn" style={{background: '#dc2626', color: 'white'}}>Close Account</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pause Account Modal */}
      {showPauseModal && (
        <div className="modal-overlay">
          <div className="modal-content pause-modal">
            <div className="modal-header">
              <div className="modal-title">Pause Lead Purchasing</div>
              <div className="modal-subtitle">Temporarily suspend all lead acquisition</div>
              <button
                className="close-button"
                onClick={() => setShowPauseModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="pause-info">
                <div className="info-section">
                  <h4>What happens when you pause?</h4>
                  <ul className="pause-effects">
                    <li>✋ No new leads will be purchased</li>
                    <li>📍 Your post code selections will be preserved</li>
                    <li>💰 No charges will be made during pause</li>
                    <li>🔄 You can resume anytime from your profile</li>
                  </ul>
                </div>

                <div className="current-status">
                  <div className="status-item">
                    <span className="status-label">Current Status:</span>
                    <span className="status-value active">Active</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Active Post Codes:</span>
                    <span className="status-value">12 areas</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPauseModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePauseAccount}
              >
                Pause Purchasing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Account Modal */}
      {showResumeModal && (
        <div className="modal-overlay">
          <div className="modal-content resume-modal">
            <div className="modal-header">
              <div className="modal-title">Resume Lead Purchasing</div>
              <div className="modal-subtitle">Reactivate your account for lead acquisition</div>
              <button
                className="close-button"
                onClick={() => setShowResumeModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="resume-info">
                <div className="info-section">
                  <h4>Ready to resume purchasing?</h4>
                  <ul className="resume-effects">
                    <li>▶️ Lead purchasing will resume immediately</li>
                    <li>📍 Your 12 post codes are still active</li>
                    <li>💰 Billing will continue as normal</li>
                    <li>🔔 You'll receive lead notifications again</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowResumeModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleResumeAccount}
              >
                Resume Purchasing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessorProfile;