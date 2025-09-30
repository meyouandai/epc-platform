import React, { useState, useEffect } from 'react';
import { apiCall } from '../../utils/api';

interface AdminProfileProps {
  token: string;
}

const AdminProfile: React.FC<AdminProfileProps> = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load current admin profile data
  useEffect(() => {
    // First, pre-populate from localStorage immediately
    const savedAdminName = localStorage.getItem('admin_name') || '';
    const savedEmail = localStorage.getItem('admin_email') || '';

    // Parse first/last name from saved name
    const nameParts = savedAdminName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Set initial data from localStorage
    setProfileData({
      firstName,
      lastName,
      email: savedEmail,
      newPassword: '',
      confirmPassword: ''
    });

    const loadProfile = async () => {
      try {
        const response = await apiCall('/api/admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Update with API data if available
          setProfileData({
            firstName: data.firstName || firstName,
            lastName: data.lastName || lastName,
            email: data.email || savedEmail,
            newPassword: '',
            confirmPassword: ''
          });
        } else {
          // If API fails, keep localStorage data - no error needed
          console.log('API profile fetch failed, using localStorage data');
        }
      } catch (error) {
        // If network error, keep localStorage data - no error needed
        console.log('Network error loading profile, using localStorage data');
      } finally {
        setLoadingProfile(false);
      }
    };

    // Add small delay to show localStorage data first, then enhance with API
    setTimeout(() => {
      setLoadingProfile(false);
    }, 100);

    loadProfile();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (profileData.newPassword && profileData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const updateData: any = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email
      };

      // Only include password if it's being changed
      if (profileData.newPassword) {
        updateData.password = profileData.newPassword;
      }

      const response = await apiCall('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        // Clear password fields after successful update
        setProfileData({
          ...profileData,
          newPassword: '',
          confirmPassword: ''
        });

        // Update localStorage if name changed
        if (updateData.firstName && updateData.lastName) {
          localStorage.setItem('admin_name', `${updateData.firstName} ${updateData.lastName}`);
        }
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="admin-profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <h2>Admin Profile</h2>
        <p>Manage your account information and settings</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="admin-profile-form">
        <div className="form-section">
          <h3>Personal Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Change Password</h3>
          <p className="section-description">Leave blank to keep current password</p>

          <div className="form-row">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={profileData.newPassword}
                onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={profileData.confirmPassword}
                onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="update-btn" disabled={loading}>
            {loading ? 'Updating Profile...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;