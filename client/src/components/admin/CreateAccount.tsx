import React, { useState } from 'react';

interface CreateAccountProps {
  token: string;
}

const CreateAccount: React.FC<CreateAccountProps> = ({ token }) => {
  const [accountType, setAccountType] = useState<'admin' | 'assessor'>('assessor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Assessor form data
  const [assessorData, setAssessorData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phoneNumber: '',
    email: '',
    accreditationNumber: '',
    accreditationCompany: '',
    password: '',
    confirmPassword: ''
  });

  // Admin form data
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleAssessorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (assessorData.password !== assessorData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (assessorData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Call the assessor registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${assessorData.firstName} ${assessorData.lastName}`,
          company: assessorData.company || '',
          email: assessorData.email,
          password: assessorData.password,
          phone: assessorData.phoneNumber,
          price: '£80' // Default price
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create assessor account');
      }

      if (data.success) {
        setSuccess(`Assessor account created successfully for ${assessorData.firstName} ${assessorData.lastName}!`);
        setAssessorData({
          firstName: '',
          lastName: '',
          company: '',
          phoneNumber: '',
          email: '',
          accreditationNumber: '',
          accreditationCompany: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(data.error || 'Failed to create assessor account');
      }
    } catch (error: any) {
      console.error('Assessor creation error:', error);
      setError(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (adminData.password !== adminData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (adminData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Mock API response for now - replace with real API later
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      // Simulate successful account creation
      setSuccess(`Admin account created successfully for ${adminData.firstName} ${adminData.lastName}!`);
      setAdminData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // TODO: Replace with actual API call to /api/admin/create-admin
      console.log('Admin account data:', {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        password: adminData.password
      });
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-header">
        <h2>Create New Account</h2>
        <p>Add new users to the EPC platform</p>
      </div>

      {/* Account Type Toggle */}
      <div className="account-type-toggle">
        <button
          className={`toggle-btn ${accountType === 'assessor' ? 'active' : ''}`}
          onClick={() => setAccountType('assessor')}
        >
          Assessor
        </button>
        <button
          className={`toggle-btn ${accountType === 'admin' ? 'active' : ''}`}
          onClick={() => setAccountType('admin')}
        >
          Admin
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Assessor Form */}
      {accountType === 'assessor' && (
        <form onSubmit={handleAssessorSubmit} className="create-account-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={assessorData.firstName}
                onChange={(e) => setAssessorData({ ...assessorData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                value={assessorData.lastName}
                onChange={(e) => setAssessorData({ ...assessorData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Company (Optional)</label>
            <input
              type="text"
              value={assessorData.company}
              onChange={(e) => setAssessorData({ ...assessorData, company: e.target.value })}
              placeholder="Enter company name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={assessorData.phoneNumber}
                onChange={(e) => setAssessorData({ ...assessorData, phoneNumber: e.target.value })}
                placeholder="07700 900123"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={assessorData.email}
                onChange={(e) => setAssessorData({ ...assessorData, email: e.target.value })}
                placeholder="assessor@example.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Accreditation Number *</label>
              <input
                type="text"
                value={assessorData.accreditationNumber}
                onChange={(e) => setAssessorData({ ...assessorData, accreditationNumber: e.target.value })}
                placeholder="ACC123456"
                required
              />
            </div>
            <div className="form-group">
              <label>Accreditation Company *</label>
              <input
                type="text"
                value={assessorData.accreditationCompany}
                onChange={(e) => setAssessorData({ ...assessorData, accreditationCompany: e.target.value })}
                placeholder="e.g., Elmhurst Energy, Stroma"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={assessorData.password}
                onChange={(e) => setAssessorData({ ...assessorData, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                value={assessorData.confirmPassword}
                onChange={(e) => setAssessorData({ ...assessorData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Assessor Account'}
          </button>
        </form>
      )}

      {/* Admin Form */}
      {accountType === 'admin' && (
        <form onSubmit={handleAdminSubmit} className="create-account-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={adminData.firstName}
                onChange={(e) => setAdminData({ ...adminData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                value={adminData.lastName}
                onChange={(e) => setAdminData({ ...adminData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={adminData.email}
              onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
              placeholder="admin@epcplatform.com"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={adminData.password}
                onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                value={adminData.confirmPassword}
                onChange={(e) => setAdminData({ ...adminData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateAccount;